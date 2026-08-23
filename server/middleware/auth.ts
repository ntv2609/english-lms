import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
        return next(new ErrorHandler("Vui lòng đăng nhập để truy cập tính năng này", 400));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
        return next(new ErrorHandler("Token truy cập không hợp lệ", 400));
    }

    const userStr = await redis.get(decoded.id.toString());

    if (!userStr) {
        return next(new ErrorHandler("Vui lòng đăng nhập để truy cập tài nguyên này", 400));
    }

    const user = JSON.parse(userStr);

    if (user.isLocked) {
        return next(new ErrorHandler("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.", 403));
    }

    req.user = user;
    next();
});

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Quyền ${req.user?.role} không được phép truy cập tài nguyên này`, 403));
        }
        next();
    }
}