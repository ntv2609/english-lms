"use client";
import React, { FC } from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import { Heading } from "../../../../app/utils/Heading";
import EditCourse from "../../../components/Admin/Course/EditCourse";
import DashboardHeader from "../../../components/Admin/DashboardHeader";
import AdminProtected from "../../../hooks/adminProtected";

interface Props {
  params: {
    id: string;
  };
}

const Page: FC<Props> = ({ params }) => {
  const id = params.id;

  return (
    <div>
      <AdminProtected>
        <Heading
          title="ELearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <EditCourse id={id} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;