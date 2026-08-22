"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Loader from '../components/Loader/Loader';

interface ProtectedProps { children: React.ReactNode; }

export default function AdminProtected({ children }: ProtectedProps) {
  const { isLoading, data } = useLoadUserQuery(undefined, {});
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!data?.user || data?.user?.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [isLoading, data, router]);

  if (isLoading) return <Loader />;

  if (!data?.user || data?.user?.role !== 'admin') return null;

  return <>{children}</>;
}