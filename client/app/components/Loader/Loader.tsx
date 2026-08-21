import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-[#050505] z-[9999]">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;