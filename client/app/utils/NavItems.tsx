import Link from "next/link";
import React, { FC } from "react";

export const navItemsData = [
  { name: "Trang chủ", url: "/" },
  { name: "Khóa học", url: "/courses" },
  { name: "Về chúng tôi", url: "/about" },
  { name: "FAQ", url: "/faq" },
];

interface Props { activeItem: number; isMobile: boolean; }

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden md:flex items-center gap-8">
        {navItemsData.map((i, index) => (
          <Link href={i.url} key={index} className={`text-sm font-medium tracking-wide transition-colors ${activeItem === index ? "text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:text-black dark:hover:text-white"}`}>
            {i.name}
          </Link>
        ))}
      </div>
      {isMobile && (
        <div className="flex flex-col gap-6">
          {navItemsData.map((i, index) => (
            <Link href={i.url} key={index} className={`text-2xl font-Josefin font-bold tracking-tight transition-colors ${activeItem === index ? "text-blue-600" : "text-neutral-500"}`}>
              {i.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;