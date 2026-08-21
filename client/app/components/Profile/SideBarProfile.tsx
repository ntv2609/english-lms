import React, { FC } from 'react';
import { RiLockPasswordLine, RiDashboardLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';

type Props = { user: any; active: number; avatar: string | null; setActive: (active: number) => void; logOutHandler: () => void; };

const SideBarProfile: FC<Props> = ({ user, active, setActive, logOutHandler }) => {
  const menus = [
    { id: 1, label: "Hồ sơ", icon: FiUser },
    { id: 2, label: "Bảo mật", icon: RiLockPasswordLine },
    { id: 3, label: "Khóa học", icon: SiCoursera },
  ];

  return (
    <div className="flex flex-col gap-2">
      {menus.map(m => {
        const Icon = m.icon;
        const isActive = active === m.id;
        return (
          <button key={m.id} onClick={() => setActive(m.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? "bg-black text-white dark:bg-white dark:text-black" : "text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5"}`}>
            <Icon size={18} /> {m.label}
          </button>
        )
      })}
      
      {user?.role === 'admin' && (
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 mt-4 border border-blue-500/20">
          <RiDashboardLine size={18} /> Admin Dashboard
        </Link>
      )}

      <button onClick={logOutHandler} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-500 hover:bg-red-500/10 mt-4">
        <AiOutlineLogout size={18} /> Đăng xuất
      </button>
    </div>
  );
};

export default SideBarProfile;