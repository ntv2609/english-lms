require ("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

// Parse environment variables to integrate with fallback values (Sửa lỗi chính tả)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3', 10);

// Options for cookies (Đã nhân lại công thức thời gian cho chuẩn)
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // Tính bằng phút
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // Tính bằng ngày
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to Redis (Lưu session của user vào Redis)
    redis.set(user._id.toString(), JSON.stringify(user) as any);

    // Only set secure to true & sameSite to 'none' in production (Fix lỗi chặn cookie khi Deploy)
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        accessTokenOptions.sameSite = 'none';
        
        refreshTokenOptions.secure = true;
        refreshTokenOptions.sameSite = 'none';
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};