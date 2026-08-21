import React, { FC, useState, useEffect } from 'react';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';
import { styles } from '@/app/styles/style';

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) toast.error('Mật khẩu xác nhận không khớp!');
    else await updatePassword({ oldPassword, newPassword });
  };

  useEffect(() => {
    if (isSuccess) { toast.success('Đổi mật khẩu thành công!'); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }
    if (error && 'data' in error) toast.error((error as any).data.message);
  }, [isSuccess, error]);

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-Josefin font-bold text-black dark:text-white mb-8">Bảo mật</h1>
      <form onSubmit={passwordChangeHandler} className="space-y-6">
        <div>
          <label className={styles.label}>Mật khẩu hiện tại</label>
          <input type="password" required className={styles.input} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label className={styles.label}>Mật khẩu mới</label>
          <input type="password" required className={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label className={styles.label}>Xác nhận mật khẩu mới</label>
          <input type="password" required className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit" className={`${styles.button} !w-40 mt-4`}>Cập nhật</button>
      </form>
    </div>
  );
};

export default ChangePassword;