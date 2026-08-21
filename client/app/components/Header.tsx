"use client";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useSocialAuthMutation, useLogoutQuery } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

interface Props { open: boolean; setOpen: (open: boolean) => void; activeItem: number; route: string; setRoute: (route: string) => void; }

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  useLogoutQuery(undefined, { skip: !logout });

  useEffect(() => {
    if (!user && data) socialAuth({ email: data?.user?.email, name: data?.user?.name, avatar: data?.user?.image });
    if (data === null && isSuccess) setLogout(true);
    if (data !== null && isSuccess) { toast.success("Đăng nhập thành công"); setOpen(false); }
  }, [data, user, isSuccess, socialAuth, setOpen]);

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative z-[99]">
      <div className={`fixed top-0 left-0 w-full transition-all duration-300 ${active ? "bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-Josefin font-bold tracking-tighter text-black dark:text-white">EngGo<span className="text-blue-500">.</span></Link>
          
          <div className="hidden md:flex items-center gap-8">
            <NavItems activeItem={activeItem} isMobile={false} />
            <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {user ? (
                <Link href="/profile">
                  <img src={user.avatar?.url || "/assets/avatar.png"} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-black/10 dark:border-white/10 hover:ring-2 ring-blue-500 transition-all"/>
                </Link>
              ) : (
                <button onClick={() => setOpen(true)} className="px-5 py-2 text-sm font-bold tracking-wider uppercase text-white bg-black dark:bg-white dark:text-black rounded-full hover:-translate-y-0.5 transition-transform shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">Đăng nhập</button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <HiOutlineMenuAlt3 size={24} className="text-black dark:text-white" onClick={() => setOpenSidebar(true)} />
          </div>
        </div>
      </div>

      {openSidebar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] md:hidden flex justify-end" onClick={(e) => e.target === e.currentTarget && setOpenSidebar(false)}>
          <div className="w-[280px] bg-white dark:bg-[#0A0A0A] h-full p-6 shadow-2xl border-l border-white/10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-Josefin font-bold">Menu</span>
            </div>
            <NavItems activeItem={activeItem} isMobile={true} />
            <div className="mt-8 border-t border-black/10 dark:border-white/10 pt-8">
              {user ? (
                <Link href="/profile" className="flex items-center gap-3">
                  <img src={user.avatar?.url || "/assets/avatar.png"} className="w-10 h-10 rounded-full"/>
                  <span className="font-semibold text-sm">{user.name}</span>
                </Link>
              ) : (
                <button onClick={() => setOpen(true)} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wider rounded-lg">Đăng nhập</button>
              )}
            </div>
          </div>
        </div>
      )}

      {open && route === "Login" && <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login} />}
      {open && route === "Sign-Up" && <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={SignUp} />}
      {open && route === "Verification" && <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Verification} />}
    </div>
  );
};

export default Header;