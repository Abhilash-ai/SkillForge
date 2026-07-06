import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Flame, Coins, ShieldAlert, Target, User, Laptop, Cloud, Database, Shield, Layout, Palette, Code, Terminal, Brain, Cpu, Smartphone } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  User, Laptop, Cloud, Database, Shield, Layout, Palette, Code, Terminal, Brain, Cpu, Smartphone
};

interface LeaderboardUser {
  clerk_id: string;
  first_name: string | null;
  last_name: string | null;
  profile_icon: string;
  rank: string;
  xp_points: number;
  coins: number;
  streak: number;
}

const Leaderboard = () => {
  const { userId } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/arena/leaderboard')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Global Leaderboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Compete in the Battle Ground to climb the ranks.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 font-bold text-zinc-600 dark:text-zinc-400 text-sm tracking-wider uppercase">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Artisan</div>
          <div className="col-span-3">Tier</div>
          <div className="col-span-2 text-right">XP Points</div>
          <div className="col-span-1 text-center">Coins</div>
          <div className="col-span-1 text-center">Streak</div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((user, idx) => {
            const isMe = user.clerk_id === userId;
            const displayName = user.first_name 
              ? `${user.first_name} ${user.last_name || ''}`.trim() 
              : `User ${user.clerk_id.substring(0, 5)}...`;
            
            const IconComp = ICON_MAP[user.profile_icon] || User;

            return (
              <Link
                to={`/profile/${user.clerk_id}`}
                key={idx} 
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 block cursor-pointer ${isMe ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
              >
                <div className="col-span-1 flex justify-center">
                  {idx === 0 ? <Medal className="w-6 h-6 text-yellow-500 drop-shadow-md" /> : 
                   idx === 1 ? <Medal className="w-6 h-6 text-zinc-400 drop-shadow-md" /> : 
                   idx === 2 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-md" /> : 
                   <span className="font-bold text-zinc-500">#{idx + 1}</span>}
                </div>
                
                <div className="col-span-4 flex items-center gap-3 pr-4">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {displayName}
                    {isMe && <span className="ml-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">(You)</span>}
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {user.rank}
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono font-bold text-emerald-500 dark:text-emerald-400">
                  {user.xp_points} XP
                </div>
                <div className="col-span-1 flex justify-center items-center gap-1 text-amber-500 font-bold">
                  <Coins className="w-4 h-4" /> {user.coins}
                </div>
                <div className="col-span-1 flex justify-center items-center gap-1 text-orange-500 font-bold">
                  <Flame className="w-4 h-4" /> {user.streak}
                </div>
              </Link>
            );
          })}
          
          {users.length === 0 && (
            <div className="p-12 text-center text-zinc-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No contenders yet. Be the first to join the Battle Ground!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
