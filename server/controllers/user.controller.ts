require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ActionLogModel from "../models/actionLog.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById, getAllUsersService, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

interface IRegistrationBody { name: string; email: string; password?: string; avatar?: string; }
interface IActivationToken { token: string; activationCode: string; }

export const registrationUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) return next(new ErrorHandler("Email đã tồn tại", 400));

        const user: IRegistrationBody = { name, email, password };
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        console.log(`🔥 MÃ OTP CỦA [${user.email}] LÀ: ${activationCode}`);

        try {
            const data = { user: { name: user.name }, activationCode };
            await sendMail({
                email: user.email,
                subject: "Kích hoạt tài khoản của bạn",
                template: "activation-mail.ejs",
                data,
            });

            res.status(201).json({
                success: true,
                message: `Vui lòng kiểm tra email: ${user.email} để kích hoạt tài khoản của bạn!`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, { expiresIn: "5m" });
    return { token, activationCode };
};

export const activateUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser: any = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string);

        const email = newUser.user.email;
        const attemptKey = `otp_attempts:${email}`;
        const attempts = await redis.get(attemptKey);

        if (attempts && parseInt(attempts) >= 5) {
            return next(new ErrorHandler("Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại để nhận mã mới.", 400));
        }

        if (newUser.activationCode !== activation_code) {
            await redis.incr(attemptKey);
            await redis.expire(attemptKey, 300);
            return next(new ErrorHandler("Mã kích hoạt không đúng", 400));
        }

        await redis.del(attemptKey);
        const { name, password } = newUser.user;
        const existUser = await userModel.findOne({ email });
        if (existUser) return next(new ErrorHandler("Email đã tồn tại", 400));

        await userModel.create({ name, email, password, isVerified: true });
        res.status(201).json({ success: true });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const loginUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(new ErrorHandler("Vui lòng nhập email và mật khẩu", 400));

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 400));
        if (user.isLocked) return next(new ErrorHandler("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.", 403));

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) return next(new ErrorHandler("Email hoặc mật khẩu không hợp lệ", 400));

        sendToken(user, 200, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const logoutUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        const isProduction = process.env.NODE_ENV === "production";
        let userId = "";

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as JwtPayload;
                userId = decoded?.id?.toString() || "";
            } catch (error) {}
        }

        if (userId) await redis.del(userId);

        res.clearCookie("access_token", { httpOnly: true, sameSite: isProduction ? "none" : "lax", secure: isProduction, path: "/" });
        res.clearCookie("refresh_token", { httpOnly: true, sameSite: isProduction ? "none" : "lax", secure: isProduction, path: "/" });

        return res.status(200).json({ success: true, message: "Đăng xuất thành công" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const forgotPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return next(new ErrorHandler("Tài khoản không tồn tại", 404));

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`reset_${email}`, resetCode, "EX", 300); // 5 mins

        const data = { user: { name: user.name }, resetCode };
        await sendMail({
            email: user.email,
            subject: "Yêu cầu đặt lại mật khẩu",
            template: "forgot-password.ejs",
            data,
        });

        res.status(200).json({ success: true, message: `Mã xác thực đã được gửi đến ${email}` });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code, newPassword } = req.body;
        const savedCode = await redis.get(`reset_${email}`);

        if (savedCode !== code) return next(new ErrorHandler("Mã xác thực không hợp lệ hoặc đã hết hạn", 400));

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) return next(new ErrorHandler("Tài khoản không tồn tại", 404));

        user.password = newPassword;
        await user.save();
        await redis.del(`reset_${email}`);

        res.status(200).json({ success: true, message: "Mật khẩu đã được cập nhật thành công" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        if (!decoded) return next(new ErrorHandler("Could not refresh token", 400));
        const session = await redis.get(decoded.id.toString());
        if (!session) return next(new ErrorHandler("Could not refresh token", 400));

        const user = JSON.parse(session);
        if (user.isLocked) return next(new ErrorHandler("Tài khoản của bạn đã bị khóa", 403));

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, { expiresIn: "5m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, { expiresIn: "3d" });

        req.user = user;
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800);

        if (req.originalUrl.includes("/refresh")) {
            res.status(200).json({ success: true, accessToken });
        } else {
            req.cookies.access_token = accessToken;
            next();
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        getUserById(userId?.toString() as string, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            const newUser = await userModel.create({ email, name, avatar, isVerified: true });
            sendToken(newUser, 200, res);
        } else {
            if (user.isLocked) return next(new ErrorHandler("Tài khoản bị khóa", 403));
            sendToken(user, 200, res);
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const updateUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        if (!userId) return next(new ErrorHandler("User ID not found", 400));

        const user = await userModel.findById(userId.toString());
        if (!user) return next(new ErrorHandler("User not found", 404));

        if (name) user.name = name;
        await user.save();
        await redis.set(userId.toString(), JSON.stringify(user));

        res.status(201).json({ success: true, user });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const updatePassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return next(new ErrorHandler("Vui lòng nhập mật khẩu cũ và mới", 400));

        const user = await userModel.findById(req.user?._id).select("+password");
        if (!user?.password) return next(new ErrorHandler("Invalid user", 400));

        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch) return next(new ErrorHandler("Invalid old password", 400));

        user.password = newPassword;
        await user.save();
        await redis.set(req.user?._id.toString() as string, JSON.stringify(user));

        res.status(201).json({ success: true, user });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const updateProfilePicture = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

        if (avatar && user) {
            if (user?.avatar?.public_id) await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars", width: 150 });
            user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
        }
        await user?.save();
        if (userId) await redis.set(userId.toString(), JSON.stringify(user));

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getAllUsers = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateUserRole = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        updateUserRoleService(res, id.toString(), role);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const lockUnlockUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, reason } = req.body;
        const user = await userModel.findById(id);
        const adminId = req.user?._id?.toString() || "Unknown";

        if (!user) return next(new ErrorHandler("Không tìm thấy người dùng", 404));
        if (user._id.toString() === adminId) return next(new ErrorHandler("Không thể tự khóa tài khoản của chính mình", 400));
        if (!reason) return next(new ErrorHandler("Vui lòng nhập lý do khóa/mở khóa", 400));

        user.isLocked = !user.isLocked;
        await user.save();

        await ActionLogModel.create({ adminId, targetUserId: id.toString(), action: user.isLocked ? "LOCK" : "UNLOCK", reason });
        await redis.set(id.toString(), JSON.stringify(user)); // Đồng bộ cache để block ngay lập tức

        if (user.isLocked) {
            const data = { user: { name: user.name }, reason };
            try {
                await sendMail({
                    email: user.email,
                    subject: "Thông báo khóa tài khoản",
                    template: "lock-user.ejs",
                    data,
                });
            } catch (e) {}
        }

        res.status(200).json({ success: true, message: `Tài khoản đã được ${user.isLocked ? 'khóa' : 'mở khóa'}`, user });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) return next(new ErrorHandler("Không tìm thấy người dùng", 404));

        await user.deleteOne({ _id: id });
        await redis.del(id.toString());
        res.status(200).json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});