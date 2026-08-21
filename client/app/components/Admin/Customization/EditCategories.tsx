"use client";
import React, { FC, useEffect, useState } from "react";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";

const EditCategories: FC = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", { refetchOnMountOrArgChange: true });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) setCategories(data?.layout?.categories || []);
    if (isSuccess) { refetch(); toast.success("Cập nhật danh mục thành công"); }
    if (error && "data" in error) toast.error((error as any)?.data?.message);
  }, [data, isSuccess, error, refetch]);

  const editCategoriesHandler = async () => {
    if (JSON.stringify(data?.layout?.categories || []) !== JSON.stringify(categories) && !categories.some(q => q.title === "")) {
      await editLayout({ type: "Categories", categories });
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="max-w-3xl m-auto">
          <div className="mb-8">
            <h1 className={`${styles.title} !text-left !pb-1`}>Danh mục khóa học</h1>
            <p className={styles.label}>Quản lý các thẻ phân loại hiển thị trên trang chủ</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {categories.map((item: any) => (
              <div className={styles.card + " p-4 flex items-center gap-4 group"} key={item._id}>
                <input
                  className="flex-1 bg-transparent text-lg font-Josefin font-medium text-black dark:text-white outline-none"
                  value={item.title}
                  onChange={(e) => setCategories(categories.map(i => i._id === item._id ? { ...i, title: e.target.value } : i))}
                  placeholder="Nhập tên danh mục..."
                />
                <AiOutlineDelete className="text-neutral-300 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-all" size={24} onClick={() => setCategories(categories.filter(i => i._id !== item._id))} />
              </div>
            ))}
          </div>

          <button className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-2 mb-10" onClick={() => { if(categories[categories.length - 1]?.title === "") toast.error("Vui lòng nhập danh mục trước"); else setCategories([...categories, { _id: Date.now().toString(), title: "" }]); }}>
            <IoMdAddCircleOutline size={22} /> Thêm danh mục mới
          </button>

          <button
            className={`${styles.button} !w-40 ${JSON.stringify(data?.layout?.categories || []) === JSON.stringify(categories) || categories.some(q => q.title === "") ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={editCategoriesHandler}
          >Lưu thay đổi</button>
        </div>
      )}
    </>
  );
};

export default EditCategories;