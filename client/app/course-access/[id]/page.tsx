"use client";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "@/app/components/Course/CourseContent";

type Props = { params: { id: string; }; };

const Page = ({ params }: Props) => {
  const id = params.id;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});
  const router = useRouter();

  useEffect(() => {
    if (data) {
      // Dùng router.replace thay vì redirect
      if (!data.user.courses.find((item: any) => item.courseId === id)) {
        router.replace("/");
      }
    }
    if (error) {
      router.replace("/");
    }
  }, [data, error, id, router]);

  return <>{isLoading ? <Loader /> : <CourseContent id={id} user={data?.user} />}</>;
};

export default Page;