import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Clock, CheckCircle2, ChevronRight, Activity, Hammer } from 'lucide-react';
import { useUser } from '@clerk/react';

const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const urlCareer = searchParams.get('career');
  const displayCareer = urlCareer || 'your dream career';
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const loadRoadmap = async () => {
        try {
          // 1. Check if user already has an active roadmap
          const res = await fetch(`/api/users/${user.id}/roadmap`);
          if (res.ok) {
            const data = await res.json();
            if (data && (!urlCareer || data.career.toLowerCase() === urlCareer.toLowerCase())) {
              setRoadmap(data);
              setLoading(false);
              return;
            }
          }
          
          // 2. If no roadmap, generate one
          const payload: any = { clerk_id: user.id };
          if (urlCareer) {
            payload.career = urlCareer;
          }
          
          const genRes = await fetch('/api/roadmaps/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!genRes.ok) {
             throw new Error("Failed to generate roadmap");
          }
          
          const genData = await genRes.json();
          setRoadmap(genData);

        } catch (err) {
          console.error(err);
          setError("The Forge is currently too hot. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      
      loadRoadmap();
    }
  }, [isLoaded, user, urlCareer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181B] flex flex-col items-center justify-center text-zinc-900 dark:text-zinc-100">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 animate-pulse"></div>
          <Hammer className="w-16 h-16 text-amber-500 mb-6 animate-bounce relative z-10" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Forging Your Roadmap</h2>
        <p className="text-zinc-600 dark:text-zinc-400">The Master Smith is crafting a personalized path for {displayCareer}.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="forge-card p-8 text-center border-red-900/30 bg-red-900/10">
           <h2 className="text-2xl font-bold text-red-500 mb-2 font-['Outfit']">Forging Failed</h2>
           <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 text-amber-500 font-bold text-sm mb-6 border border-amber-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <Map className="w-4 h-4" /> The Journeyman's Path
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-['Outfit'] tracking-tight mb-6 text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
            {roadmap?.career} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Roadmap</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {roadmap?.description} <br/>
            <span className="text-amber-500/80 font-semibold uppercase tracking-wider text-sm mt-4 inline-block">Estimated Forging Time: {roadmap?.estimated_months} months</span>
          </p>
        </header>

        {/* The Path */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-amber-700/50 before:to-transparent before:rounded-full">
          {roadmap?.milestones?.map((milestone: any, index: number) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              
              {/* Central Glowing Node */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-[4px] border-[#18181B] bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-white font-black font-['Outfit'] text-lg group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </div>
              
              {/* Milestone Card */}
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] forge-card p-8 group-hover:border-amber-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-2xl font-['Outfit'] text-zinc-900 dark:text-zinc-100">{milestone.title}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" /> {milestone.duration}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Key Forging Tasks</h4>
                    <ul className="space-y-3">
                      {milestone.tasks?.map((task: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${milestone.is_completed ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-zinc-600'}`} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {milestone.projects && milestone.projects.length > 0 && (
                    <div className="p-5 bg-[#27272A]/80 rounded-xl border border-[#3F3F46] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <h4 className="text-xs font-bold text-amber-500/70 uppercase tracking-widest mb-2">Masterpiece Project</h4>
                      <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold font-['Outfit'] text-lg">
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                        {milestone.projects[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
