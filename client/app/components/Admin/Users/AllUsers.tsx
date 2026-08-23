"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail, AiOutlineLock, AiOutlineUnlock, AiOutlineEye } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useLockUnlockUserMutation } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

interface Props { isTeam?: boolean; }

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [userId, setUserId] = useState("");
  const [lockReason, setLockReason] = useState("");

  const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const { data: coursesData } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  const [updateUserRole, { error: updateError, isSuccess: updateSuccess }] = useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation();
  const [lockUnlockUser, { isSuccess: lockSuccess, error: lockError }] = useLockUnlockUserMutation();

  useEffect(() => {
    if (updateSuccess) { refetch(); toast.success("Đã cập nhật phân quyền"); setActive(false); }
    if (updateError && "data" in updateError) toast.error((updateError as any).data.message);
    if (deleteSuccess) { refetch(); toast.success("Đã xóa người dùng"); setOpen(false); }
    if (deleteError && "data" in deleteError) toast.error((deleteError as any).data.message);
    if (lockSuccess) { refetch(); toast.success("Đã cập nhật trạng thái khóa"); setLockOpen(false); setLockReason(""); }
    if (lockError && "data" in lockError) toast.error((lockError as any).data.message);
  }, [updateError, updateSuccess, deleteSuccess, deleteError, lockSuccess, lockError, refetch]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Họ Tên", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Vai trò", flex: 0.2, renderCell: (p:any) => <span className={`px-2 py-1 text-xs font-bold rounded ${p.value === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-neutral-500/10 text-neutral-500'}`}>{p.value}</span> },
    { field: "status", headerName: "Trạng thái", flex: 0.2, renderCell: (p:any) => <span className={`px-2 py-1 text-xs font-bold rounded ${p.row.isLocked ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{p.row.isLocked ? 'Locked' : 'Active'}</span> },
    
    // ĐÃ THÊM LẠI CỘT HIỂN THỊ SỐ LƯỢNG KHÓA HỌC
    { field: "courses", headerName: "Số khóa", flex: 0.2 }, 
    
    { field: "created_at", headerName: "Ngày tạo", flex: 0.3 },
    { 
      field: "info", 
      headerName: "Chi tiết", 
      flex: 0.2, 
      renderCell: (params: any) => (
        <button 
          className="flex h-full items-center" 
          onClick={() => { 
            const user = data?.users.find((u: any) => u._id === params.row.id);
            setSelectedUser(user);
            setDetailsOpen(true); 
          }}
        >
          <AiOutlineEye className="text-blue-500 hover:text-blue-400 transition-colors" size={20} />
        </button>
      ) 
    },
    { field: "email_user", headerName: "Mail", flex: 0.15, renderCell: (params: any) => <a href={`mailto:${params.row.email}`} className="flex h-full items-center"><AiOutlineMail className="text-emerald-500 hover:text-emerald-400 transition-colors" size={20} /></a> },
    { field: "lock", headerName: "Khóa", flex: 0.15, renderCell: (params: any) => <button className="flex h-full items-center" onClick={() => { setLockOpen(true); setUserId(params.row.id); }}>{params.row.isLocked ? <AiOutlineUnlock className="text-emerald-500 hover:text-emerald-400 transition-colors" size={20} /> : <AiOutlineLock className="text-yellow-500 hover:text-yellow-400 transition-colors" size={20} />}</button> },
    { field: "delete", headerName: "Xóa", flex: 0.15, renderCell: (params: any) => <button className="flex h-full items-center" onClick={() => { setOpen(true); setUserId(params.row.id); }}><AiOutlineDelete className="text-red-500 hover:text-red-400 transition-colors" size={20} /></button> },
  ];

  const rows: any = [];
  const sourceData = isTeam ? data?.users?.filter((i:any) => i.role === "admin") : data?.users;
  sourceData?.forEach((item: any) => {
    rows.push({ id: item._id, name: item.name, email: item.email, role: item.role, isLocked: item.isLocked, courses: item.courses.length, created_at: format(item.createdAt) });
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
            // TĂNG minWidth lên 1100px ĐỂ CÁC CỘT KHÔNG BỊ CHÈN ÉP
            "& .MuiDataGrid-root": { border: "none", fontFamily: "var(--font-Poppins)", minWidth: "1100px" },
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

      {/* Modal Xem chi tiết User */}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none">
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-black/10 dark:border-white/10">
                <img src={selectedUser.avatar?.url || "/assets/avatar.png"} alt="avatar" className="w-20 h-20 rounded-full object-cover border border-black/10 dark:border-white/10" />
                <div>
                  <h2 className="text-xl font-Josefin font-bold text-black dark:text-white">{selectedUser.name}</h2>
                  <p className="text-sm text-neutral-500 font-mono mt-1">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${selectedUser.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-neutral-500/10 text-neutral-500'}`}>{selectedUser.role}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${selectedUser.isLocked ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{selectedUser.isLocked ? 'Locked' : 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="flex justify-between">
                  <span className="font-semibold text-black dark:text-white">Định danh (ID):</span>
                  <span className="font-mono text-neutral-500">{selectedUser._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black dark:text-white">Ngày tham gia:</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black dark:text-white">Cập nhật lần cuối:</span>
                  <span>{format(selectedUser.updatedAt)}</span>
                </div>
              </div>

              {/* KHU VỰC HIỂN THỊ DANH SÁCH KHÓA HỌC */}
              <div className="pt-6 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-black dark:text-white">Các khóa học đã mua:</span>
                  <span className="text-sm font-Josefin font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded">{selectedUser.courses.length} Khóa</span>
                </div>
                
                {selectedUser.courses.length === 0 ? (
                  <p className="text-sm text-neutral-500 italic text-center py-4 bg-black/5 dark:bg-white/5 rounded-lg">Người dùng này chưa sở hữu khóa học nào.</p>
                ) : (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {selectedUser.courses.map((userCourse: any, index: number) => {
                      const courseDetail = coursesData?.courses?.find((c: any) => c._id === userCourse.courseId);
                      return (
                        <div key={index} className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                          <img 
                            src={courseDetail?.thumbnail?.url || "/assets/banner.png"} 
                            alt="course thumbnail" 
                            className="w-16 h-12 object-cover rounded-md shrink-0"
                          />
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-semibold text-black dark:text-white line-clamp-1">
                              {courseDetail?.name || "Khóa học đã bị xóa khỏi hệ thống"}
                            </h4>
                            <p className="text-xs text-neutral-500 mt-1 font-mono">
                              {courseDetail?.price ? `${courseDetail.price.toLocaleString('vi-VN')} VNĐ` : "0 VNĐ"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button className={`${styles.button} !mt-6`} onClick={() => setDetailsOpen(false)}>Đóng</button>
            </div>
          )}
        </Box>
      </Modal>

      {/* Lock User Modal */}
      <Modal open={lockOpen} onClose={() => setLockOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[400px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-6 md:p-8 outline-none max-w-full">
          <h2 className="text-xl font-Josefin font-bold text-black dark:text-white mb-6">Lý do thay đổi trạng thái?</h2>
          <div className="space-y-4">
            <textarea value={lockReason} onChange={(e) => setLockReason(e.target.value)} placeholder="Nhập lý do khóa / mở khóa (Sẽ gửi email cho người dùng)" className={`${styles.input} !h-24 py-3 resize-none`} />
            <button className={`${styles.button} !mt-4`} onClick={() => lockUnlockUser({ id: userId, reason: lockReason })}>Xác nhận</button>
          </div>
        </Box>
      </Modal>

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