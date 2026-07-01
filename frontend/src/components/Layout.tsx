import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserButton } from '@clerk/react';

const Layout = () => {
  return (
    <div className="flex bg-[#18181B] text-zinc-200 min-h-screen font-['Inter']">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative">
        {/* Soft radial gradient for ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <header className="h-16 bg-[#18181B]/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-end px-8 shrink-0 z-10 sticky top-0">
          <UserButton />
        </header>
        <main className="flex-1 overflow-y-auto relative z-0 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
