import React from "react";
import Image from "next/image";
import { styles } from "@/app/styles/style";
import ReviewCard from "../Review/ReviewCard";

export const reviews = [
  {
    name: "Nguyễn Thế Vinh",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Học sinh | TOEIC",
    comment: "Khóa học rất hay và chi tiết. Giảng viên hỗ trợ nhiệt tình.",
    rating: 5,
  },
  {
    name: "Kylian Mbappé",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "Web Developer",
    comment: "I learned a lot from this course. Highly recommended!",
    rating: 5,
  },
  {
    name: "Peter Griffin",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Software Engineer",
    comment: "The course is amazing. It helps me a lot in my career.",
    rating: 4,
  },
];

const Reviews = () => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assets/business-img.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Thành công của học viên <span className="text-gradient">là động lực của chúng tôi!</span>{" "}
            
          </h3>
          <br />
          <p className={styles.label}>
            Không chỉ dừng lại ở kiến thức nền tảng, khóa học mang đến sự hỗ trợ xuyên suốt giúp học viên tự tin giao tiếp và làm việc thực tế.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px]">
        {reviews &&
          reviews.map((item, index) => <ReviewCard item={item} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;