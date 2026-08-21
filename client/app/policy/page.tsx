"use client";
import React, { useState } from "react";
import { Heading } from "../utils/Heading";
import Header from "../components/Header";
import Policy from "../components/Policy/Policy";
import Footer from "../components/Footer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="Chính sách bảo mật - ELearning"
        description="Chính sách bảo mật và điều khoản sử dụng của ELearning."
        keywords="Programming, Policy, Privacy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Policy />
      <Footer />
    </div>
  );
};

export default Page;