import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Code2, Users, FileQuestion, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const companies = [
  { name: 'Google', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { name: 'Microsoft', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  { name: 'Amazon', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { name: 'TCS', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  { name: 'Deloitte', color: 'text-emerald-600', bg: 'bg-emerald-50' }
];

const Placement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">
            Placement Preparation Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Targeted prep tracks, mock interviews, and company-specific guides to ace your next technical interview.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            whileHover={{ y: -5 }} 
            onClick={() => navigate('/assessment?topic=Data Structures and Algorithms')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <Code2 className="w-12 h-12 text-fuchsia-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">DSA & Problem Solving</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Curated lists of the most frequently asked algorithmic questions.</p>
            <div className="flex items-center text-fuchsia-400 font-bold gap-2 group-hover:gap-3 transition-all">
              Start Practice <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }} 
            onClick={() => navigate('/assessment?topic=Behavioral and HR Interviews')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <Users className="w-12 h-12 text-cyan-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">HR & Behavioral</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Master the STAR method and prepare for cultural fit rounds.</p>
            <div className="flex items-center text-cyan-400 font-bold gap-2 group-hover:gap-3 transition-all">
              View Questions <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-violet-400" /> Company-Specific Tracks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {companies.map((company, idx) => (
            <motion.div 
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/careers`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${company.bg} ${company.color} flex items-center justify-center font-black text-xl mb-3`}>
                {company.name[0]}
              </div>
              <span className="font-bold">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Placement;
