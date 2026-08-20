"use client";
import React, { FC, useEffect, useState } from "react";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/app/styles/style";

const EditHero: FC = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title);
      setSubTitle(data?.layout?.banner?.subTitle);
      setImage(data?.layout?.banner?.image?.url);
    }
    if (isSuccess) {
      refetch();
      toast.success("Hero updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error, refetch]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-[80%] mx-auto flex flex-col 1000px:flex-row items-center gap-10">
        <div className="w-full 1000px:w-1/2 relative flex items-center justify-center hero_animation rounded-full h-[40vh] 1000px:h-[50vh]">
          <div className="relative z-10 w-full flex justify-center">
            <img
              src={image || "/assets/banner.png"}
              alt="Hero Banner"
              className="object-contain w-[90%] 1500px:max-w-[85%] h-auto z-10"
            />
            <input
              type="file"
              name=""
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label htmlFor="banner" className="absolute bottom-0 right-10 z-20">
              <AiOutlineCamera className="dark:text-white text-black text-[30px] cursor-pointer bg-white dark:bg-gray-800 rounded-full p-1 shadow-md" />
            </label>
          </div>
        </div>

        <div className="w-full 1000px:w-1/2 flex flex-col gap-5 text-center 1000px:text-left mt-[50px] 1000px:mt-0">
          <textarea
            className="dark:text-white text-[#000000c7] text-[30px] 1000px:text-[60px] font-[600] font-Josefin py-2 1000px:leading-[75px] w-full bg-transparent border-none outline-none resize-none"
            placeholder="Banner title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
          />
          <textarea
            className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] w-full bg-transparent border-none outline-none resize-none"
            placeholder="Banner sub title..."
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            rows={2}
          />
          <div
            className={`${
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? "cursor-pointer bg-[#42d383]"
                : "cursor-not-allowed bg-gray-500"
            } w-[150px] min-h-[40px] h-[40px] text-white rounded flex items-center justify-center font-Poppins`}
            onClick={
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? handleEdit
                : () => null
            }
          >
            {isLoading ? "Saving..." : "Save"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;