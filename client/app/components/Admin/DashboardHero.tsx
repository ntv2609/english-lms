"use client";
import React, { FC } from "react";
import DashboardHeader from "./DashboardHeader";

interface Props {}

const DashboardHero: FC<Props> = (props) => {
  return (
    <div>
      <DashboardHeader />
    </div>
  );
};

export default DashboardHero;