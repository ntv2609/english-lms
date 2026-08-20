"use client";
import React, { useState } from "react";
import { Heading } from "../utils/Heading";
import Header from "../components/Header";
import About from "../components/About/About";
import Footer from "../components/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Về chúng tôi - ELearning"
        description="ELearning là nền tảng học tập lập trình chất lượng cao."
        keywords="Programming, MERN, Redux"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <About />
      <Footer />
    </div>
  );
};

export default Page;