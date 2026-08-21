import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import OrderAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";
import { PiUsersFourLight } from "react-icons/pi";
import { BiBorderLeft } from "react-icons/bi";
import { useGetOrdersAnalyticsQuery, useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

interface Props { open?: boolean; }

const DashboardWidgets: FC<Props> = ({ open }) => {
  const { data: usersData } = useGetUsersAnalyticsQuery({});
  const { data: ordersData } = useGetOrdersAnalyticsQuery({});
  const [userStat, setUserStat] = useState<any>({ current: 0, change: 0 });
  const [orderStat, setOrderStat] = useState<any>({ current: 0, change: 0 });

  useEffect(() => {
    if (usersData?.users?.last12Months?.length >= 2) {
      const arr = usersData.users.last12Months.slice(-2);
      const prev = arr[0].count; const curr = arr[1].count;
      setUserStat({ current: curr, change: prev !== 0 ? ((curr - prev) / prev) * 100 : 100 });
    }
    if (ordersData?.orders?.last12Months?.length >= 2) {
      const arr = ordersData.orders.last12Months.slice(-2);
      const prev = arr[0].count; const curr = arr[1].count;
      setOrderStat({ current: curr, change: prev !== 0 ? ((curr - prev) / prev) * 100 : 100 });
    }
  }, [usersData, ordersData]);

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className={`${styles.card} p-6 flex items-center justify-between`}>
      <div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <h3 className={styles.badge}>{title}</h3>
        <p className="text-3xl font-Josefin font-bold text-black dark:text-white mt-1">{value}</p>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <span className={`text-sm font-bold px-2 py-1 rounded ${change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <div className={styles.card + " p-6 h-full"}>
            <UserAnalytics isDashboard={true} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <MetricCard title="Sales Obtained" value={orderStat.current} change={orderStat.change} icon={BiBorderLeft} color="bg-blue-600" />
          <MetricCard title="New Users" value={userStat.current} change={userStat.change} icon={PiUsersFourLight} color="bg-emerald-500" />
        </div>
        <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><AllInvoices isDashboard={true} /></div>
          <div className="lg:col-span-1"><OrderAnalytics isDashboard={true} /></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;