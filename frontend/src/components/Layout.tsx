import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserButton } from '@clerk/react';
import { Menu, Search } from 'lucide-react';
import { CommandPalette } from './CommandPalette';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex bg-[#18181B] text-zinc-800 dark:text-zinc-200 min-h-screen font-['Inter'] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative w-full transition-all duration-300">
        {/* Soft radial gradient for ambient lighting */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <header className="h-16 bg-[#18181B]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between md:justify-end px-4 md:px-8 shrink-0 z-10 sticky top-0 w-full">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-100 dark:bg-zinc-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-['Outfit'] font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">SkillForge</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 py-2 text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search forge...</span>
              <kbd className="hidden lg:inline-flex px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono text-zinc-400 font-bold ml-12">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
            
            <UserButton />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 scrollbar-hide w-full">
          <Outlet />
        </main>
        
        <CommandPalette isOpen={searchOpen} setIsOpen={setSearchOpen} />
      </div>
    </div>
  );
};

export default Layout;
