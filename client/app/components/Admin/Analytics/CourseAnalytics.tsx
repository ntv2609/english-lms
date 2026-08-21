"use client";
import React, { FC } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

interface Props {}

const CourseAnalytics: FC<Props> = (props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});
  const analyticsData: any = [];

  if (data?.courses?.last12Months) {
    data.courses.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, uv: item.count });
    });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-full">
          <div className="mb-8">
            <h1 className={`${styles.title} !text-left`}>Courses Analytics</h1>
            <p className={styles.label}>Tăng trưởng khóa học trong 12 tháng qua</p>
          </div>
          <div className={`${styles.card} w-full h-[60vh] p-6 flex items-center justify-center`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fill: '#888888', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#888888', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="uv" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="uv" position="top" fill="#888888" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;