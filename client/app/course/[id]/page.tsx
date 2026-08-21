"use client";
import React from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

const Page = ({ params }: { params: { id: string } }) => {
  return <CourseDetailsPage id={params.id} />;
};

export default Page;