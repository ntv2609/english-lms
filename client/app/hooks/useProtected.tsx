"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Loader from '../components/Loader/Loader';

interface ProtectedProps { children: React.ReactNode; }

export default function Protected({ children }: ProtectedProps) {
  // Dùng luôn hook của RTK Query để lấy state Loading chính xác nhất
  const { isLoading, data } = useLoadUserQuery(undefined, {});
  const router = useRouter();

  useEffect(() => {
    // Chỉ khi API load xong mà không có user mới chuyển hướng
    if (!isLoading && !data?.user) {
      router.replace('/');
    }
  }, [isLoading, data, router]);

  // Hiển thị Loader khi đang check Auth (lúc từ MoMo văng về)
  if (isLoading) return <Loader />;
  
  // Chặn render component con nếu chưa xác thực xong để tránh vỡ UI
  if (!data?.user) return null;

  return <>{children}</>;
}