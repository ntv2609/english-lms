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

const Page: FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses.filter((item: any) => item.categories === category)
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <Heading
            title={"Khóa học - ELearning"}
            description={"Khám phá các khóa học lập trình chất lượng cao"}
            keywords={"Programming, MERN, Redux, Machine Learning"}
          />
          <br />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <div className="w-full flex items-center flex-wrap pt-5 mb-5">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                <span className="text-white">All</span>
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`h-[35px] ${
                      category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"
                    } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                    onClick={() => setCategory(item.title)}
                  >
                    <span className="text-white">{item.title}</span>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p className="text-center min-h-[50vh] flex items-center justify-center font-Poppins text-[20px] dark:text-white text-black">
                {search
                  ? "Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn!"
                  : "Không tìm thấy khóa học nào trong danh mục này!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;