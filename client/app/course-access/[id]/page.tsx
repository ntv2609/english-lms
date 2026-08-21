"use client";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "@/app/components/Course/CourseContent";

type Props = { params: { id: string; }; };

const Page = ({ params }: Props) => {
  const id = params.id;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      if (!data.user.courses.find((item: any) => item.courseId === id)) redirect("/");
    }
    if (error) redirect("/");
  }, [data, error, id]);

  return <>{isLoading ? <Loader /> : <CourseContent id={id} user={data?.user} />}</>;
};

export default Page;