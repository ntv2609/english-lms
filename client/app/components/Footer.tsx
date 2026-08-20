import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="border border-[#0000000e] dark:border-[#ffffff1e]" />
      <br />
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Giới thiệu</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Về chúng tôi</Link></li>
              <li><Link href="/privacy-policy" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link href="/faq" className="text-base text-black dark:text-gray-300 dark:hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Truy cập nhanh</h3>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Khóa học</Link></li>
              <li><Link href="/profile" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Tài khoản</Link></li>
              <li><Link href="/course-dashboard" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Không gian học tập</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Mạng xã hội</h3>
            <ul className="space-y-4">
              <li><Link href="https://www.facebook.com/vingng00" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Facebook</Link></li>
              <li><Link href="https://www.instagram.com/ngvinh26_" className="text-base text-black dark:text-gray-300 dark:hover:text-white">Instagram</Link></li>
              <li><Link href="https://github.com/ntv2609" className="text-base text-black dark:text-gray-300 dark:hover:text-white">GitHub</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[20px] font-[600] text-black dark:text-white pb-3">Contact Info</h3>
            <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
              Liên hệ: 096 703 2357
            </p>
            <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
              Địa chỉ: Đại học Công nghiệp Hà Nội (HaUI)
            </p>
            <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
              Email: ntv2609@gmail.com
            </p>
          </div>
        </div>
        <br />
        <p className="text-center text-black dark:text-white">
          ©Copyright VinhDzaiCorp 2026
        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;