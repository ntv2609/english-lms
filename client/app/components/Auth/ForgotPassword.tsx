"use client";
import React, { FC, useState } from "react";
import { styles } from "../../styles/style";
import { useForgotPasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

interface Props { setRoute: (route: string) => void; }

const ForgotPassword: FC<Props> = ({ setRoute }) => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleForgot = async (e: any) => {
        e.preventDefault();
        if (!email) return toast.error("Vui lòng nhập email");
        try {
            await forgotPassword({ email }).unwrap();
            toast.success("Mã xác minh đã được gửi!");
            // Đẩy email qua state ảo để màn Reset Password nhận được
            if(typeof window !== "undefined") localStorage.setItem("reset_email", email);
            setRoute("Reset-Password");
        } catch (error: any) {
            toast.error(error?.data?.message || "Không thể gửi email");
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-2">Khôi phục mật khẩu</h1>
                <p className="text-sm text-neutral-500">Nhập email để nhận mã OTP khôi phục</p>
            </div>
            <form onSubmit={handleForgot} className="space-y-5">
                <div>
                    <label className={styles.label}>Email của bạn</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="name@example.com" />
                </div>
                <button type="submit" disabled={isLoading} className={styles.button + " !mt-8"}>{isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}</button>
            </form>
            <p className="text-center text-sm text-neutral-500 mt-6 cursor-pointer hover:underline" onClick={() => setRoute("Login")}>Quay lại Đăng nhập</p>
        </div>
    );
};

export default ForgotPassword;