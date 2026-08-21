"use client";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

const Hero: FC = () => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="relative w-full min-h-[90vh] flex items-center bg-white dark:bg-[#050505] overflow-hidden pt-20">
          
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          {/* Subtle Glows */}
          <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
            
            {/* Left Content */}
            <div className="space-y-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-600 dark:text-neutral-400">Nền tảng học Tiếng Anh hệ mới</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-Josefin font-bold tracking-tighter text-black dark:text-white leading-[1.1]">
                {data?.layout?.banner?.title || "Master English. Unlock the World."}
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xl">
                {data?.layout?.banner?.subTitle || "Tinh gọn, thực chiến và mạnh mẽ. Hệ thống được thiết kế triệt tiêu xao nhãng để bạn bứt tốc."}
              </p>

              <div className="relative max-w-lg group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative flex items-center bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl p-2 h-16">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khoá học IELTS, Giao tiếp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search && router.push(`/courses?title=${search}`)}
                    className="flex-1 bg-transparent border-none outline-none px-4 text-black dark:text-white font-medium"
                  />
                  <button onClick={() => search && router.push(`/courses?title=${search}`)} className="h-full px-6 bg-black dark:bg-white text-white dark:text-black font-bold text-sm tracking-wider uppercase rounded-lg hover:scale-95 transition-transform">
                    Tìm kiếm
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://randomuser.me/api/portraits/women/${i+10}.jpg`} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#050505] object-cover" alt="student" />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="text-black dark:text-white font-medium">Hơn <span className="font-mono text-blue-500 font-bold">500K+</span> học viên</p>
                  <p className="text-neutral-500 font-light text-xs">đã tham gia hệ thống</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square flex items-center justify-center">
                 <img src={data?.layout?.banner?.image?.url || "/assets/banner.png"} className="w-[85%] h-[85%] object-contain drop-shadow-2xl z-10" alt="Hero Illustration" />
                 
                 {/* Floating Stats Cards */}
                 <div className="absolute top-10 right-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 dark:border-white/5 p-4 rounded-2xl shadow-xl z-20 animate-bounce" style={{animationDuration: '4s'}}>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Mức độ hài lòng</p>
                   <p className="text-2xl font-Josefin font-bold text-emerald-500">99.8%</p>
                 </div>
                 
                 <div className="absolute bottom-20 left-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 dark:border-white/5 p-4 rounded-2xl shadow-xl z-20 animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Nguyễn Thế Vinh</p>
                   <p className="text-2xl font-Josefin font-bold text-blue-500">IELTS 9.0</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Hero;