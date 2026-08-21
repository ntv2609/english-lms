"use client";
import React, { FC, useEffect, useState } from "react";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { styles } from "@/app/styles/style";

const EditHero: FC = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const { data, refetch } = useGetHeroDataQuery("Banner", { refetchOnMountOrArgChange: true });
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) { setTitle(data.layout.banner.title); setSubTitle(data.layout.banner.subTitle); setImage(data.layout.banner.image.url); }
    if (isSuccess) { refetch(); toast.success("Cập nhật giao diện thành công"); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [data, isSuccess, error, refetch]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => setImage(e.target.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl m-auto">
      <div className="mb-10">
        <h1 className={`${styles.title} !text-left !pb-1`}>Giao diện Trang chủ</h1>
        <p className={styles.label}>Tùy chỉnh thông điệp và hình ảnh hiển thị đầu tiên</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className={styles.card + " p-6"}>
            <label className={styles.badge + " block mb-3"}>Tiêu đề chính (Headline)</label>
            <textarea
              className="w-full bg-transparent text-3xl font-Josefin font-bold text-black dark:text-white outline-none resize-none border-b border-black/10 dark:border-white/10 focus:border-blue-500 pb-2 transition-colors"
              value={title} onChange={(e) => setTitle(e.target.value)} rows={3} placeholder="Master English..."
            />
          </div>
          <div className={styles.card + " p-6"}>
            <label className={styles.badge + " block mb-3"}>Đoạn mô tả (Sub-headline)</label>
            <textarea
              className="w-full bg-transparent text-base text-neutral-600 dark:text-neutral-400 outline-none resize-none border-b border-black/10 dark:border-white/10 focus:border-blue-500 pb-2 transition-colors"
              value={subTitle} onChange={(e) => setSubTitle(e.target.value)} rows={3} placeholder="Mô tả chi tiết..."
            />
          </div>
          <button
            className={`${styles.button} !w-full lg:!w-40 ${data?.layout?.banner?.title === title && data?.layout?.banner?.subTitle === subTitle && data?.layout?.banner?.image?.url === image ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => editLayout({ type: "Banner", image, title, subTitle })}
            disabled={isLoading}
          >{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</button>
        </div>

        <div className="relative group">
          <div className={styles.card + " p-2 aspect-[4/3] relative flex items-center justify-center overflow-hidden"}>
             {/* Abstract background effect behind image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 opacity-50 pointer-events-none" />
             <img src={image || "/assets/banner.png"} alt="Hero" className="relative z-10 w-[80%] h-auto object-contain mix-blend-darken dark:mix-blend-lighten" />
             
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
                <label htmlFor="banner" className="cursor-pointer flex flex-col items-center text-white">
                  <AiOutlineCloudUpload size={40} className="mb-2" />
                  <span className="font-medium text-sm tracking-wide">Thay đổi hình ảnh</span>
                </label>
                <input type="file" id="banner" accept="image/*" onChange={handleUpdate} className="hidden" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;