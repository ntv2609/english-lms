"use client";
import React, { FC, useEffect, useState } from "react";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";

const EditCategories: FC = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data?.layout?.categories || []);
    }
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error, refetch]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1]?.title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [
        ...prevCategory,
        { _id: Date.now().toString(), title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data?.layout?.categories || [], categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <h1 className="text-center text-[25px] font-Poppins font-[500] text-black dark:text-white pb-2">
            All Categories
          </h1>
          {categories &&
            categories.map((item: any, index: number) => (
              <div className="p-3" key={item._id}>
                <div className="flex items-center w-full justify-between">
                  <input
                    className={`${styles.input} !w-full !border-none !text-[20px]`}
                    value={item.title}
                    onChange={(e) => handleCategoriesAdd(item._id, e.target.value)}
                    placeholder="Enter category title..."
                  />
                  <AiOutlineDelete
                    className="dark:text-white text-black text-[18px] cursor-pointer"
                    onClick={() => {
                      setCategories((prevCategory: any) =>
                        prevCategory.filter((i: any) => i._id !== item._id)
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${
              areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "cursor-not-allowed bg-gray-500"
                : "cursor-pointer bg-[#42d383]"
            } w-[150px] min-h-[40px] h-[40px] text-white rounded flex items-center justify-center font-Poppins mt-10`}
            onClick={
              areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;