"use client";
import React, { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import { HomeOutlinedIcon, PeopleOutlinedIcon, ReceiptOutlinedIcon, BarChartOutlinedIcon, MapOutlinedIcon, GroupsIcon, OndemandVideoIcon, VideoCallIcon, WebIcon, QuizIcon, WysiwygIcon, ManageHistoryIcon, SettingsIcon, ExitToAppIcon } from "./Icon";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter vào đây

interface ItemProps { title: string; to: string; icon: React.ReactNode; active: boolean; }

const AdminSidebar: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter(); // Khởi tạo router

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ĐÃ SỬA LỖI F5: Bỏ thẻ <Link> ảo đi và dùng sự kiện onClick gọi router.push(to)
  const Item: FC<ItemProps> = ({ title, to, icon, active }) => (
    <MenuItem active={active} icon={icon} onClick={() => router.push(to)}>
      <Typography className="!font-Poppins !text-[13px] !font-medium tracking-wide">{title}</Typography>
    </MenuItem>
  );

  return (
    <Box sx={{
      "& .pro-sidebar": { width: "100%", minWidth: "100%" },
      "& .pro-sidebar-inner": { background: "transparent !important" },
      "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
      "& .pro-inner-item": { padding: "10px 20px !important", color: theme === "dark" ? "#a3a3a3" : "#525252", transition: "all 0.2s ease" },
      "& .pro-inner-item:hover": { color: theme === "dark" ? "#fff !important" : "#000 !important", background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", borderRadius: "8px" },
      "& .pro-menu-item.active .pro-inner-item": { color: "#3b82f6 !important", background: theme === "dark" ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.05)", borderRadius: "8px" },
    }} className="h-full py-6 px-4">
      <ProSidebar collapsed={false}>
        <Menu iconShape="square">
          <div className="mb-10 px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center"><span className="text-white font-Josefin font-bold text-lg">E</span></div>
              <Typography className="!font-Josefin !font-bold !text-xl text-black dark:text-white hidden md:block">EngGo</Typography>
            </Link>
          </div>

          <Typography className="!text-[10px] !font-bold !tracking-widest uppercase text-neutral-400 mb-2 px-4 hidden md:block">Tổng quan</Typography>
          <div className="space-y-1 mb-8">
            <Item title="Dashboard" to="/admin" icon={<HomeOutlinedIcon />} active={pathname === "/admin"} />
            <Item title="Thành viên" to="/admin/users" icon={<GroupsIcon />} active={pathname === "/admin/users"} />
            <Item title="Giao dịch" to="/admin/invoices" icon={<ReceiptOutlinedIcon />} active={pathname === "/admin/invoices"} />
          </div>

          <Typography className="!text-[10px] !font-bold !tracking-widest uppercase text-neutral-400 mb-2 px-4 hidden md:block">Đào tạo</Typography>
          <div className="space-y-1 mb-8">
            <Item title="Tạo khóa học" to="/admin/create-course" icon={<VideoCallIcon />} active={pathname === "/admin/create-course"} />
            <Item title="Khóa học" to="/admin/courses" icon={<OndemandVideoIcon />} active={pathname === "/admin/courses"} />
          </div>

          <Typography className="!text-[10px] !font-bold !tracking-widest uppercase text-neutral-400 mb-2 px-4 hidden md:block">Giao diện</Typography>
          <div className="space-y-1 mb-8">
            <Item title="Trang chủ" to="/admin/hero" icon={<WebIcon />} active={pathname === "/admin/hero"} />
            <Item title="FAQ" to="/admin/faq" icon={<QuizIcon />} active={pathname === "/admin/faq"} />
            <Item title="Danh mục" to="/admin/categories" icon={<WysiwygIcon />} active={pathname === "/admin/categories"} />
          </div>

          <Typography className="!text-[10px] !font-bold !tracking-widest uppercase text-neutral-400 mb-2 px-4 hidden md:block">Thống kê</Typography>
          <div className="space-y-1 mb-8">
            <Item title="Khóa học" to="/admin/courses-analytics" icon={<BarChartOutlinedIcon />} active={pathname === "/admin/courses-analytics"} />
            <Item title="Đơn hàng" to="/admin/orders-analytics" icon={<MapOutlinedIcon />} active={pathname === "/admin/orders-analytics"} />
            <Item title="Người dùng" to="/admin/users-analytics" icon={<ManageHistoryIcon />} active={pathname === "/admin/users-analytics"} />
          </div>

          <Typography className="!text-[10px] !font-bold !tracking-widest uppercase text-neutral-400 mb-2 px-4 hidden md:block">Hệ thống</Typography>
          <div className="space-y-1">
            <Item title="Quản trị viên" to="/admin/team" icon={<PeopleOutlinedIcon />} active={pathname === "/admin/team"} />
            <Item title="Về trang chủ" to="/" icon={<ExitToAppIcon />} active={false} />
          </div>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;