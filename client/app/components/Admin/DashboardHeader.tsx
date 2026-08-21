"use client";
import React, { FC, useEffect, useState } from "react";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useGetNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

interface Props { open?: boolean; setOpen?: any; }

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    if (data) setNotifications(data.notifications.filter((item: any) => item.status === "unread"));
    if (isSuccess) refetch();
  }, [data, isSuccess, refetch]);

  useEffect(() => {
    socketId.on("newNotification", () => { refetch(); });
  }, [refetch]);

  return (
    <div className="w-full flex items-center justify-end px-8 py-4 fixed top-0 right-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 h-[80px]">
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="relative cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
          <IoMdNotificationsOutline className="text-2xl text-black dark:text-white" />
          {notifications?.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {open && (
        <div className="absolute right-8 top-[90px] w-[350px] max-h-[400px] bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50">
            <h3 className="font-Josefin font-bold text-sm text-black dark:text-white">Thông báo ({notifications.length})</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-neutral-500 py-8">Không có thông báo mới.</p>
            ) : (
              notifications.map((item: any) => (
                <div key={item._id} className="p-3 mb-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-default group relative">
                  <h4 className="text-sm font-semibold text-black dark:text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.message}</p>
                  <p className="text-[10px] text-neutral-400 mt-2 font-mono">{format(item.createdAt)}</p>
                  <button onClick={() => updateNotificationStatus(item._id)} className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-[10px] uppercase font-bold tracking-wider text-blue-500 hover:text-blue-600 transition-all bg-blue-500/10 px-2 py-1 rounded">Đã đọc</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;