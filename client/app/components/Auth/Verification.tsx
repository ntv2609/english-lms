"use client";
import React, { FC, useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { styles } from "../../styles/style";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";

interface Props { setRoute: (route: string) => void; }

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [verifyNumber, setVerifyNumber] = useState<{ [key: string]: string }>({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (isSuccess) { toast.success("Kích hoạt thành công"); setRoute("Login"); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isSuccess, error, setRoute]);

  const handleInputChange = (index: number, value: string) => {
    setVerifyNumber({ ...verifyNumber, [index]: value });
    if (value === "" && index > 0) inputRefs[index - 1].current?.focus();
    else if (value.length === 1 && index < 5) inputRefs[index + 1].current?.focus();
  };

  const verificationHandler = async () => {
    const code = Object.values(verifyNumber).join("");
    if (code.length !== 6) return toast.error("Vui lòng nhập đủ 6 số");
    await activation({ activation_token: token, activation_code: code });
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-2">Xác thực tài khoản</h1>
        <p className="text-sm text-neutral-500">Nhập mã OTP gồm 6 chữ số được gửi đến email của bạn</p>
      </div>
      <div className="flex justify-center gap-2 sm:gap-3 mb-8">
        {Object.keys(verifyNumber).map((k, i) => (
          <input 
            key={k} 
            ref={inputRefs[i]} 
            type="number" 
            maxLength={1} 
            value={verifyNumber[k]} 
            onChange={(e) => handleInputChange(i, e.target.value)} 
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold bg-transparent border-2 border-black/10 dark:border-white/10 rounded-lg outline-none focus:border-blue-500 transition-colors text-black dark:text-white" 
          />
        ))}
      </div>
      <button className={styles.button} onClick={verificationHandler}>Xác nhận OTP</button>
      <p className="text-center text-sm text-neutral-500 mt-6 cursor-pointer hover:underline" onClick={() => setRoute("Login")}>Quay lại đăng nhập</p>
    </div>
  );
};

export default Verification;