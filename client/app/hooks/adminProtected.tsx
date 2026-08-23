"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Loader from '../components/Loader/Loader';

interface ProtectedProps { children: React.ReactNode; }

export default function AdminProtected({ children }: ProtectedProps) {
  const [mounted, setMounted] = useState(false);
  const { isLoading, data } = useLoadUserQuery(undefined, {});
  const router = useRouter();

  // Ép client phải render xong lần đầu tiên mới bắt đầu xử lý logic
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!data?.user || data?.user?.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [isLoading, data, router, mounted]);

  // FIX HYDRATION: Đảm bảo SSR và CSR lần đầu tiên đều trả về chung 1 kết quả
  if (!mounted) return <Loader />;
  if (isLoading) return <Loader />;
  
  if (!data?.user || data?.user?.role !== 'admin') return null;

  return <>{children}</>;
}