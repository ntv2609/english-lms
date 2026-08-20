import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { AiOutlineCamera } from 'react-icons/ai';
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
  
  const { refetch } = useLoadUserQuery(undefined, {});

  // FIX BUG: Cập nhật lại input name nếu thông tin user từ store thay đổi
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          const result = fileReader.result;
          if (typeof result === "string") {
            updateAvatar(result);
          }
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success('Profile picture updated successfully!');
    }
    if (error) {
      console.log(error);
      const errData = error as any;
      toast.error(errData?.data?.message || "Lỗi cập nhật ảnh đại diện!");
    }
    if (success) {
      refetch();
      toast.success('Profile updated successfully!');
    }
    if (updateError) {
      console.log(updateError);
      const errData = updateError as any;
      toast.error(errData?.data?.message || "Lỗi cập nhật thông tin!");
    }
  }, [isSuccess, error, success, updateError, refetch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name !== '') {
      await editProfile({ name });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar?.url || avatar || "/assets/avatar.png"}
            alt="Profile Avatar"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1 text-white" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white text-black">Full Name</label>
              <input
                type="text"
                className="w-full border rounded p-2 dark:text-white text-black dark:bg-slate-900 bg-transparent"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">Email Address</label>
              <input
                type="text"
                readOnly
                className="w-full border rounded p-2 dark:text-white text-black dark:bg-slate-900 bg-transparent"
                required
                value={user?.email}
              />
            </div>
            <input
              type="submit"
              required
              value="Update"
              className="w-full border-[#37a39a] border rounded p-2 mt-8 cursor-pointer dark:text-white text-black"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;