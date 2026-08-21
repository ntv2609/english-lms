"use client";
import React, { FC } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Loader from "../../Loader/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

interface Props {
  isDashboard?: boolean;
}

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const analyticsData: any = [];

  if (data?.users?.last12Months) {
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-full" : "h-full"}>
           {!isDashboard && (
            <div className="mb-8">
              <h1 className={`${styles.title} !text-left`}>Users Analytics</h1>
              <p className={styles.label}>Tăng trưởng người dùng 12 tháng qua</p>
            </div>
          )}
          <div className={`${!isDashboard ? styles.card : ''} w-full ${!isDashboard ? 'h-[60vh] p-6' : 'h-full'} flex flex-col justify-center`}>
            {isDashboard && <h2 className="text-lg font-Josefin font-bold text-black dark:text-white mb-4 px-2">Tăng trưởng User</h2>}
            <ResponsiveContainer width="100%" height={isDashboard ? "80%" : "100%"}>
              <AreaChart data={analyticsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fill: '#888888', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#888888', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;