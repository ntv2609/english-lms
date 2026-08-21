'use client'
import React, { useState } from 'react';
import Protected from '../hooks/useProtected';
import { Heading } from '../utils/Heading';
import Header from '../components/Header';
import Profile from '../components/Profile/Profile';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';

const Page = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505]">
      <Protected>
        <Heading title={`Hồ sơ | ${user?.name}`} description="Hồ sơ cá nhân" keywords="Profile" />
        <Header open={open} setOpen={setOpen} activeItem={5} setRoute={setRoute} route={route} />
        <Profile user={user} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;