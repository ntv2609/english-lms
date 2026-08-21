"use client";
import React, { FC, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardWidgets from "./Widgets/DashboardWidgets";

interface Props {
  isDashboard?: boolean;
}

const DashboardHero: FC<Props> = ({ isDashboard }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full relative">
      <DashboardHeader open={open} setOpen={setOpen} />
      {isDashboard && (
        <div className="p-6 md:p-10 pt-24 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-Josefin font-bold tracking-tight text-black dark:text-white">Tổng quan hệ thống</h1>
            <p className="text-sm font-Poppins text-neutral-500 mt-1">Dữ liệu phân tích và tình trạng hoạt động theo thời gian thực</p>
          </div>
          <DashboardWidgets open={open} />
        </div>
      )}
    </div>
  );
};

export default DashboardHero;