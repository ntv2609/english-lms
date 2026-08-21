import { styles } from "@/app/styles/style";
import React, { FC, useState, useEffect } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface Props {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { if (data) setCategories(data?.layout?.categories || []); }, [data]);

  const handleFile = (e: any) => {
    const file = e.target.files?.[0] || e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <form onSubmit={(e) => { e.preventDefault(); setActive(active + 1); }} className="space-y-6">
        <div className={styles.card + " p-8 space-y-6"}>
          <div>
            <label className={styles.label}>Tên khóa học</label>
            <input type="text" required className={styles.input} value={courseInfo.name} onChange={(e) => setCourseInfo({ ...courseInfo, name: e.target.value })} placeholder="Ví dụ: Tiếng Anh Giao Tiếp Cho Người Đi Làm" />
          </div>
          <div>
            <label className={styles.label}>Mô tả chi tiết</label>
            <textarea required rows={6} className={styles.input + " !h-auto py-3 resize-none"} value={courseInfo.description} onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })} placeholder="Cung cấp cái nhìn tổng quan về nội dung khóa học..." />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={styles.label}>Giá bán (VNĐ)</label>
              <input type="number" required className={styles.input} value={courseInfo.price} onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })} />
            </div>
            <div>
              <label className={styles.label}>Giá gốc (Tùy chọn)</label>
              <input type="number" className={styles.input} value={courseInfo.estimatedPrice} onChange={(e) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={styles.label}>Tags (Cách nhau dấu phẩy)</label>
              <input type="text" required className={styles.input} value={courseInfo.tags} onChange={(e) => setCourseInfo({ ...courseInfo, tags: e.target.value })} placeholder="IELTS, Giao tiếp, Basic..." />
            </div>
            <div>
              <label className={styles.label}>Danh mục</label>
              <select required className={styles.input + " dark:bg-[#0A0A0A]"} value={courseInfo.categories} onChange={(e) => setCourseInfo({ ...courseInfo, categories: e.target.value })}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map((item: any) => <option key={item._id} value={item.title}>{item.title}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={styles.label}>Trình độ</label>
              <input type="text" required className={styles.input} value={courseInfo.level} onChange={(e) => setCourseInfo({ ...courseInfo, level: e.target.value })} placeholder="Beginner / Intermediate / Advanced" />
            </div>
            <div>
              <label className={styles.label}>Demo Video ID</label>
              <input type="text" required className={styles.input} value={courseInfo.demoUrl} onChange={(e) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={styles.label}>Ảnh đại diện khóa học (Thumbnail)</label>
            <input type="file" id="file" className="hidden" accept="image/*" onChange={handleFile} />
            <label 
              htmlFor="file" 
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }} 
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }} 
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e); }} 
              className={`mt-2 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragging ? "border-blue-500 bg-blue-500/10" : "border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              {courseInfo.thumbnail ? (
                <img src={courseInfo.thumbnail} className="w-full h-full object-cover rounded-lg" alt="thumbnail" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-500">
                  <AiOutlineCloudUpload size={40} className="mb-3" />
                  <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs">PNG, JPG or WEBP (Max. 800x400px)</p>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <input type="submit" value="Next Step" className={`${styles.button} !w-40`} />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;