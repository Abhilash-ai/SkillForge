import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Map, Terminal, Target, FileText, Briefcase, Users, Globe, ShieldAlert, Sparkles, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { name: 'The Forge', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Careers', path: '/careers', icon: Compass },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Playground', path: '/playground', icon: Terminal },
    { name: 'AI Mentor', path: '/mentor', icon: Sparkles },
    { name: 'Assessment', path: '/assessment', icon: Target },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Placement Prep', path: '/placement', icon: Briefcase },
    { name: 'Projects', path: '/projects', icon: Terminal },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Opportunities', path: '/opportunities', icon: Globe },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div className={`w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col fixed left-0 top-0 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between border-b border-zinc-800/60 shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0">
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 font-['Outfit']">SkillForge</span>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600/20 to-transparent text-amber-500 border border-amber-600/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 border border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
