import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Plus, Search, Hash } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-fuchsia-600" /> Community Hub
            </h1>
            <p className="text-zinc-600 text-lg">Connect, collaborate, and grow with peers and mentors.</p>
          </div>
          <button className="px-6 py-3 bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Post
          </button>
        </header>

        <div className="flex gap-8">
          <div className="w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 sticky top-8">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('discussions')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'discussions' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  General Discussions
                </button>
                <button 
                  onClick={() => setActiveTab('teams')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'teams' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  Find Teammates
                </button>
                <button 
                  onClick={() => setActiveTab('study')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'study' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  Study Groups
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['#react', '#dsa', '#interview', '#python', '#hackathon'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium cursor-pointer hover:bg-zinc-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-3/4 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.1 }}
                key={item} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-fuchsia-500" />
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">Alex Developer</h4>
                      <p className="text-xs text-zinc-500">2 hours ago</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                    Discussion
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-800 mb-2">How to approach Dynamic Programming problems?</h3>
                <p className="text-zinc-600 mb-4 line-clamp-2">
                  I've been struggling with DP for a while now. I can solve the basic ones like Fibonacci, but when it comes to knapsack or path finding, my brain freezes. Any structured approach you guys recommend?
                </p>
                
                <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5 hover:text-fuchsia-600">
                    <MessageSquare className="w-4 h-4" /> 24 Replies
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-fuchsia-600">
                    <Hash className="w-4 h-4" /> dsa
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
