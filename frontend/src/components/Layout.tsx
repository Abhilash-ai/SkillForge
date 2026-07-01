import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserButton } from '@clerk/react';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#18181B] text-zinc-200 min-h-screen font-['Inter'] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative w-full transition-all duration-300">
        {/* Soft radial gradient for ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <header className="h-16 bg-[#18181B]/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between md:justify-end px-4 md:px-8 shrink-0 z-10 sticky top-0 w-full">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-['Outfit'] font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">SkillForge</span>
          </div>
          <UserButton />
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 scrollbar-hide w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
