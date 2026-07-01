import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, useUser } from '@clerk/react';
import { ArrowRight, Sparkles, Brain, Target, Rocket } from 'lucide-react';

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden relative font-sans selection:bg-rose-500/30">
      {/* Background gradients and particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500"
        >
          SkillForge
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {isSignedIn ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all flex items-center gap-2 font-medium"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-5 py-2 text-zinc-300 hover:text-white transition-colors font-medium">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-medium shadow-lg shadow-rose-500/25 transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          AI-Powered Career Acceleration
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8"
        >
          Master your craft. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400">
            Forge your future.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12"
        >
          The all-in-one AI mentor that bridges the gap between education and industry expectations. Personalized roadmaps, real-time coding, and intelligent placement prep.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {isSignedIn ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-full bg-white text-zinc-900 font-bold text-lg hover:bg-zinc-100 transition-colors flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <SignUpButton mode="modal">
              <button className="px-8 py-4 rounded-full bg-white text-zinc-900 font-bold text-lg hover:bg-zinc-100 transition-colors flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                Start For Free <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          )}
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full">
          <FeatureCard 
            icon={<Brain className="w-6 h-6 text-rose-400" />}
            title="AI Career Discovery"
            desc="Discover roles tailored to your strengths and get dynamic roadmaps to mastery."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-orange-400" />}
            title="Skill Assessment"
            desc="Real-time coding environments and aptitude tests to gauge industry readiness."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Rocket className="w-6 h-6 text-amber-400" />}
            title="Placement Prep"
            desc="Mock interviews, resume analysis, and tailored prep tracks for top tech companies."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl flex flex-col items-start text-left"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

export default LandingPage;
