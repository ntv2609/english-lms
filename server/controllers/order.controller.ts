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
import { redis } from "../utils/redis";
import axios from "axios";
import crypto from "crypto";
require("dotenv").config();

// get all orders (Admin only)
export const getAllOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// create MoMo payment
export const createMoMoPayment = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, amount } = req.body;
        const userId = req.user?._id?.toString();

        if (!userId) {
            return next(new ErrorHandler("Không tìm thấy thông tin người dùng", 400));
        }

        const user = await userModel.findById(userId);
        if (!user) {
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

        // MoMo Config
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
        const extraData = `courseId=${courseId}&userId=${userId}`; // Để truyền data qua webhook

        const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount: amountStr,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: "vi",
            requestType,
            autoCapture: true,
            extraData,
            signature,
        };

        const response = await axios.post(momoApiUrl, requestBody);

        res.status(200).json({
            success: true,
            payUrl: response.data.payUrl,
            qrCodeUrl: response.data.qrCodeUrl
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// handle MoMo Webhook IPN
export const webhookMoMo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.body;

        const accessKey = process.env.MOMO_ACCESS_KEY as string;
        const secretKey = process.env.MOMO_SECRET_KEY as string;

        // Xác thực chữ ký
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        
        const generatedSignature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        if (signature !== generatedSignature) {
            return res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });
        }

        // Nếu thanh toán thành công (resultCode == 0)
        if (resultCode === 0) {
            // Tách dữ liệu từ extraData: "courseId=xxx&userId=yyy"
            const params = new URLSearchParams(extraData);
            const courseId = params.get("courseId") as string;
            const userId = params.get("userId") as string;

            const user = await userModel.findById(userId);
            const course = await CourseModel.findById(courseId);

            if (user && course) {
                // Kiểm tra xem đã xử lý đơn này chưa để tránh webhook lặp
                const orderExist = await OrderModel.findOne({ "paymentInfo.orderId": orderId });
                if (!orderExist) {
                    const data: any = {
                        courseId: course._id.toString(),
                        userId: user._id.toString(),
                        paymentInfo: req.body,
                    };

                    await OrderModel.create(data);

                    // Cấp quyền và lưu lại user
                    user.courses.push({ courseId: course._id.toString() });
                    await user.save();
                    await redis.set(userId, JSON.stringify(user));

                    // Tăng biến đếm khóa học
                    course.purchased = (course.purchased || 0) + 1;
                    await course.save();

                    // Gửi thông báo
                    await NotificationModel.create({
                        userId: user._id.toString(),
                        title: "Đơn hàng mới",
                        message: `Bạn có một đơn hàng mới từ khóa học: ${course.name}`,
                    });

                    // Gửi email
                    const mailData = {
                        order: {
                            _id: course._id.toString().slice(0, 6),
                            name: course.name,
                            price: amount,
                            date: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }),
                        }
                    };
                    const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData.order });
                    
                    try {
                        await sendMail({
                            email: user.email,
                            subject: "Xác nhận đơn hàng MoMo",
                            template: "order-confirmation.ejs",
                            data: mailData,
                        });
                    } catch (error) {
                        console.log("Email sending error: ", error);
                    }
                }
            }
        }

        // Luôn trả về 200/204 cho MoMo để xác nhận đã nhận Webhook
        res.status(200).json({ success: true });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});