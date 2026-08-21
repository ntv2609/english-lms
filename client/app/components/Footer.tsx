import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="text-2xl font-Josefin font-bold tracking-tight text-black dark:text-white">EngGo.</Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">Nền tảng học tiếng Anh chuẩn quốc tế. Tối giản, hiện đại và tập trung hoàn toàn vào chất lượng.</p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">Hệ sinh thái</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Khóa học</Link></li>
              <li><Link href="/about" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/policy" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Chính sách</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">Cộng đồng</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://github.com/ntv2609" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">Liên hệ</h3>
            <div className="space-y-3">
              <p className="text-sm text-neutral-500 font-mono">ntv2609@gmail.com</p>
              <p className="text-sm text-neutral-500 font-mono">+84 96 703 2357</p>
              <p className="text-sm text-neutral-500">ĐH Công nghiệp Hà Nội (HaUI)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-black/5 dark:border-white/5">
          <p className="text-xs font-mono text-neutral-400">© 2026 EngGo. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;