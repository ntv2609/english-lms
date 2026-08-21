"use client";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useState } from "react";
import Loader from "../Loader/Loader";
import { Heading } from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";

interface Props { id: string; }

const CourseDetailsPage: FC<Props> = ({ id }) => {
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="bg-white dark:bg-[#050505]">
          <Heading title={`${data?.course?.name} - EngGo`} description={data?.course?.description} keywords={data?.course?.tags} />
          <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
          <CourseDetails data={data.course} setRoute={setRoute} setOpen={setOpen} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;