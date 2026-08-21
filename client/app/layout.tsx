"use client";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "../redux/Provider";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-Poppins" });
const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-Josefin" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${josefin.variable} font-Poppins`} suppressHydrationWarning>
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" toastOptions={{ className: 'dark:bg-[#111] dark:text-white dark:border dark:border-white/10 rounded-lg font-Poppins text-sm shadow-xl' }} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Gọi hook loadUser ngầm để cập nhật Redux State khi mở trang
  useLoadUserQuery(undefined, {});

  useEffect(() => {
    // 1. Tắt tính năng tự động ghi nhớ vị trí cuộn của trình duyệt
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // 2. Ép trang web luôn cuộn lên trên cùng mỗi khi F5
    window.scrollTo(0, 0);

    // Khởi tạo Socket
    const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
    socketId.on("connection", () => {});

    return () => {
      socketId.disconnect();
    };
  }, []);

  // Luôn trả về children để Server và Client đồng bộ HTML chuẩn SSR
  return <>{children}</>;
};