import React, { FC } from "react";
import Ratings from "../utils/Ratings";

interface Props { item: any; }

const ReviewCard: FC<Props> = ({ item }) => {
  return (
    <div className="p-8 bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 rounded-2xl flex flex-col h-full hover:border-black/10 dark:hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4 mb-6">
        <img src={item.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover grayscale" />
        <div>
          <h4 className="font-Josefin font-bold text-black dark:text-white text-lg">{item.name}</h4>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-0.5">{item.profession}</p>
        </div>
        <div className="ml-auto"><Ratings rating={item.rating} /></div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-light italic">"{item.comment}"</p>
    </div>
  );
};

export default ReviewCard;