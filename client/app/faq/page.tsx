"use client";
import React, { useState } from "react";
import { Heading } from "../utils/Heading";
import Header from "../components/Header";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505]">
      <Heading title="FAQ - EngGo" description="Các câu hỏi thường gặp về EngGo." keywords="FAQ, Tiếng Anh" />
      <Header open={open} setOpen={setOpen} activeItem={4} setRoute={setRoute} route={route} />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;