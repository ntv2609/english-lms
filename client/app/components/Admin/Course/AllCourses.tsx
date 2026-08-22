"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

const AllCourses: FC = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.3 },
    { field: "purchased", headerName: "Purchased", flex: 0.3 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link href={`/admin/edit-course/${params.row.id}`} className="flex h-full items-center">
          <FiEdit2 className="text-blue-500 hover:text-blue-400 transition-colors" size={18} />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <button className="flex h-full items-center" onClick={() => { setOpen(true); setCourseId(params.row.id); }}>
          <AiOutlineDelete className="text-red-500 hover:text-red-400 transition-colors" size={20} />
        </button>
      ),
    },
  ];

  const rows: any = [];
  if (data?.courses) {
    data.courses.forEach((item: any) => {
      rows.push({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      });
    });
  }

  useEffect(() => {
    if (isSuccess) { setOpen(false); refetch(); toast.success("Course Deleted"); }
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isSuccess, error, refetch]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <h1 className={`${styles.title} !text-left !pb-0 !mb-0`}>Quản lý khóa học</h1>
        <Link href="/admin/create-course" className={`${styles.button} !w-full sm:!w-auto !py-2 !px-4 text-xs`}>
          + Thêm khóa học
        </Link>
      </div>
      {isLoading ? <Loader /> : (
        <Box m="0" className={styles.card}>
          <Box height="70vh" sx={{
            overflowX: "auto",
            "& .MuiDataGrid-root": { border: "none", fontFamily: "var(--font-Poppins)", minWidth: "800px" },
            "& .MuiDataGrid-row": { borderBottom: "1px solid rgba(255,255,255,0.05)" },
            "& .MuiDataGrid-columnHeaders": { borderBottom: "1px solid rgba(255,255,255,0.1)", color: theme === "dark" ? "#a3a3a3" : "#525252", fontSize: "12px", textTransform: "uppercase" },
            "& .MuiDataGrid-cell": { borderBottom: "none", color: theme === "dark" ? "#e5e5e5" : "#171717", fontSize: "14px" },
            "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(255,255,255,0.05)" },
            "& .MuiCheckbox-root": { color: "#3b82f6 !important" },
          }}>
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none max-w-full">
          <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-2">Xác nhận xóa?</h2>
          <p className="text-sm text-neutral-500 mb-8">Hành động này không thể hoàn tác. Khóa học sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-black dark:text-white border border-black/10 dark:border-white/10 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setOpen(false)}>Hủy</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors" onClick={() => deleteCourse(courseId)}>Xóa vĩnh viễn</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllCourses;