import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

// upload course
export const uploadCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        createCourse(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// edit course
export const editCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;

        if (thumbnail && !thumbnail.startsWith("https")) {
            const courseData = await CourseModel.findById(courseId) as any;
            if(courseData?.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        } else if (thumbnail && thumbnail.startsWith("https")) {
            const courseData = await CourseModel.findById(courseId) as any;
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url,
            };
        }

        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        // FIX LỖI CACHE: Cập nhật lại cache chi tiết khóa học và xóa cache danh sách tổng
        if (course) {
            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
        }
        await redis.del("allCourses");

        res.status(201).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get single course --- without purchasing (Public)
export const getSingleCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis.get(courseId.toString());

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        } else {
            const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            if (!course) {
                return next(new ErrorHandler("Không tìm thấy khóa học", 404));
            }

            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);

            res.status(200).json({
                success: true,
                course,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all courses --- without purchasing (Public)
export const getAllCourses = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                courses,
            });
        } else {
            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            await redis.set("allCourses", JSON.stringify(courses));

            res.status(200).json({
                success: true,
                courses,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get course content --- only for valid user (Purchased)
export const getCourseByUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExists = userCourseList?.find((course: any) => course.courseId === courseId);

        if (!courseExists) {
            return next(new ErrorHandler("Bạn chưa mua khóa học này", 403));
        }

        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

// add question in course
export const addQuestion = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId } = req.body as IAddQuestionData;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("ID nội dung không hợp lệ", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Không tìm thấy nội dung khóa học", 400));
        }

        const newQuestion: any = {
            user: req.user,
            comment: question, 
            commentReplies: [],
        };

        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            userId: req.user?._id?.toString(),
            title: "Câu hỏi mới",
            message: `Có người dùng mới hỏi câu hỏi trong video khóa học: ${courseContent.title}`,
        });

        await course?.save();

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

// add answer in course question
export const addAnswer = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body as IAddAnswerData;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("ID nội dung không hợp lệ", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("Không tìm thấy nội dung khóa học", 400));
        }

        const question = courseContent.questions?.find((item: any) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler("Không tìm thấy câu hỏi", 400));
        }

        const newAnswer: any = {
            user: req.user,
            comment: answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        question.commentReplies.push(newAnswer);

        await course?.save();

        if (req.user?._id?.toString() !== (question.user as any)?._id?.toString()) {
            const data = {
                name: (question.user as any)?.name,
                title: courseContent.title,
            };

            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);

            try {
                await sendMail({
                    email: (question.user as any)?.email,
                    subject: "Đã có phản hồi cho câu hỏi của bạn",
                    template: "question-reply.ejs",
                    data,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }
        } else {
            await NotificationModel.create({
                userId: req.user?._id?.toString(),
                title: "Phản hồi câu hỏi mới",
                message: `Người dùng ${(question.user as any)?.name} đã tự phản hồi câu hỏi của họ trong video: ${courseContent.title}`,
            });
        }

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddReviewData {
    review: string;
    courseId: string;
    rating: number;
}

// add review in course
export const addReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExists = userCourseList?.some((course: any) => course.courseId.toString() === courseId.toString());

        if (!courseExists) {
            return next(new ErrorHandler("Bạn không đủ điều kiện để truy cập khóa học này", 403));
        }

        const course = await CourseModel.findById(courseId);

        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user: req.user,
            comment: review,
            rating,
        };

        course?.reviews.push(reviewData);

        let avg = 0;
        course?.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        if (course) {
            course.ratings = avg / course.reviews.length;
            await course.save();
            
            // Cập nhật lại Redis khi khóa học có sự thay đổi
            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
        }

        // BỔ SUNG ĐỂ FIX CACHE: Xóa cache danh sách để cập nhật điểm rating ngoài trang chủ
        await redis.del("allCourses");

        await NotificationModel.create({
            userId: req.user?._id?.toString(),
            title: "Đánh giá khóa học mới",
            message: `${req.user?.name} đã thêm đánh giá cho khóa học ${course?.name}`,
        });

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddReviewReplyData {
    comment: string;
    courseId: string;
    reviewId: string;
}

// add reply in review (Admin only)
export const addReplyToReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Không tìm thấy khóa học", 404));
        }

        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId.toString());

        if (!review) {
            return next(new ErrorHandler("Không tìm thấy đánh giá", 404));
        }

        const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if(!review.commentReplies){
            review.commentReplies = [];
        }

        review.commentReplies.push(replyData);

        await course?.save();

        await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all courses --- admin only
export const getAllCoursesAdmin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// delete course (Admin only)
export const deleteCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler("Không tìm thấy khóa học", 404));
        }

        await course.deleteOne({ _id: id });

        // Xóa cache chi tiết của khóa học này
        await redis.del(id.toString());
        
        // FIX ROOT CAUSE: Xóa sạch cache của mảng danh sách tổng hợp
        await redis.del("allCourses");

        res.status(200).json({
            success: true,
            message: "Xóa khóa học thành công",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Generate video URL (VdoCipher)
export const generateVideoUrl = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        
        if (!videoId) {
            return next(new ErrorHandler("Video ID là bắt buộc", 400));
        }

        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
            }
        );

        res.json(response.data);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});