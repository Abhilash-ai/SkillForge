import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, User, ArrowRight, X, Layout, Trophy, Settings, Brain, BookOpen } from 'lucide-react';

interface UserResult {
  clerk_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_icon: string;
  rank: string;
}

const NAVIGATION_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: Layout },
  { name: 'Battle Ground', path: '/arena', icon: Command },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Playground', path: '/playground', icon: BookOpen },
  { name: 'Mentor Chat', path: '/mentor', icon: Brain },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const CommandPalette = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) => {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close on Escape, toggle on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setUserResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    if (query.trim().length < 2) {
      setUserResults([]);
      return;
    }
    
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.users) setUserResults(data.users);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const navResults = NAVIGATION_LINKS.filter(link => 
    link.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              
              <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for pages, artisans, or tools..."
                  className="w-full bg-transparent border-none text-zinc-100 placeholder:text-zinc-500 focus:ring-0 text-lg outline-none"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                
                {/* Navigation Results */}
                {navResults.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Navigation
                    </div>
                    {navResults.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => handleNavigate(link.path)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-5 h-5 text-zinc-500 group-hover:text-amber-500" />
                          <span className="font-medium">{link.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}

                {/* User Results */}
                {query.trim().length >= 2 && (
                  <div>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Artisans</span>
                      {loading && <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    
                    {!loading && userResults.length === 0 && (
                      <div className="px-4 py-8 text-center text-zinc-500">
                        No artisans found matching "{query}"
                      </div>
                    )}
                    
                    {userResults.map((user) => {
                      const displayName = user.first_name 
                        ? `${user.first_name} ${user.last_name || ''}`.trim() 
                        : `User ${user.clerk_id.substring(0, 5)}...`;
                        
                      return (
                        <button
                          key={user.clerk_id}
                          onClick={() => handleNavigate(`/profile/${user.clerk_id}`)}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-zinc-800 rounded-md text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10">
                              <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{displayName}</span>
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                {user.rank}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Empty State / Hints */}
                {query.trim() === '' && (
                  <div className="px-4 py-12 flex flex-col items-center justify-center text-zinc-500">
                    <Command className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Search for anything in the forge</p>
                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-zinc-800 rounded text-xs">Navigation</span>
                      <span className="px-2 py-1 bg-zinc-800 rounded text-xs">Users</span>
                    </div>
                  </div>
                )}

              </div>
              
              <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd> to select</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↓</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑</kbd> to navigate</span>
                </div>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">esc</kbd> to close</span>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
