"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";

interface Props { isDashboard?: boolean; }

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data && usersData && coursesData) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find((u: any) => u._id === item.userId);
        const course = coursesData?.courses.find((c: any) => c._id === item.courseId);
        return { ...item, userName: user?.name, userEmail: user?.email, title: course?.name, price: "$" + course?.price };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard ? [] : [{ field: "userEmail", headerName: "Email", flex: 1 }, { field: "title", headerName: "Course", flex: 1 }]),
    { field: "price", headerName: "Price", flex: 0.3 },
    { field: "created_at", headerName: "Date", flex: 0.5 },
  ];

  const rows: any = [];
  orderData?.forEach((item: any) => {
    rows.push({ id: item._id, userName: item.userName, userEmail: item.userEmail, title: item.title, price: item.price, created_at: format(item.createdAt) });
  });

  return (
    <div className="h-full">
      {!isDashboard && (
        <div className="mb-6">
          <h1 className={`${styles.title} !text-left !pb-0 !mb-0`}>Lịch sử giao dịch</h1>
        </div>
      )}
      {isLoading ? <Loader /> : (
        <Box m="0" className={!isDashboard ? styles.card : ''}>
          <Box height={isDashboard ? "350px" : "75vh"} sx={{
            "& .MuiDataGrid-root": { border: "none", fontFamily: "var(--font-Poppins)" },
            "& .MuiDataGrid-row": { borderBottom: "1px solid rgba(255,255,255,0.05)" },
            "& .MuiDataGrid-columnHeaders": { borderBottom: "1px solid rgba(255,255,255,0.1)", color: theme === "dark" ? "#a3a3a3" : "#525252", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" },
            "& .MuiDataGrid-cell": { borderBottom: "none", color: theme === "dark" ? "#e5e5e5" : "#171717", fontSize: "13px" },
            "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(255,255,255,0.05)" },
            "& .MuiCheckbox-root": { color: "#3b82f6 !important" },
          }}>
            <DataGrid checkboxSelection={!isDashboard} rows={rows} columns={columns} components={isDashboard ? {} : { Toolbar: GridToolbar }} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;