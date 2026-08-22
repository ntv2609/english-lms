"use client";
import React, { FC, useState, useEffect } from "react";
import SideBarProfile from "./SideBarProfile";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation";

type Props = { user: any; };

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const { data } = useGetUsersAllCoursesQuery(undefined, {});
  
  // Khởi tạo dispatch để dùng Redux
  const dispatch = useDispatch();

  // Next.js router
  const router = useRouter();

  // Logout mutation
  const [
    logout,
    { isLoading: isLoggingOut },
  ] = useLogoutMutation();

  // Logout handler
  // Logout handler
  const logOutHandler = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      // 1. Báo cho Server biết để xóa HttpOnly Cookies (access_token, refresh_token)
      await logout({}).unwrap();

      // KHÔNG ĐƯỢC GỌI dispatch(userLoggedOut()) TẠI ĐÂY!
      // Việc giữ lại 'user' trong Redux ở tích tắc này sẽ giúp Header.tsx không bị kích hoạt auto-login ngầm.

      // 2. Gọi signOut của NextAuth và để nó TỰ ĐỘNG CHUYỂN HƯỚNG về trang chủ.
      // Hành động callbackUrl này sẽ ép trình duyệt làm mới (hard reload) trang.
      // Khi trang reload, toàn bộ Redux State (bao gồm user và apiSlice) sẽ tự động sạch sẽ.
      signOut({ callbackUrl: "/" });

    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(
        error?.data?.message ||
        error?.message ||
        "Đăng xuất thất bại, vui lòng thử lại!"
      );
    }
  };

  useEffect(() => {
    if (data && user?.courses) {
      const arr = user.courses.map((uc: any) => data.courses.find((c: any) => c._id === uc.courseId)).filter(Boolean);
      setCourses(arr);
    }
  }, [data, user]);

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#050505] min-h-[85vh] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-[250px] shrink-0">
          <div className="sticky top-28">
            <SideBarProfile user={user} active={active} avatar={user?.avatar?.url} setActive={setActive} logOutHandler={logOutHandler} />
          </div>
        </div>
        
        <div className="flex-1">
          {active === 1 && <ProfileInfo avatar={user?.avatar?.url} user={user} />}
          {active === 2 && <ChangePassword />}
          {active === 3 && (
            <div>
              <h1 className="text-3xl font-Josefin font-bold text-black dark:text-white mb-8">Khóa học của tôi</h1>
              {courses.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-black/20 dark:border-white/20 rounded-xl">
                   <p className="text-neutral-500 font-medium">Chưa có khóa học nào. Khám phá ngay!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {courses.map((item: any, i: number) => <CourseCard item={item} key={i} isProfile={true} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;