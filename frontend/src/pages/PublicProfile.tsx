import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Trophy, Flame, Coins, ShieldAlert, Target, Link, Calendar, ArrowLeft, Brain } from 'lucide-react';

interface PublicProfileData {
  clerk_id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  interests: string | null;
  topics: string | null;
  profile_icon: string;
  xp_points: number;
  coins: number;
  current_streak: number;
  rank: string;
  created_at: string | null;
}

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/users/${id}/profile`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-zinc-900 dark:text-zinc-100">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">The artisan you are looking for does not exist.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700">
          Go Back
        </button>
      </div>
    );
  }

  const interestsList = profile.interests ? JSON.parse(profile.interests) : [];
  const topicsList = profile.topics ? JSON.parse(profile.topics) : [];
  const displayName = profile.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}` 
    : 'Unknown Artisan';

  return (
    <div className="p-8 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      {/* Hero Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-rose-600 p-1 rounded-3xl shadow-lg shrink-0">
            <div className="w-full h-full bg-zinc-900 rounded-[22px] flex items-center justify-center">
              {/* Fallback to User icon if dynamically rendering the chosen icon is too complex without a map */}
              <User className="w-16 h-16 text-amber-500" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h1 className="text-4xl font-extrabold font-['Outfit'] tracking-tight">
                {displayName}
              </h1>
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold rounded-full uppercase tracking-wider">
                {profile.rank}
              </div>
            </div>
            
            {profile.created_at && (
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                <Calendar className="w-4 h-4" />
                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}

            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
              {profile.bio || "This artisan prefers to let their code speak for itself."}
            </p>

            <div className="flex gap-3 mt-6">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors">
                  <Link className="w-5 h-5" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors">
                  <Link className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Experience</div>
            <div className="text-2xl font-black font-['Outfit']">{profile.xp_points} XP</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-500">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Wealth</div>
            <div className="text-2xl font-black font-['Outfit']">{profile.coins} Coins</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-orange-500/10 rounded-xl text-orange-500">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Streak</div>
            <div className="text-2xl font-black font-['Outfit']">{profile.current_streak} Days</div>
          </div>
        </div>
      </div>

      {/* Badges / Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            Tech Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interestsList.length > 0 ? interestsList.map((interest: string) => (
              <span key={interest} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700">
                {interest}
              </span>
            )) : (
              <span className="text-zinc-500 dark:text-zinc-500 text-sm italic">No specific interests set.</span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            Currently Studying
          </h3>
          <div className="flex flex-wrap gap-2">
            {topicsList.length > 0 ? topicsList.map((topic: string) => (
              <span key={topic} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-md border border-indigo-200 dark:border-indigo-800/50">
                {topic}
              </span>
            )) : (
              <span className="text-zinc-500 dark:text-zinc-500 text-sm italic">Not actively studying any topics.</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PublicProfile;
