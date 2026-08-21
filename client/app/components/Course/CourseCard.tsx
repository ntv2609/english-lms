import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Ratings from "../utils/Ratings";
import { AiOutlineUnorderedList } from "react-icons/ai";

interface Props { item: any; isProfile?: boolean; }

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`} className="group block h-full">
      <div className="w-full h-full bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 ease-out flex flex-col relative overflow-hidden group-hover:-translate-y-1">
        
        {/* Aspect Ratio Box for Image */}
        <div className="w-full aspect-[16/9] relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-black/5 dark:border-white/5">
          <Image src={item.thumbnail?.url || "/assets/banner.png"} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" alt="course thumbnail" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"/>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Tag & Rating row */}
          <div className="flex items-center justify-between mb-3">
             <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
               {item.categories || "Khoá học"}
             </span>
             <Ratings rating={item.ratings} />
          </div>

          <h3 className="font-Josefin font-bold text-lg text-black dark:text-white leading-snug mb-4 line-clamp-2">
            {item.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-black dark:text-white">
                  {/* Chuyển đổi định dạng tiền tệ VNĐ ở đây */}
                  {item.price === 0 ? "Miễn phí" : `${item.price.toLocaleString('vi-VN')} VNĐ`}
                </span>
                {item.estimatedPrice && <span className="font-mono text-xs text-neutral-400 line-through">{item.estimatedPrice.toLocaleString('vi-VN')} VNĐ</span>}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
                <span className="flex items-center gap-1"><AiOutlineUnorderedList /> {item.courseData?.length || 0} Bài</span>
                {!isProfile && <span>{item.purchased || 0} Học viên</span>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default CourseCard;