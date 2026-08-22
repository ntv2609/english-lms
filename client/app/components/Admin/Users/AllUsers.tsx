"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

interface Props { isTeam?: boolean; }

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [updateUserRole, { error: updateError, isSuccess: updateSuccess }] = useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation();

  useEffect(() => {
    if (updateSuccess) { refetch(); toast.success("Role updated"); setActive(false); }
    if (updateError && "data" in updateError) toast.error((updateError as any).data.message);
    if (deleteSuccess) { refetch(); toast.success("User deleted"); setOpen(false); }
    if (deleteError && "data" in deleteError) toast.error((deleteError as any).data.message);
  }, [updateError, updateSuccess, deleteSuccess, deleteError, refetch]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.3, renderCell: (p:any) => <span className={`px-2 py-1 text-xs font-bold rounded ${p.value === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-neutral-500/10 text-neutral-500'}`}>{p.value}</span> },
    { field: "courses", headerName: "Courses", flex: 0.3 },
    { field: "created_at", headerName: "Joined", flex: 0.4 },
    { field: "email_user", headerName: "Mail", flex: 0.2, renderCell: (params: any) => <a href={`mailto:${params.row.email}`} className="flex h-full items-center"><AiOutlineMail className="text-blue-500 hover:text-blue-400 transition-colors" size={20} /></a> },
    { field: "delete", headerName: "Delete", flex: 0.2, renderCell: (params: any) => <button className="flex h-full items-center" onClick={() => { setOpen(true); setUserId(params.row.id); }}><AiOutlineDelete className="text-red-500 hover:text-red-400 transition-colors" size={20} /></button> },
  ];

  const rows: any = [];
  const sourceData = isTeam ? data?.users?.filter((i:any) => i.role === "admin") : data?.users;
  sourceData?.forEach((item: any) => {
    rows.push({ id: item._id, name: item.name, email: item.email, role: item.role, courses: item.courses.length, created_at: format(item.createdAt) });
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <h1 className={`${styles.title} !text-left !pb-0 !mb-0`}>{isTeam ? "Quản trị viên" : "Học viên"}</h1>
        {isTeam && <button className={`${styles.button} !w-full sm:!w-auto !py-2 !px-4 text-xs`} onClick={() => setActive(true)}>+ Phân quyền Admin</button>}
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

      {/* Modals for Add Admin and Delete */}
      <Modal open={active} onClose={() => setActive(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none max-w-full">
          <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-6">Thêm Quản Trị Viên</h2>
          <div className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email tài khoản đã đăng ký" className={styles.input} />
            <select className={styles.input + " dark:bg-[#0A0A0A]"} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button className={`${styles.button} !mt-4`} onClick={async () => {
              const id = data?.users.find((u: any) => u.email === email)?._id;
              if(id) await updateUserRole({ id, role }); else toast.error("Không tìm thấy user");
            }}>Xác nhận</button>
          </div>
        </Box>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none max-w-full">
          <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-2">Xác nhận xóa?</h2>
          <p className="text-sm text-neutral-500 mb-8">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-black dark:text-white border border-black/10 dark:border-white/10 rounded-md" onClick={() => setOpen(false)}>Hủy</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md" onClick={() => deleteUser(userId)}>Xóa vĩnh viễn</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllUsers;