"use client";
import React, { FC, useState, useEffect } from "react";
import SideBarProfile from "./SideBarProfile";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { apiSlice } from "@/redux/features/api/apiSlice"; // Thêm dòng này để xóa tận gốc cache RTK Query

type Props = { user: any; };

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const { data } = useGetUsersAllCoursesQuery(undefined, {});
  const dispatch = useDispatch();

  const logOutHandler = async () => { 
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/logout`, {
        method: 'POST', 
        credentials: 'include',
        cache: 'no-store'
      });
      
      // BƯỚC 1: Hủy diệt user state trong Redux
      dispatch(userLoggedOut()); 
      
      // BƯỚC 2: Hủy diệt TOÀN BỘ cache rác của RTK Query (loadUser, fetchCourses...)
      dispatch(apiSlice.util.resetApiState());
      
      // BƯỚC 3: Dọn session mạng xã hội
      await signOut({ redirect: false }); 
      
      // BƯỚC 4: Dùng replace để văng trang, người dùng ấn nút Back không thể quay lại trang profile cũ được nữa
      window.location.replace("/"); 
    } catch (error) {
      console.log("Lỗi xóa cookie backend:", error);
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