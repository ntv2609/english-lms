"use client";
import React, { FC } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Loader from "../../Loader/Loader";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

interface Props {
  isDashboard?: boolean;
}

const OrderAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});
  const analyticsData: any = [];

  if (data?.orders?.last12Months) {
    data.orders.last12Months.forEach((item: any) => {
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
              <h1 className={`${styles.title} !text-left`}>Orders Analytics</h1>
              <p className={styles.label}>Lưu lượng đơn hàng 12 tháng qua</p>
            </div>
          )}
          <div className={`${!isDashboard ? styles.card : ''} w-full ${!isDashboard ? 'h-[40vh] sm:h-[60vh] p-2 sm:p-6' : 'h-[30vh] sm:h-full'} flex flex-col justify-center`}>
            {isDashboard && <h2 className="text-base sm:text-lg font-Josefin font-bold text-black dark:text-white mb-4 px-2">Doanh thu tổng quan</h2>}
            <ResponsiveContainer width="100%" height={isDashboard ? "80%" : "100%"}>
              <LineChart data={analyticsData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33333330" />
                <XAxis dataKey="name" tick={{fill: '#888888', fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#888888', fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAnalytics;