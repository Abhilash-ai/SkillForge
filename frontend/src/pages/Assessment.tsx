import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, ArrowRight, Hammer, Flame, Layout, Server, Settings, Code, Database, Globe } from 'lucide-react';
import { useUser } from '@clerk/react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const DEFAULT_CATEGORIES = [
  { id: 'Frontend Development', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'Backend Development', icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'DevOps & Cloud', icon: Settings, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
  { id: 'Data Structures & Algorithms', icon: Code, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'Databases', icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'Web Security', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
];

const Assessment = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialCategory = searchParams.get('topic');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  
  const [score, setScore] = useState(0); // Tracks raw score (+4 / -1)
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch personalized topics
    if (!user) return;
    fetch(`/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.user && data.user.topics) {
        try {
          const userTopics = JSON.parse(data.user.topics);
          if (userTopics.length > 0) {
            const customCats = userTopics.map((t: string, i: number) => ({
              id: t, 
              icon: Target, 
              color: ['text-violet-500', 'text-cyan-500', 'text-emerald-500', 'text-fuchsia-500'][i % 4], 
              bg: ['bg-violet-500/10', 'bg-cyan-500/10', 'bg-emerald-500/10', 'bg-fuchsia-500/10'][i % 4]
            }));
            
            // Merge custom and default without duplicates
            const existingIds = new Set(customCats.map((c: any) => c.id));
            const filteredDefaults = DEFAULT_CATEGORIES.filter(c => !existingIds.has(c.id));
            setCategories([...customCats, ...filteredDefaults]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, [user]);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      const fetchQuestions = async () => {
        try {
          const res = await fetch(`/api/assessments/questions?topic=${encodeURIComponent(selectedCategory)}`);
          const data = await res.json();
          if (data.questions) {
            setQuestions(data.questions);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [selectedCategory]);

  const handleSelectCategory = (categoryId: string) => {
    setSearchParams({ topic: categoryId });
    setSelectedCategory(categoryId);
  };

  const handleNext = async () => {
    let currentScore = score;
    
    if (selected === questions[currentIdx].correct) {
      currentScore += 4;
      setCorrectCount(c => c + 1);
    } else {
      currentScore -= 1;
      setWrongCount(w => w + 1);
    }
    setScore(currentScore);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      // Finished, submit to backend
      setSubmitting(true);
      
      const maxPossibleScore = questions.length * 4;
      const finalScore = Math.max(0, currentScore);
      const percentage = Math.round((finalScore / maxPossibleScore) * 100);
      
      try {
        const res = await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerk_id: user?.id,
            topic: selectedCategory,
            score_percentage: percentage
          })
        });
        const result = await res.json();
        setResultData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
        setShowResult(true);
      }
    }
  };

  const getRank = (percentage: number) => {
    if (percentage === 100) return { title: "Grandmaster", color: "from-violet-400 to-violet-600" };
    if (percentage >= 80) return { title: "Master Smith", color: "from-violet-500 to-violet-700" };
    if (percentage >= 60) return { title: "Artisan", color: "from-emerald-400 to-emerald-600" };
    if (percentage >= 40) return { title: "Craftsman", color: "from-slate-400 to-slate-600" };
    return { title: "Apprentice", color: "from-fuchsia-700 to-cyan-900" };
  };

  if (!selectedCategory) {
    return (
      <div className="min-h-screen p-8 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
            <Target className="w-8 h-8 text-violet-500" />
          </div>
          <h1 className="text-4xl font-black font-['Outfit'] mb-4">Choose Your Proving Ground</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Select a domain to test your knowledge. Be warned: every correct strike earns <span className="text-emerald-500 font-bold">+4 points</span>, but a miss will cost you <span className="text-red-500 font-bold">-1 point</span>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, idx) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="forge-card p-6 cursor-pointer hover:border-violet-500/50 hover:bg-slate-100 dark:bg-slate-800/80 transition-all flex flex-col items-center text-center group"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-2`}>
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-violet-500 transition-colors">{cat.id}</h3>
              <p className="text-slate-500 text-sm">Generate 10 dynamic questions to test your proficiency in {cat.id}.</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181B] flex flex-col items-center justify-center text-slate-900 dark:text-slate-100">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 animate-pulse"></div>
          <Flame className="w-16 h-16 text-violet-500 mb-6 animate-pulse relative z-10" />
        </div>
        <h2 className="text-3xl font-black font-['Outfit'] mb-2">Stoking the Forge...</h2>
        <p className="text-slate-600 dark:text-slate-400">Heating up the metal for your test in {selectedCategory}.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-8 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center">
        <div className="forge-card p-8 text-center">
           <h2 className="text-2xl font-bold font-['Outfit'] text-red-500 mb-2">Forging Failed</h2>
           <p className="text-slate-600 dark:text-slate-400 mb-6">Could not generate questions. The fire is too weak today.</p>
           <button onClick={() => setSelectedCategory(null)} className="forge-button px-6 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-700">Choose Another Category</button>
        </div>
      </div>
    );
  }

  if (showResult || submitting) {
    const maxPossibleScore = questions.length * 4;
    const finalScore = Math.max(0, score);
    const percentage = (finalScore / maxPossibleScore) * 100;
    const rank = getRank(percentage);

    return (
      <div className="min-h-screen p-8 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="forge-card p-10 max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center mx-auto mb-6">
              <Hammer className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black font-['Outfit'] mb-2">
              {submitting ? 'Cooling the Blade...' : 'Forging Complete'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">Your skills in {selectedCategory} have been tested.</p>
            
            {!submitting && (
              <>
                <div className="mb-8">
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2 block">Rank Earned</span>
                  <div className={`text-4xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r ${rank.color}`}>
                    {resultData?.new_rank || rank.title}
                  </div>
                  {resultData?.xp_earned > 0 && (
                     <div className="mt-2 text-violet-500 font-bold">+{resultData.xp_earned} XP</div>
                  )}
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex justify-between p-4 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Final Score</span>
                    <span className="font-bold text-violet-500">{finalScore} / {maxPossibleScore} pts</span>
                  </div>
                  <div className="flex justify-between p-4 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Correct / Wrong</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200"><span className="text-emerald-500">{correctCount}</span> / <span className="text-red-500">{wrongCount}</span></span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { setSelectedCategory(null); setShowResult(false); setScore(0); setCorrectCount(0); setWrongCount(0); setCurrentIdx(0); }}
                    className="flex-1 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-white font-bold hover:bg-slate-700 transition-colors"
                  >
                    New Assessment
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold hover:from-violet-500 hover:to-violet-600 transition-colors"
                  >
                    Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen p-8 text-slate-900 dark:text-slate-100 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => setSelectedCategory(null)} className="text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
            ← Change Category
          </button>
          <div className="flex items-center gap-4">
            <div className="text-slate-600 dark:text-slate-400 font-bold bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
              Score: <span className={score >= 0 ? 'text-violet-500' : 'text-red-500'}>{score}</span> pts
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-bold font-['Outfit'] tracking-widest uppercase text-sm">
              Strike {currentIdx + 1} of {questions.length}
            </div>
          </div>
        </div>

        <motion.div 
          key={currentIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="forge-card p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">+4 if correct</span>
            <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">-1 if wrong</span>
          </div>

          <h3 className="text-3xl font-black font-['Outfit'] text-slate-900 dark:text-slate-100 mb-10 mt-4 leading-tight">
            {q.question}
          </h3>

          <div className="space-y-4 mb-10">
            {q.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full p-5 rounded-xl text-left border-2 transition-all duration-200 flex justify-between items-center group ${
                  selected === i 
                    ? 'border-violet-500 bg-violet-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' 
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 hover:border-slate-500 hover:bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <span className={`font-medium text-lg ${selected === i ? 'text-violet-500' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:text-slate-200'}`}>{opt}</span>
                {selected === i && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-6 h-6 text-violet-500" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="forge-button px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-violet-900/20"
            >
              {currentIdx === questions.length - 1 ? 'Quench Blade (Finish)' : 'Strike Anvil (Next)'} 
              <Hammer className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Assessment;
