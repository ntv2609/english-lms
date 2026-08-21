import React, { FC } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

interface Props {
  rating: number;
}

const Ratings: FC<Props> = ({ rating }) => {
  // Thêm kiểu React.ReactNode[] để TypeScript không bắt bẻ mảng rỗng
  const stars: React.ReactNode[] = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} size={14} className="text-black dark:text-white mr-0.5" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<BsStarHalf key={i} size={13} className="text-black dark:text-white mr-0.5" />);
    } else {
      stars.push(<AiOutlineStar key={i} size={14} className="text-black dark:text-white opacity-30 mr-0.5" />);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default Ratings;