"use client";
import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import { Heading } from "../utils/Heading";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";
import { styles } from "../styles/style";

const Page: FC = () => {
  const search = useSearchParams()?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let arr = data?.courses || [];
    if (category !== "All") arr = arr.filter((i: any) => i.categories === category);
    if (search) arr = arr.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase()));
    setCourses(arr);
  }, [data, category, search]);

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen">
      <Heading title="Danh mục khóa học - EngGo" description="Các khóa học tiếng Anh chuẩn quốc tế." keywords="IELTS, TOEIC, Giao tiếp" />
      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
      
      {isLoading ? <Loader /> : (
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
          <h1 className={`${styles.title} !text-left md:!text-[56px] leading-tight mb-8`}>
            Khám phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Không giới hạn.</span>
          </h1>

          <div className="flex flex-wrap gap-3 mb-12">
            <button onClick={() => setCategory("All")} className={`px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${category === "All" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-black/10 dark:border-white/10 text-neutral-500 hover:border-black dark:hover:border-white"}`}>Tất cả</button>
            {categoriesData?.layout?.categories?.map((item: any, idx: number) => (
              <button key={idx} onClick={() => setCategory(item.title)} className={`px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${category === item.title ? "bg-black text-white dark:bg-white dark:text-black" : "border border-black/10 dark:border-white/10 text-neutral-500 hover:border-black dark:hover:border-white"}`}>{item.title}</button>
            ))}
          </div>

          {courses.length === 0 ? (
             <div className="py-32 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
               <p className="text-xl font-Josefin font-medium text-neutral-500">Không tìm thấy khóa học nào phù hợp.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((item: any, i: number) => <CourseCard item={item} key={i} />)}
             </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Page;