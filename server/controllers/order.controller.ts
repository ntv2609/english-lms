import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";

// create order
export const createOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, paymentInfo } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        if(!user) {
            return next(new ErrorHandler("Không tìm thấy người dùng", 404));
        }

        const courseExistInUser = user?.courses?.some((course: any) => course.courseId.toString() === courseId.toString());

        if (courseExistInUser) {
            return next(new ErrorHandler("Bạn đã mua khóa học này rồi", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Không tìm thấy khóa học", 404));
        }

        const data: any = {
            courseId: course._id.toString(),
            userId: user._id.toString(),
            paymentInfo,
        };

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData.order });

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Xác nhận đơn hàng",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }

        user?.courses.push({ courseId: course._id.toString() });

        await redis.set(req.user?._id.toString() as string, JSON.stringify(user));

        await user?.save();

        await NotificationModel.create({
            user: user?._id.toString(),
            title: "Đơn hàng mới",
            message: `Bạn có một đơn hàng mới từ khóa học: ${course?.name}`,
        });

        if(course.purchased) {
            course.purchased += 1;
        } else {
            course.purchased = 1; // Khởi tạo nếu chưa có
        }
        await course.save();

        newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all orders (Admin only)
export const getAllOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});