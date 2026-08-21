import React, { FC, useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';
import { styles } from '@/app/styles/style';

type Props = { avatar: string | null; user: any; };

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || '');
  const [updateAvatar, { isSuccess: avaSuccess }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: profileSuccess }] = useEditProfileMutation();
  const { refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => { if(user) setName(user.name); }, [user]);
  useEffect(() => {
    if(avaSuccess) { refetch(); toast.success('Cập nhật avatar thành công'); }
    if(profileSuccess) { refetch(); toast.success('Cập nhật hồ sơ thành công'); }
  }, [avaSuccess, profileSuccess, refetch]);

  const imageHandler = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updateAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-Josefin font-bold text-black dark:text-white mb-8">Thông tin cá nhân</h1>
      
      <div className="flex items-center gap-8 mb-10">
        <div className="relative group">
          <img src={user?.avatar?.url || avatar || "/assets/avatar.png"} className="w-24 h-24 rounded-full object-cover border border-black/10 dark:border-white/10" alt="avatar" />
          <label htmlFor="avatar" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
            <AiOutlineCloudUpload size={24} />
          </label>
          <input type="file" id="avatar" className="hidden" accept="image/*" onChange={imageHandler} />
        </div>
        <div>
          <h3 className="font-Josefin font-bold text-xl dark:text-white">{user?.name}</h3>
          <p className="text-sm font-mono text-neutral-500">{user?.role?.toUpperCase()}</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); editProfile({ name }); }} className="space-y-6">
        <div>
          <label className={styles.label}>Họ và Tên</label>
          <input type="text" required className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={styles.label}>Email (Định danh)</label>
          <input type="text" readOnly className={styles.input + " bg-black/5 dark:bg-white/5 opacity-70 cursor-not-allowed"} value={user?.email} />
        </div>
        <button type="submit" className={`${styles.button} !w-40 mt-4`}>Lưu hồ sơ</button>
      </form>
    </div>
  );
};

export default ProfileInfo;