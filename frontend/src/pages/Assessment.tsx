import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, ArrowRight, Award, Hammer, Flame } from 'lucide-react';
import { useUser } from '@clerk/react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Assessment = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic') || 'Software Engineering';

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/assessments/questions?topic=${encodeURIComponent(topic)}`);
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
  }, [topic]);

  const handleNext = async () => {
    let currentScore = score;
    if (selected === questions[currentIdx].correct) {
      currentScore += 1;
      setScore(currentScore);
    }
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      // Finished, submit to backend
      setSubmitting(true);
      const percentage = Math.round((currentScore / questions.length) * 100);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerk_id: user?.id,
            topic: topic,
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
    if (percentage === 100) return { title: "Grandmaster", color: "from-amber-400 to-amber-600" };
    if (percentage >= 80) return { title: "Master Smith", color: "from-amber-500 to-amber-700" };
    if (percentage >= 60) return { title: "Artisan", color: "from-emerald-400 to-emerald-600" };
    if (percentage >= 40) return { title: "Craftsman", color: "from-zinc-400 to-zinc-600" };
    return { title: "Apprentice", color: "from-orange-700 to-rose-900" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181B] flex flex-col items-center justify-center text-zinc-100">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 animate-pulse"></div>
          <Flame className="w-16 h-16 text-amber-500 mb-6 animate-pulse relative z-10" />
        </div>
        <h2 className="text-3xl font-black font-['Outfit'] mb-2">Stoking the Forge...</h2>
        <p className="text-zinc-400">Heating up the metal for your test.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-8 text-zinc-100 flex items-center justify-center">
        <div className="forge-card p-8 text-center">
           <h2 className="text-2xl font-bold font-['Outfit'] text-red-500 mb-2">Forging Failed</h2>
           <p className="text-zinc-400">Could not generate questions. The fire is too weak today.</p>
        </div>
      </div>
    );
  }

  if (showResult || submitting) {
    const percentage = (score / questions.length) * 100;
    const rank = getRank(percentage);

    return (
      <div className="min-h-screen p-8 text-zinc-100 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="forge-card p-10 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center mx-auto mb-6">
              <Hammer className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black font-['Outfit'] mb-2">
              {submitting ? 'Cooling the Blade...' : 'Forging Complete'}
            </h2>
            <p className="text-zinc-400 mb-8 font-medium">Your skills have been tested in the fires of the forge.</p>
            
            {!submitting && (
              <>
                <div className="mb-8">
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Rank Earned</span>
                  <div className={`text-4xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r ${rank.color}`}>
                    {resultData?.new_rank || rank.title}
                  </div>
                  {resultData?.xp_earned > 0 && (
                     <div className="mt-2 text-amber-500 font-bold">+{resultData.xp_earned} XP</div>
                  )}
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex justify-between p-4 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                    <span className="text-zinc-400 font-medium">Accuracy</span>
                    <span className="font-bold text-amber-500">{Math.round(percentage)}%</span>
                  </div>
                  <div className="flex justify-between p-4 rounded-xl bg-[#27272A] border border-[#3F3F46]">
                    <span className="text-zinc-400 font-medium">Successful Strikes</span>
                    <span className="font-bold text-zinc-200">{score} / {questions.length}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/')}
                  className="forge-button w-full py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen p-8 text-zinc-100 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-500 font-bold bg-amber-500/10 px-5 py-2.5 rounded-full border border-amber-500/20">
            <Flame className="w-5 h-5" /> The Proving Grounds
          </div>
          <div className="text-zinc-400 font-bold font-['Outfit'] tracking-widest uppercase text-sm">
            Strike {currentIdx + 1} of {questions.length}
          </div>
        </div>

        <motion.div 
          key={currentIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="forge-card p-10"
        >
          <h3 className="text-3xl font-black font-['Outfit'] text-zinc-100 mb-10 leading-tight">
            {q.question}
          </h3>

          <div className="space-y-4 mb-10">
            {q.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full p-5 rounded-xl text-left border-2 transition-all duration-200 flex justify-between items-center group ${
                  selected === i 
                    ? 'border-amber-500 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' 
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <span className={`font-medium text-lg ${selected === i ? 'text-amber-500' : 'text-zinc-300 group-hover:text-zinc-200'}`}>{opt}</span>
                {selected === i && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="forge-button px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {currentIdx === questions.length - 1 ? 'Quench Blade' : 'Strike Anvil'} 
              <Hammer className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Assessment;
