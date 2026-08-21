"use client";
import React, { FC } from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import { Heading } from "../../../app/utils/Heading";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import AdminProtected from "../../hooks/adminProtected";

interface Props {}

const Page: FC<Props> = (props) => {
  return (
    <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen">
      <AdminProtected>
        <Heading
          title="ELearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex h-screen overflow-hidden">
          <div className="w-[80px] md:w-[250px] shrink-0 border-r border-black/5 dark:border-white/5">
            <AdminSidebar />
          </div>
          <div className="flex-1 overflow-y-auto relative">
            <DashboardHeader />
            <div className="p-6 md:p-10 pt-24"><CreateCourse /></div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;