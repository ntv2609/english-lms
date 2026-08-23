"use client";
import React, { FC, useState } from "react";
import { styles } from "../../styles/style";
import { useResetPasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

interface Props { setRoute: (route: string) => void; }

const ResetPassword: FC<Props> = ({ setRoute }) => {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleReset = async (e: any) => {
        e.preventDefault();
        if (!code || !newPassword) return toast.error("Vui lòng điền đủ thông tin");
        const email = typeof window !== "undefined" ? localStorage.getItem("reset_email") : "";
        if (!email) return toast.error("Lỗi xác định tài khoản. Hãy thử lại!");

        try {
            await resetPassword({ email, code, newPassword }).unwrap();
            toast.success("Khôi phục mật khẩu thành công!");
            localStorage.removeItem("reset_email");
            setRoute("Login");
        } catch (error: any) {
            toast.error(error?.data?.message || "Mã không hợp lệ hoặc đã hết hạn");
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-2">Tạo mật khẩu mới</h1>
                <p className="text-sm text-neutral-500">Mã OTP gồm 6 số đã được gửi qua email</p>
            </div>
            <form onSubmit={handleReset} className="space-y-5">
                <div>
                    <label className={styles.label}>Mã xác nhận (OTP)</label>
                    <input type="number" required value={code} onChange={(e) => setCode(e.target.value)} className={styles.input} placeholder="Ví dụ: 123456" />
                </div>
                <div>
                    <label className={styles.label}>Mật khẩu mới</label>
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.input} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={isLoading} className={styles.button + " !mt-8"}>{isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}</button>
            </form>
            <p className="text-center text-sm text-neutral-500 mt-6 cursor-pointer hover:underline" onClick={() => setRoute("Login")}>Quay lại Đăng nhập</p>
        </div>
    );
};

export default ResetPassword;