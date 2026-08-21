import React from "react";
import { styles } from "@/app/styles/style";

const About = () => {
  return (
    <div className="w-[90%] 800px:w-[80%] m-auto min-h-[70vh] py-12">
      <h1 className={`${styles.title} 800px:text-[40px]`}>
        Về <span className="text-gradient">Chúng tôi</span>
      </h1>
      <br />
      <div className="w-full text-black dark:text-white font-Poppins text-[18px] leading-8">
        <p>
          Chào mừng bạn đến với EngGo, nền tảng học tiếng Anh trực tuyến hàng đầu dành cho cộng đồng yêu ngôn ngữ. Sứ mệnh của chúng tôi là cung cấp các khóa học tiếng Anh thực chiến, chất lượng cao, giúp bạn làm chủ giao tiếp và ngoại ngữ từ cơ bản đến nâng cao.
        </p>
        <br />
        <p>
          Với tầm nhìn trở thành trung tâm đào tạo tiếng Anh uy tín, chúng tôi luôn cập nhật những phương pháp học tiên tiến nhất như Phản xạ tự nhiên, IELTS chiến lược, Tiếng Anh Giao tiếp Công sở và nhiều hơn thế nữa. Hệ thống giảng dạy được thiết kế logic, dễ hiểu, kết hợp chặt chẽ giữa lý thuyết và thực hành tương tác.
        </p>
        <br />
        <p>
          Hãy cùng chúng tôi xây dựng một tương lai nơi mà bất kỳ ai cũng có thể tự tin sử dụng tiếng Anh thành thạo như tiếng mẹ đẻ. Chúc bạn có những giờ phút học tập hiệu quả cùng EngGo!
        </p>
      </div>
    </div>
  );
};

export default About;