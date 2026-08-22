"use client";
import React, { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface Props { setRoute: (route: string) => void; setOpen: (open: boolean) => void; }

const schema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (v) => await login(v),
  });

  useEffect(() => {
    if (isSuccess) { 
        toast.success("Đăng nhập thành công"); 
        setOpen(false); 
    }
    if (error) {
        console.log("🔥 LỖI TẠI LOGIN:", error);
        if ("data" in error) {
            toast.error((error as any).data.message);
        } else {
            toast.error(`Lỗi hệ thống: ${(error as any).error || "Không thể kết nối Server"}`);
        }
    }
  }, [isSuccess, error, setOpen]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-2">Chào mừng trở lại</h1>
        <p className="text-sm text-neutral-500">Đăng nhập vào không gian học tập của bạn</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={styles.label}>Email</label>
          <input type="email" name="email" value={values.email} onChange={handleChange} className={styles.input} placeholder="name@example.com" />
          {errors.email && touched.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
        </div>
        <div className="relative">
          <label className={styles.label}>Mật khẩu</label>
          <input type={show ? "text" : "password"} name="password" value={values.password} onChange={handleChange} className={styles.input} placeholder="••••••••" />
          <div className="absolute right-3 top-10 cursor-pointer text-neutral-500 hover:text-black dark:hover:text-white" onClick={() => setShow(!show)}>
            {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </div>
          {errors.password && touched.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
        </div>
        <button type="submit" className={styles.button + " !mt-8"}>Đăng nhập</button>
      </form>
      <div className="mt-8 flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6">
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest bg-white dark:bg-[#0A0A0A] px-2 absolute left-1/2 -translate-x-1/2 -mt-[33px]">Hoặc</span>
        <div className="flex w-full gap-4">
          <button onClick={() => signIn("google")} className="flex-1 flex items-center justify-center gap-2 py-2 border border-black/10 dark:border-white/10 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium text-black dark:text-white"><FcGoogle size={20}/> Google</button>
          <button onClick={() => signIn("github")} className="flex-1 flex items-center justify-center gap-2 py-2 border border-black/10 dark:border-white/10 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium text-black dark:text-white"><AiFillGithub size={20}/> GitHub</button>
        </div>
      </div>
      <p className="text-center text-sm text-neutral-500 mt-6">
        Chưa có tài khoản? <span className="text-blue-500 font-semibold cursor-pointer hover:underline" onClick={() => setRoute("Sign-Up")}>Đăng ký ngay</span>
      </p>
    </div>
  );
};

export default Login;