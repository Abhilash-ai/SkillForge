import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { Trophy, Medal, Flame, Coins, ShieldAlert, Target } from 'lucide-react';

interface LeaderboardUser {
  clerk_id: string;
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
          <p className="text-zinc-400">Compete in the Battle Ground to climb the ranks.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-950/50 font-bold text-zinc-400 text-sm tracking-wider uppercase">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">User ID</div>
          <div className="col-span-3">Tier</div>
          <div className="col-span-2 text-right">XP Points</div>
          <div className="col-span-1 text-center">Coins</div>
          <div className="col-span-1 text-center">Streak</div>
        </div>

        <div className="divide-y divide-zinc-800">
          {users.map((user, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-zinc-800/50 ${user.clerk_id === userId ? 'bg-amber-900/20' : ''}`}
            >
              <div className="col-span-1 flex justify-center">
                {idx === 0 ? <Medal className="w-6 h-6 text-yellow-400" /> : 
                 idx === 1 ? <Medal className="w-6 h-6 text-zinc-300" /> : 
                 idx === 2 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                 <span className="font-bold text-zinc-500">#{idx + 1}</span>}
              </div>
              <div className="col-span-4 font-mono text-sm text-zinc-300 truncate pr-4">
                {user.clerk_id === userId ? <span className="text-amber-500 font-bold">You ({user.clerk_id.substring(0,8)}...)</span> : `${user.clerk_id.substring(0, 12)}...`}
              </div>
              <div className="col-span-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {user.rank}
                </span>
              </div>
              <div className="col-span-2 text-right font-mono font-bold text-emerald-400">
                {user.xp_points} XP
              </div>
              <div className="col-span-1 flex justify-center items-center gap-1 text-amber-400 font-bold">
                <Coins className="w-4 h-4" /> {user.coins}
              </div>
              <div className="col-span-1 flex justify-center items-center gap-1 text-orange-500 font-bold">
                <Flame className="w-4 h-4" /> {user.streak}
              </div>
            </div>
          ))}
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
