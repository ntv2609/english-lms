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
          Chào mừng bạn đến với ELearning, nền tảng học tập trực tuyến hàng đầu dành cho cộng đồng lập trình viên. Sứ mệnh của chúng tôi là cung cấp các khóa học lập trình thực chiến, chất lượng cao, giúp bạn làm chủ công nghệ từ cơ bản đến nâng cao.
        </p>
        <br />
        <p>
          Với tầm nhìn trở thành trung tâm đào tạo lập trình uy tín, chúng tôi luôn cập nhật những công nghệ mới nhất như MERN Stack, Next.js, Redux, Machine Learning và nhiều hơn thế nữa. Hệ thống giảng dạy được thiết kế logic, dễ hiểu, kết hợp giữa lý thuyết và bài tập thực hành.
        </p>
        <br />
        <p>
          Hãy cùng chúng tôi xây dựng một tương lai nơi mà bất kỳ ai cũng có thể trở thành một kỹ sư phần mềm xuất sắc. Chúc bạn có những giờ phút học tập hiệu quả cùng ELearning!
        </p>
      </div>
    </div>
  );
};

export default About;