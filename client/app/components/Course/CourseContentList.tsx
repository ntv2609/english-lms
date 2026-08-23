import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface Props { data: any; activeVideo?: number; setActiveVideo?: any; isDemo?: boolean; user?: any; courseId?: string; }

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo, isDemo, user, courseId }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(data?.map((i:any)=>i.videoSection)));
  const videoSections = [...new Set<string>(data?.map((item: any) => item.videoSection))];
  let totalCount = 0;

  // LẤY DANH SÁCH BÀI ĐÃ HỌC TỪ USER
  const completedVideos = user?.courseProgress?.find((p: any) => p.courseId === courseId)?.completedVideos || [];
  const totalVideos = data?.length || 0;
  const completedCount = completedVideos.length;
  // TÍNH PHẦN TRĂM
  const progressPercentage = totalVideos === 0 ? 0 : Math.round((completedCount / totalVideos) * 100);

  const toggleSection = (s: string) => {
    const v = new Set(visibleSections);
    v.has(s) ? v.delete(s) : v.add(s);
    setVisibleSections(v);
  };

  return (
    <div className={`w-full ${!isDemo ? "sticky top-24 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar" : ""}`}>
      
      {/* HIỂN THỊ THANH TIẾN ĐỘ (CHỈ HIỆN TRONG KHÔNG GIAN HỌC CHÍNH THỨC, KHÔNG HIỆN Ở TRANG DEMO) */}
      {!isDemo && (
          <div className="mb-8 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5">
              <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Tiến độ của bạn</span>
                  <span className="text-lg font-Josefin font-bold text-emerald-500">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div 
                      className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${progressPercentage}%` }}
                  >
                      {/* Hiệu ứng bóng bẩy cho thanh progress */}
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
                  </div>
              </div>
              <p className="text-xs text-neutral-500 mt-3 text-right font-mono">Đã hoàn thành {completedCount}/{totalVideos} bài</p>
          </div>
      )}

      {videoSections.map((section: string) => {
        const isVisible = visibleSections.has(section);
        const sectionVideos = data.filter((item: any) => item.videoSection === section);
        const secStart = totalCount; totalCount += sectionVideos.length;

        // Tính xem section này đã học được bao nhiêu bài
        const sectionCompletedCount = sectionVideos.filter((v: any) => completedVideos.includes(v._id)).length;

        return (
          <div key={section} className="mb-4 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
            <div className="p-4 cursor-pointer flex justify-between items-center bg-black/5 dark:bg-black/20" onClick={() => toggleSection(section)}>
              <div>
                 <h2 className="font-Josefin font-semibold text-sm text-black dark:text-white leading-tight">{section}</h2>
                 {!isDemo && (
                     <p className="text-[10px] text-neutral-500 mt-1 font-mono">{sectionCompletedCount}/{sectionVideos.length} bài đã học</p>
                 )}
              </div>
              {isVisible ? <BsChevronUp className="text-neutral-500 shrink-0 ml-2" size={14} /> : <BsChevronDown className="text-neutral-500 shrink-0 ml-2" size={14} />}
            </div>
            
            {isVisible && (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {sectionVideos.map((item: any, index: number) => {
                  const vidIdx = secStart + index;
                  const isActive = vidIdx === activeVideo;
                  const isCompleted = completedVideos.includes(item._id); // KIỂM TRA BÀI ĐÃ HỌC

                  return (
                    <div key={item._id} onClick={() => !isDemo && setActiveVideo(vidIdx)} className={`p-4 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? "bg-blue-500/10 dark:bg-blue-500/10 border-l-2 border-blue-500" : "border-l-2 border-transparent"}`}>
                      <div className="flex gap-3">
                        <MdOutlineOndemandVideo size={18} className={`shrink-0 mt-0.5 ${isActive ? "text-blue-500" : "text-neutral-400"}`} />
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium leading-snug ${isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-700 dark:text-neutral-300"}`}>{item.title}</h4>
                          <p className="text-xs font-mono text-neutral-500 mt-1">{item.videoLength} phút</p>
                        </div>
                        {/* HIỂN THỊ DẤU TICK XANH NẾU ĐÃ HỌC XONG */}
                        {!isDemo && isCompleted && (
                            <IoCheckmarkDoneOutline size={18} className="text-emerald-500 shrink-0" title="Đã hoàn thành" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;