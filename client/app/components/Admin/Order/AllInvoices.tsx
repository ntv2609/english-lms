"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllOrdersQuery, useRefundOrderMutation } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

interface Props { isDashboard?: boolean; }

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme } = useTheme();
  const { isLoading, data, refetch } = useGetAllOrdersQuery({}, { refetchOnMountOrArgChange: true });
  const { data: usersData } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const { data: coursesData } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [refundOrderApi, { isSuccess, error }] = useRefundOrderMutation();
  
  const [orderData, setOrderData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isSuccess) { toast.success("Đã hoàn tiền đơn hàng"); setOpen(false); refetch(); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isSuccess, error, refetch]);

  useEffect(() => {
    if (data && usersData && coursesData) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users?.find((u: any) => u._id === item.userId);
        const course = coursesData?.courses?.find((c: any) => c._id === item.courseId);
        return { 
            ...item, 
            userName: user?.name || "Người dùng đã xóa", 
            userEmail: user?.email || "Không xác định", 
            title: course?.name || "Khóa học đã xóa", 
            price: course?.price ? `${course.price.toLocaleString('vi-VN')} VNĐ` : "0 VNĐ" 
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "MÃ ĐƠN HÀNG", flex: 0.3 },
    { field: "userName", headerName: "HỌ TÊN", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard ? [] : [{ field: "userEmail", headerName: "EMAIL", flex: 1 }, { field: "title", headerName: "TÊN KHÓA HỌC", flex: 1 }]),
    { field: "price", headerName: "SỐ TIỀN", flex: 0.3 },
    // Update thêm giao diện cho label Expired
    { field: "status", headerName: "TRẠNG THÁI", flex: 0.3, renderCell: (p:any) => <span className={`px-2 py-1 text-xs font-bold rounded ${p.value === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : p.value === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : p.value === 'Expired' ? 'bg-neutral-500/10 text-neutral-500' : 'bg-red-500/10 text-red-500'}`}>{p.value}</span> },
    { field: "created_at", headerName: "THỜI GIAN", flex: 0.5 },
    ...(isDashboard ? [] : [{ field: "refund", headerName: "HOÀN TIỀN", flex: 0.3, renderCell: (p:any) => p.row.status === 'Success' ? <button onClick={() => { setOrderId(p.row.id); setOpen(true); }} className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded">Hoàn tiền</button> : null }]),
  ];

  const rows: any = [];
  orderData && orderData.forEach((item: any) => {
    rows.push({ 
        id: item._id, 
        userName: item.userName, 
        userEmail: item.userEmail, 
        title: item.title, 
        price: item.price, 
        status: item.status,
        created_at: format(item.createdAt) 
    });
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: theme === "dark" ? "#fff" : "#000" },
          }}>
            <DataGrid 
                checkboxSelection={!isDashboard} 
                rows={rows} 
                columns={columns} 
                components={isDashboard ? {} : { Toolbar: GridToolbar }} 
                // FIX LỖI FONT EXCEL: Ép sử dụng bảng mã utf8WithBom
                componentsProps={isDashboard ? {} : {
                    toolbar: {
                        csvOptions: { utf8WithBom: true, fileName: "Danh_sach_don_hang" }
                    }
                }}
            />
          </Box>
        </Box>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none max-w-full">
          <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-2">Xác nhận hoàn tiền?</h2>
          <p className="text-sm text-neutral-500 mb-8">Sau khi hoàn tiền, học viên sẽ bị tước quyền truy cập khóa học.</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-black dark:text-white border border-black/10 dark:border-white/10 rounded-md" onClick={() => setOpen(false)}>Hủy</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md" onClick={() => refundOrderApi({ orderId })}>Hoàn tiền</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllInvoices;