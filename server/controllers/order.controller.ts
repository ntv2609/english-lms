import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService } from "../services/order.service";
import { redis } from "../utils/redis";
import axios from "axios";
import crypto from "crypto";
import nodeCron from "node-cron";
require("dotenv").config();

export const getAllOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const createMoMoPayment = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, amount } = req.body;
        const userId = req.user?._id?.toString();

        if (!userId) return next(new ErrorHandler("Không tìm thấy thông tin người dùng", 400));
        const user = await userModel.findById(userId);
        if (!user) return next(new ErrorHandler("Không tìm thấy người dùng", 404));

        const courseExistInUser = user?.courses?.some((c: any) => c.courseId.toString() === courseId.toString());
        if (courseExistInUser) return next(new ErrorHandler("Bạn đã mua khóa học này rồi", 400));

        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler("Không tìm thấy khóa học", 404));

        // TẠO ĐƠN HÀNG PENDING TRƯỚC KHI GỌI MOMO
        const newOrder = await OrderModel.create({
            courseId: courseId.toString(),
            userId: userId.toString(),
            status: "Pending"
        });

        const partnerCode = process.env.MOMO_PARTNER_CODE as string;
        const accessKey = process.env.MOMO_ACCESS_KEY as string;
        const secretKey = process.env.MOMO_SECRET_KEY as string;
        const redirectUrl = process.env.MOMO_REDIRECT_URL as string;
        const ipnUrl = process.env.MOMO_IPN_URL as string;
        const momoApiUrl = "https://test-payment.momo.vn/v2/gateway/api/create";

        const orderInfo = `Thanh toán khóa học: ${course.name}`;
        const amountStr = amount.toString();
        const orderId = `${partnerCode}-${new Date().getTime()}`;
        const requestId = orderId;
        const requestType = "captureWallet";
        const extraData = `orderDbId=${newOrder._id.toString()}`;

        const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        const requestBody = {
            partnerCode, partnerName: "Test", storeId: "MomoTestStore", requestId, amount: amountStr, orderId, orderInfo,
            redirectUrl, ipnUrl, lang: "vi", requestType, autoCapture: true, extraData, signature,
        };

        const response = await axios.post(momoApiUrl, requestBody);

        res.status(200).json({ success: true, payUrl: response.data.payUrl, qrCodeUrl: response.data.qrCodeUrl });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const webhookMoMo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = req.body;
        const accessKey = process.env.MOMO_ACCESS_KEY as string;
        const secretKey = process.env.MOMO_SECRET_KEY as string;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        const generatedSignature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        if (signature !== generatedSignature) return res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });

        const params = new URLSearchParams(extraData);
        const orderDbId = params.get("orderDbId") as string;
        const order = await OrderModel.findById(orderDbId);

        if (order && order.status === "Pending") {
            if (resultCode === 0) {
                order.status = "Success";
                order.paymentInfo = req.body;
                await order.save();

                const user = await userModel.findById(order.userId);
                const course = await CourseModel.findById(order.courseId);

                if (user && course) {
                    user.courses.push({ courseId: course._id.toString() });
                    await user.save();
                    await redis.set(user._id.toString(), JSON.stringify(user));

                    course.purchased = (course.purchased || 0) + 1;
                    await course.save();

                    await NotificationModel.create({
                        userId: user._id.toString(),
                        title: "Đơn hàng thành công",
                        message: `Bạn đã mua thành công khóa học: ${course.name}`,
                    });

                    const mailData = {
                        order: {
                            _id: order._id.toString().slice(0, 6),
                            name: course.name,
                            price: amount,
                            date: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }),
                        }
                    };
                    try {
                        await sendMail({ email: user.email, subject: "Xác nhận đơn hàng", template: "order-confirmation.ejs", data: mailData });
                    } catch (error) {}
                }
            } else {
                order.status = "Failed";
                order.paymentInfo = req.body;
                await order.save();
            }
        }
        res.status(200).json({ success: true });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// HOÀN TIỀN
export const refundOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.body;
        const order = await OrderModel.findById(orderId);

        if (!order) return next(new ErrorHandler("Không tìm thấy đơn hàng", 404));
        if (order.status !== "Success") return next(new ErrorHandler("Chỉ có thể hoàn tiền đơn hàng đã Success", 400));

        order.status = "Refunded";
        await order.save();

        const user = await userModel.findById(order.userId);
        if (user) {
            user.courses = user.courses.filter(c => c.courseId.toString() !== order.courseId.toString());
            await user.save();
            await redis.set(user._id.toString(), JSON.stringify(user));
        }

        const course = await CourseModel.findById(order.courseId);
        if (course) {
            course.purchased = Math.max(0, (course.purchased || 1) - 1);
            await course.save();
            await redis.set(course._id.toString(), JSON.stringify(course), "EX", 604800);
        }

        res.status(200).json({ success: true, message: "Hoàn tiền thành công", order });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// CRON JOB: Hủy các đơn hàng Pending quá 10 phút
nodeCron.schedule("*/5 * * * *", async () => {
    try {
        const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
        const expiredOrders = await OrderModel.updateMany(
            { status: "Pending", createdAt: { $lt: tenMinsAgo } },
            { $set: { status: "Expired" } }
        );
        if(expiredOrders.modifiedCount > 0) {
            console.log(`Đã hủy ${expiredOrders.modifiedCount} đơn hàng quá hạn thanh toán`);
        }
    } catch (error) {
        console.log("Lỗi cronjob hủy đơn:", error);
    }
});