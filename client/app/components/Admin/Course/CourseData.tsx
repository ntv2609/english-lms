import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";

interface Props {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
}

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-12 px-2 sm:px-0">
      <div className={styles.card + " p-5 md:p-8"}>
        <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-6">Lợi ích khóa học</h2>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start sm:items-center gap-3">
              <input 
                type="text" 
                className={styles.input + " !mt-0 flex-1"} 
                value={benefit.title} 
                onChange={(e) => { 
                  const arr = [...benefits]; 
                  arr[index] = { ...arr[index], title: e.target.value }; 
                  setBenefits(arr); 
                }} 
                placeholder="Ví dụ: Nắm vững Node.js cơ bản..." 
              />
              <AiOutlineDelete 
                size={24} 
                className="text-neutral-400 hover:text-red-500 cursor-pointer shrink-0 mt-3 sm:mt-0" 
                onClick={() => { 
                  if(benefits.length > 1) { 
                    const arr = benefits.filter((_, i) => i !== index); 
                    setBenefits(arr); 
                  } 
                }} 
              />
            </div>
          ))}
          <button className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-2" onClick={() => setBenefits([...benefits, { title: "" }])}>
            <AiOutlinePlusCircle size={18}/> Thêm lợi ích
          </button>
        </div>
      </div>

      <div className={styles.card + " p-5 md:p-8"}>
        <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-6">Yêu cầu đầu vào</h2>
        <div className="space-y-4">
          {prerequisites.map((req, index) => (
            <div key={index} className="flex items-start sm:items-center gap-3">
              <input 
                type="text" 
                className={styles.input + " !mt-0 flex-1"} 
                value={req.title} 
                onChange={(e) => { 
                  const arr = [...prerequisites]; 
                  arr[index] = { ...arr[index], title: e.target.value }; 
                  setPrerequisites(arr); 
                }} 
                placeholder="Ví dụ: Cần có máy tính kết nối mạng..." 
              />
              <AiOutlineDelete 
                size={24} 
                className="text-neutral-400 hover:text-red-500 cursor-pointer shrink-0 mt-3 sm:mt-0" 
                onClick={() => { 
                  if(prerequisites.length > 1) { 
                    const arr = prerequisites.filter((_, i) => i !== index); 
                    setPrerequisites(arr); 
                  } 
                }} 
              />
            </div>
          ))}
          <button className="text-sm font-medium text-blue-500 hover:text-blue-400 flex items-center gap-2" onClick={() => setPrerequisites([...prerequisites, { title: "" }])}>
            <AiOutlinePlusCircle size={18}/> Thêm yêu cầu
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <button className={`${styles.button} !w-full sm:!w-32 !bg-transparent !text-black dark:!text-white border border-black/20 dark:border-white/20`} onClick={() => setActive(active - 1)}>Back</button>
        <button className={`${styles.button} !w-full sm:!w-32`} onClick={() => {
          if (benefits[0].title === "" || prerequisites[0].title === "") toast.error("Vui lòng nhập ít nhất 1 mục!");
          else setActive(active + 1);
        }}>Next</button>
      </div>
    </div>
  );
};

export default CourseData;