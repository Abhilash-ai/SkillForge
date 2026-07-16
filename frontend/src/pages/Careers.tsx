import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, TrendingUp, DollarSign, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const careersList = [
  "Software Engineer",
  "Data Scientist",
  "AI/ML Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "UI/UX Designer",
  "Product Manager"
];

const Careers = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = async (career: string) => {
    setLoading(true);
    setInsights(null);
    try {
      const res = await fetch(`/api/careers/${encodeURIComponent(career)}`);
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch insights');
      }
      
      setInsights(data);
    } catch (err) {
      console.error(err);
      // Fallback data if backend is not running
      setInsights({
        career,
        overview: "A highly sought-after role focused on solving complex problems.",
        salary_range: "$80k - $160k",
        demand: "Very High",
        key_skills: ["Problem Solving", "Communication", "Technical Depth"],
        top_companies: ["Google", "Microsoft", "Amazon"]
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">AI Career Discovery</h1>
          <p className="text-slate-600 text-lg">Explore roles, salary insights, and industry demand powered by AI.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-slate-600 dark:text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search a career..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">Popular Careers</h3>
              <ul className="space-y-2">
                {careersList.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <li key={c}>
                    <button 
                      onClick={() => handleSearch(c)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-cyan-50 hover:text-cyan-700 transition-colors font-medium flex items-center justify-between group"
                    >
                      {c}
                      <Briefcase className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:w-2/3">
            {loading ? (
              <div className="h-96 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
              </div>
            ) : insights ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-100 text-fuchsia-700 font-bold text-sm mb-6">
                  {insights.demand} Demand
                </div>
                <h2 className="text-4xl font-extrabold mb-4">{insights.career}</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{insights.overview}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-100">
                    <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />
                    <h4 className="text-emerald-900 font-bold mb-1">Salary Range</h4>
                    <p className="text-2xl font-extrabold text-emerald-700">{insights.salary_range}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-fuchsia-50 border border-cyan-100">
                    <TrendingUp className="w-8 h-8 text-cyan-600 mb-2" />
                    <h4 className="text-cyan-900 font-bold mb-1">Top Companies</h4>
                    <p className="text-cyan-700 font-medium">{insights.top_companies?.join(', ')}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-500" /> Core Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.key_skills?.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => navigate(`/roadmap?career=${encodeURIComponent(insights.career)}`)}
                    className="w-full py-4 rounded-xl bg-white dark:bg-slate-900 text-white font-bold text-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Generate Personalized Roadmap <TrendingUp className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-96 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p>Select or search a career to view AI insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
