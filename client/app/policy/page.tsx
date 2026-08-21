"use client";
import React, { useState } from "react";
import { Heading } from "../utils/Heading";
import Header from "../components/Header";
import Policy from "../components/Policy/Policy";
import Footer from "../components/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505]">
      <Heading title="Chính sách bảo mật - EngGo" description="Chính sách." keywords="Policy" />
      <Header open={open} setOpen={setOpen} activeItem={3} setRoute={setRoute} route={route} />
      <Policy />
      <Footer />
    </div>
  );
};

export default Page;