import React from "react";
import { styles } from "@/app/styles/style";

const About = () => {
  return (
    <div className="w-[90%] md:w-[70%] max-w-4xl m-auto min-h-[70vh] py-24 relative z-10">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <h1 className={`${styles.title} text-left md:text-[64px] mb-8 leading-tight`}>
        Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">EngGo.</span>
      </h1>
      <div className="w-full text-neutral-600 dark:text-neutral-400 font-Poppins text-[18px] md:text-[20px] leading-[1.8] space-y-8 font-light">
        <p>
          Chào mừng bạn đến với EngGo, nền tảng học tiếng Anh trực tuyến được thiết kế với tiêu chuẩn khắt khe nhất. Sứ mệnh của chúng tôi là phá vỡ lối mòn giáo dục truyền thống, mang đến trải nghiệm học tập thực chiến, sắc bén và đậm chất công nghệ.
        </p>
        <div className="pl-6 border-l-2 border-black dark:border-white py-2">
          <p className="text-black dark:text-white font-medium italic">
            "Không chỉ là ngôn ngữ, chúng tôi trao cho bạn chiếc chìa khóa để hội nhập toàn cầu."
          </p>
        </div>
        <p>
          Hệ thống giảng dạy của EngGo được xây dựng dựa trên sự tối giản: Loại bỏ lý thuyết rườm rà, tập trung 100% vào phản xạ tự nhiên, IELTS chiến lược và Tiếng Anh Giao tiếp Công sở. Giao diện bạn đang trải nghiệm được thiết kế riêng biệt để triệt tiêu mọi sự xao nhãng, giúp tâm trí bạn hoàn toàn tĩnh lặng để tiếp thu kiến thức.
        </p>
        <p>
          Tương lai thuộc về những người dám hành động. Bắt đầu hành trình tinh gọn hóa ngôn ngữ cùng EngGo ngay hôm nay.
        </p>
      </div>
    </div>
  );
};

export default About;