import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

export const uploadCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses" });
            data.thumbnail = { public_id: myCloud.public_id, url: myCloud.secure_url };
        }
        createCourse(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

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
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses" });
            data.thumbnail = { public_id: myCloud.public_id, url: myCloud.secure_url };
        } else if (thumbnail && thumbnail.startsWith("https")) {
            const courseData = await CourseModel.findById(courseId) as any;
            data.thumbnail = { public_id: courseData?.thumbnail.public_id, url: courseData?.thumbnail.url };
        }

        const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        if (course) await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
        await redis.del("allCourses");

        res.status(201).json({ success: true, course });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getSingleCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis.get(courseId.toString());

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({ success: true, course });
        } else {
            const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            if (!course) return next(new ErrorHandler("Không tìm thấy khóa học", 404));

            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
            res.status(200).json({ success: true, course });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllCourses = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            res.status(200).json({ success: true, courses });
        } else {
            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set("allCourses", JSON.stringify(courses));
            res.status(200).json({ success: true, courses });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getCourseByUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((c: any) => c.courseId.toString() === courseId.toString());

        if (!courseExists) return next(new ErrorHandler("Bạn chưa mua khóa học này", 403));

        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({ success: true, content });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// CẬP NHẬT TIẾN ĐỘ HỌC TẬP (TOGGLE BẬT/TẮT)
export const updateCourseProgress = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, contentId } = req.body;
        const userId = req.user?._id;
        if (!userId) return next(new ErrorHandler("User not found", 400));

        const user = await userModel.findById(userId.toString());
        if (!user) return next(new ErrorHandler("User not found", 404));

        const courseExist = user.courses.some((c: any) => c.courseId.toString() === courseId.toString());
        if (!courseExist) return next(new ErrorHandler("Bạn không sở hữu khóa học này", 403));

        let progressIndex = user.courseProgress.findIndex((p: any) => p.courseId.toString() === courseId.toString());
        let responseMessage = "";
        
        if (progressIndex === -1) {
            // Chưa từng ghi nhận tiến độ khóa này -> Push vào luôn
            user.courseProgress.push({ courseId: courseId.toString(), completedVideos: [contentId.toString()] });
            responseMessage = "Đã đánh dấu hoàn thành ✓";
        } else {
            // Tìm xem video này đã được tick hoàn thành chưa
            const videoIndex = user.courseProgress[progressIndex].completedVideos.indexOf(contentId.toString());
            
            if (videoIndex === -1) {
                // Chưa hoàn thành -> Thêm vào
                user.courseProgress[progressIndex].completedVideos.push(contentId.toString());
                responseMessage = "Đã đánh dấu hoàn thành ✓";
            } else {
                // Đã hoàn thành rồi -> Undo (Xóa đi)
                user.courseProgress[progressIndex].completedVideos.splice(videoIndex, 1);
                responseMessage = "Đã hủy đánh dấu hoàn thành";
            }
        }

        await user.save();
        await redis.set(userId.toString(), JSON.stringify(user));

        res.status(200).json({ 
            success: true, 
            message: responseMessage,
            courseProgress: user.courseProgress 
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addQuestion = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) return next(new ErrorHandler("ID nội dung không hợp lệ", 400));
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));
        if (!courseContent) return next(new ErrorHandler("Không tìm thấy nội dung khóa học", 400));

        const newQuestion: any = { user: req.user, comment: question, commentReplies: [] };
        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            userId: req.user?._id?.toString(),
            title: "Câu hỏi mới",
            message: `Có người dùng mới hỏi câu hỏi trong video khóa học: ${courseContent.title}`,
        });
        await course?.save();

        res.status(200).json({ success: true, course });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addAnswer = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) return next(new ErrorHandler("ID nội dung không hợp lệ", 400));
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));
        if (!courseContent) return next(new ErrorHandler("Không tìm thấy nội dung khóa học", 400));

        const question = courseContent.questions?.find((item: any) => item._id.equals(questionId));
        if (!question) return next(new ErrorHandler("Không tìm thấy câu hỏi", 400));

        const newAnswer: any = { user: req.user, comment: answer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        question.commentReplies.push(newAnswer);
        await course?.save();

        if (req.user?._id?.toString() !== (question.user as any)?._id?.toString()) {
            const data = { name: (question.user as any)?.name, title: courseContent.title };
            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await sendMail({ email: (question.user as any)?.email, subject: "Đã có phản hồi cho câu hỏi", template: "question-reply.ejs", data });
            } catch (error: any) { }
        } else {
            await NotificationModel.create({
                userId: req.user?._id?.toString(),
                title: "Phản hồi câu hỏi mới",
                message: `Người dùng ${(question.user as any)?.name} đã tự phản hồi câu hỏi của họ trong video: ${courseContent.title}`,
            });
        }
        res.status(200).json({ success: true, course });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.some((c: any) => c.courseId.toString() === courseId.toString());

        if (!courseExists) return next(new ErrorHandler("Bạn không đủ điều kiện để truy cập khóa học này", 403));

        const course = await CourseModel.findById(courseId);
        const { review, rating } = req.body;

        const reviewData: any = { user: req.user, comment: review, rating };
        course?.reviews.push(reviewData);

        let avg = 0;
        course?.reviews.forEach((rev: any) => { avg += rev.rating; });
        if (course) {
            course.ratings = avg / course.reviews.length;
            await course.save();
            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
        }
        await redis.del("allCourses");

        await NotificationModel.create({
            userId: req.user?._id?.toString(),
            title: "Đánh giá khóa học mới",
            message: `${req.user?.name} đã thêm đánh giá cho khóa học ${course?.name}`,
        });

        res.status(200).json({ success: true, course });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addReplyToReview = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler("Không tìm thấy khóa học", 404));

        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId.toString());
        if (!review) return next(new ErrorHandler("Không tìm thấy đánh giá", 404));

        const replyData: any = { user: req.user, comment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        if(!review.commentReplies) review.commentReplies = [];
        review.commentReplies.push(replyData);

        await course?.save();
        await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);

        res.status(200).json({ success: true, course });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllCoursesAdmin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) return next(new ErrorHandler("Không tìm thấy khóa học", 404));

        await course.deleteOne({ _id: id });
        await redis.del(id.toString());
        await redis.del("allCourses");

        res.status(200).json({ success: true, message: "Xóa khóa học thành công" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const generateVideoUrl = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        if (!videoId) return next(new ErrorHandler("Video ID là bắt buộc", 400));

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