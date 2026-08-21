"use client";
import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import { Heading } from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = { id: string; user: any; };

const CourseContent = ({ id, user }: Props) => {
  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="bg-white dark:bg-[#050505] min-h-screen">
          <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />
          <Heading title={data[activeVideo]?.title} description="Course content" keywords={data[activeVideo]?.tags} />
          
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8 px-4 md:px-8 py-8">
            <div className="xl:col-span-3">
              <CourseContentMedia data={data} id={id} activeVideo={activeVideo} setActiveVideo={setActiveVideo} user={user} refetch={refetch} />
            </div>
            <div className="xl:col-span-1 hidden xl:block border-l border-black/5 dark:border-white/5 pl-8">
              <h3 className="font-Josefin font-bold text-lg text-black dark:text-white mb-6 uppercase tracking-wide">Nội dung khóa học</h3>
              <CourseContentList setActiveVideo={setActiveVideo} data={data} activeVideo={activeVideo} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseContent;