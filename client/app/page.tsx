"use client";
import React, { FC, useState } from "react";
import { Heading } from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";

const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="bg-white dark:bg-[#050505]">
      <Heading title="EngGo - Premium English Platform" description="Tinh gọn, thực chiến và đột phá." keywords="English, IELTS, TOEIC" />
      <Header open={open} setOpen={setOpen} activeItem={0} route={route} setRoute={setRoute} />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;