import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

interface Props { data: any; activeVideo?: number; setActiveVideo?: any; isDemo?: boolean; }

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo, isDemo }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(data?.map((i:any)=>i.videoSection)));
  const videoSections = [...new Set<string>(data?.map((item: any) => item.videoSection))];
  let totalCount = 0;

  const toggleSection = (s: string) => {
    const v = new Set(visibleSections);
    v.has(s) ? v.delete(s) : v.add(s);
    setVisibleSections(v);
  };

  return (
    <div className={`w-full ${!isDemo ? "sticky top-24 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar" : ""}`}>
      {videoSections.map((section: string) => {
        const isVisible = visibleSections.has(section);
        const sectionVideos = data.filter((item: any) => item.videoSection === section);
        const secStart = totalCount; totalCount += sectionVideos.length;

        return (
          <div key={section} className="mb-4 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
            <div className="p-4 cursor-pointer flex justify-between items-center bg-black/5 dark:bg-black/20" onClick={() => toggleSection(section)}>
              <h2 className="font-Josefin font-semibold text-sm text-black dark:text-white leading-tight">{section}</h2>
              {isVisible ? <BsChevronUp className="text-neutral-500 shrink-0 ml-2" size={14} /> : <BsChevronDown className="text-neutral-500 shrink-0 ml-2" size={14} />}
            </div>
            
            {isVisible && (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {sectionVideos.map((item: any, index: number) => {
                  const vidIdx = secStart + index;
                  const isActive = vidIdx === activeVideo;
                  return (
                    <div key={item._id} onClick={() => !isDemo && setActiveVideo(vidIdx)} className={`p-4 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${isActive ? "bg-blue-500/10 dark:bg-blue-500/10 border-l-2 border-blue-500" : "border-l-2 border-transparent"}`}>
                      <div className="flex gap-3">
                        <MdOutlineOndemandVideo size={18} className={`shrink-0 mt-0.5 ${isActive ? "text-blue-500" : "text-neutral-400"}`} />
                        <div>
                          <h4 className={`text-sm font-medium leading-snug ${isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-700 dark:text-neutral-300"}`}>{item.title}</h4>
                          <p className="text-xs font-mono text-neutral-500 mt-1">{item.videoLength} phút</p>
                        </div>
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