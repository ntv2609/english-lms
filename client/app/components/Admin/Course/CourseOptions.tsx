import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

interface Props {
  active: number;
  setActive: (active: number) => void;
}

const CourseOptions: FC<Props> = ({ active }) => {
  const options = ["Tổng quan", "Thông tin thêm", "Nội dung học", "Xem trước"];

  return (
    <div className="w-full pl-10 border-l border-black/5 dark:border-white/5">
      {options.map((option, index) => (
        <div key={index} className="relative flex items-center py-6">
          <div className={`absolute -left-[56px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors duration-300 ${active >= index ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"}`}>
            <IoMdCheckmark size={18} />
          </div>
          {index !== options.length - 1 && (
            <div className={`absolute -left-[41px] top-[40px] w-[2px] h-[40px] ${active > index ? "bg-blue-600" : "bg-neutral-200 dark:bg-neutral-800"}`} />
          )}
          <h5 className={`font-sans text-sm font-medium tracking-wide ${active === index ? "text-black dark:text-white" : "text-neutral-400"}`}>
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;