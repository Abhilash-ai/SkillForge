import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { Flame, Target, Trophy, Swords, Zap, Shield, ChevronRight, Activity, Award } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchDashboard = async () => {
        try {
          const res = await fetch(`/api/users/${user.id}/dashboard`);
          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboard();
    }
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 flex items-center justify-center">
            <Flame className="w-8 h-8 text-violet-500 animate-bounce" />
          </div>
          <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
          <p className="text-slate-500 text-sm italic max-w-xs text-center">Waking up the Forge (Free Tier Server). This might take up to 50 seconds on the first load...</p>
        </div>
      </div>
    );
  }

  const dbUser = dashboardData?.user || {};
  const xp = dbUser.xp_points || 0;
  const streak = dbUser.current_streak || 0;
  const rank = dbUser.rank || 'Apprentice';
  const roadmap = dashboardData?.roadmap;

  return (
    <div className="min-h-screen p-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
          <div>
            <h1 className="text-4xl font-extrabold font-['Outfit'] tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-cyan-500 transition-all duration-300 cursor-default inline-block">
              The Forge Room
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              Welcome back to your workshop, <span className="text-violet-500 font-medium">{user?.firstName || 'Artisan'}</span>. Let's build your future.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="forge-panel px-6 py-3 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Rank</span>
                <span className="text-violet-500 font-bold font-['Outfit']">{rank}</span>
              </div>
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Forge XP</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold font-['Outfit']">{xp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Daily Mission Panel */}
            <div className="forge-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] group-hover:bg-violet-500/20 transition-colors duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Target className="w-6 h-6 text-violet-500" />
                  </div>
                  <h2 className="text-2xl font-bold font-['Outfit']">Daily Mission</h2>
                </div>
                
                {dashboardData?.missions && dashboardData.missions.length > 0 ? (
                  dashboardData.missions.map((mission: any, idx: number) => (
                    <div key={idx} className="forge-panel p-6 mb-6 hover:border-violet-700/50 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{mission.mission.title}</h3>
                        <span className="px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-xs font-bold border border-violet-500/20">+{mission.mission.xp_reward} XP</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{mission.mission.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-300 dark:border-slate-700">
                          <div className="bg-gradient-to-r from-violet-700 to-violet-500 h-full rounded-full relative overflow-hidden" style={{ width: `${mission.progress_percentage}%` }}>
                            {/* Molten metal animation effect */}
                            <div className="absolute inset-0 bg-white/20 animate-forge-flow" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-violet-500">{mission.progress_percentage}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="forge-panel p-6 mb-6 text-center text-slate-500 italic border-dashed">
                    No active missions right now. The Forge is cooling.
                  </div>
                )}

                <button className="forge-button w-full py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2">
                  <Swords className="w-5 h-5" />
                  Resume Forging
                </button>
              </div>
            </div>

            {/* Current Skill Forge Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="forge-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-bold font-['Outfit'] text-lg">Active Roadmap</h3>
                </div>
                {roadmap ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{roadmap.career}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{roadmap.stage_text}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${roadmap.progress_percentage}%`}}></div>
                    </div>
                    <a href="/roadmap" className="text-sm text-emerald-500 font-medium hover:text-emerald-400 flex items-center gap-1 mt-4 transition-colors">
                      View Journey Map <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm italic">
                    No active roadmap found. Visit the AI Mentor to generate one.
                  </div>
                )}
              </div>

              <div className="forge-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-violet-500" />
                  </div>
                  <h3 className="font-bold font-['Outfit'] text-lg">Weekly Goals</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-md border border-violet-500/50 flex items-center justify-center bg-violet-500/20">
                      <div className="w-2.5 h-2.5 bg-violet-500 rounded-sm"></div>
                    </div>
                    Complete 3 algorithms
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center"></div>
                    Update Resume via ATS
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center"></div>
                    Contribute to Community
                  </li>
                </ul>
              </div>
            </div>
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Active Streak */}
            <div className="forge-card p-6 bg-gradient-to-b from-slate-900 to-[#1e1a16] border-violet-900/30">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 animate-pulse"></div>
                  <Flame className="w-16 h-16 text-violet-500 relative z-10" />
                </div>
                <h3 className="text-4xl font-black font-['Outfit'] mt-4 text-white">{streak} <span className="text-xl text-slate-600 dark:text-slate-400 font-medium">Days</span></h3>
                <p className="text-violet-500/80 text-sm mt-2 font-medium uppercase tracking-widest">Active Forging Streak</p>
                
                <div className="flex gap-2 mt-6">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className={`w-8 h-10 rounded-md flex flex-col items-center justify-center text-xs font-bold ${i < streak ? 'bg-violet-500/20 text-violet-500 border border-violet-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Shelf */}
            <div className="forge-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold font-['Outfit'] text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  Showcase Shelf
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700/50 flex flex-col items-center justify-center p-2 group hover:border-violet-500/50 transition-colors cursor-pointer">
                  <Award className="w-8 h-8 text-violet-600 group-hover:text-violet-500 transition-colors mb-2" />
                  <span className="text-[10px] text-center text-slate-600 dark:text-slate-400 leading-tight">First Spark</span>
                </div>
                <div className="aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700/50 flex flex-col items-center justify-center p-2 group hover:border-violet-500/50 transition-colors cursor-pointer">
                  <Zap className="w-8 h-8 text-violet-600 group-hover:text-violet-500 transition-colors mb-2" />
                  <span className="text-[10px] text-center text-slate-600 dark:text-slate-400 leading-tight">Fast Learner</span>
                </div>
                <div className="aspect-square bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl flex items-center justify-center p-2">
                  <span className="text-[10px] text-slate-600 text-center">Locked</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
