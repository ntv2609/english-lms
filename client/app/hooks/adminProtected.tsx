import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';
import React from 'react';

interface ProtectedProps { children: React.ReactNode; }

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  if (user && user?.role === 'admin') return <>{children}</>;
  return redirect('/');
}