import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import Loader from "../Loader/Loader";
import { styles } from "@/app/styles/style";
import Link from "next/link";

const Courses = () => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  
  return (
    <>
      {isLoading ? <Loader /> : (
        <section className="py-24 bg-white dark:bg-[#050505]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className={`${styles.title} !text-left md:!text-[56px] leading-tight`}>
                  Khởi động hành trình <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">chinh phục tiếng Anh.</span>
                </h2>
              </div>
              <Link href="/courses" className="text-sm font-bold uppercase tracking-widest text-black dark:text-white hover:text-blue-500 transition-colors flex items-center gap-2">
                Xem tất cả <span>→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.courses?.slice(0,8).map((item: any, i: number) => <CourseCard item={item} key={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Courses;