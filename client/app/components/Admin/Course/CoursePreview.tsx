import { styles } from "@/app/styles/style";
import CoursePlayer from "../../../utils/CoursePlayer";
import React, { FC } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface Props {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: () => void;
  isEdit?: boolean;
}

const CoursePreview: FC<Props> = ({ courseData, handleCourseCreate, active, setActive, isEdit }) => {
  const discount = courseData?.estimatedPrice ? ((courseData.estimatedPrice - courseData.price) / courseData.estimatedPrice) * 100 : 0;

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-Josefin font-bold text-black dark:text-white leading-tight">{courseData?.name}</h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">{courseData?.description}</p>
          </div>
          
          <div className={styles.card + " p-6"}>
            <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-4">Bạn sẽ học được gì?</h2>
            <div className="space-y-3">
              {courseData?.benefits?.map((b:any, i:number) => (
                <div key={i} className="flex gap-3 text-neutral-700 dark:text-neutral-300"><IoCheckmarkDoneOutline className="text-emerald-500 shrink-0 mt-1" size={20}/><span>{b.title}</span></div>
              ))}
            </div>
          </div>

          <div className={styles.card + " p-6"}>
            <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-4">Yêu cầu đầu vào</h2>
            <div className="space-y-3">
              {courseData?.prerequisites?.map((p:any, i:number) => (
                <div key={i} className="flex gap-3 text-neutral-700 dark:text-neutral-300"><span className="text-blue-500 shrink-0 mt-1 font-mono">0{i+1}.</span><span>{p.title}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="w-full aspect-video bg-neutral-900">
              <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.name} />
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-end gap-3">
                <h1 className="text-3xl font-Josefin font-bold text-black dark:text-white">${courseData?.price || "Free"}</h1>
                {courseData?.estimatedPrice && <span className="text-lg text-neutral-500 line-through mb-1">${courseData?.estimatedPrice}</span>}
                {discount > 0 && <span className="text-sm font-bold text-emerald-500 mb-1.5 bg-emerald-500/10 px-2 py-0.5 rounded">{discount.toFixed(0)}% OFF</span>}
              </div>
              <button className={`${styles.button} !w-full !rounded-full !bg-black dark:!bg-white dark:!text-black opacity-50 cursor-not-allowed`}>Mô phỏng Mua Khóa Học</button>
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <p>✓ Cập nhật trọn đời</p>
                <p>✓ Học mọi lúc mọi nơi</p>
                <p>✓ Bài tập thực hành thực tế</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-10 border-t border-black/5 dark:border-white/5">
        <button className={`${styles.button} !w-32 !bg-transparent !text-black dark:!text-white border border-black/20 dark:border-white/20`} onClick={() => setActive(active - 1)}>Back</button>
        <button className={`${styles.button} !w-48`} onClick={() => handleCourseCreate()}>{isEdit ? "Cập nhật khóa học" : "Đăng tải khóa học"}</button>
      </div>
    </div>
  );
};

export default CoursePreview;