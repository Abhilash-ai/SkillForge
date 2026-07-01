import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { Swords, Code2, Play, CheckCircle2, XCircle, ChevronRight, Trophy, Zap } from 'lucide-react';

interface DSAQuestion {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  starter_code: string;
}

const BattleGround = () => {
  const { userId } = useAuth();
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{passed: boolean, message: string, xp_earned: number, coins_earned: number} | null>(null);

  useEffect(() => {
    fetch('/api/arena/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSelect = (q: DSAQuestion) => {
    setSelectedQuestion(q);
    setCode(q.starter_code);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedQuestion) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/arena/questions/${selectedQuestion.id}/submit?clerk_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ passed: false, message: "Server error occurred", xp_earned: 0, coins_earned: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedQuestion) {
    return (
      <div className="flex flex-col h-full bg-[#18181B]">
        <div className="flex-none p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedQuestion(null)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Arena
            </button>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-amber-500" />
              {selectedQuestion.title}
            </h2>
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              selectedQuestion.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
              selectedQuestion.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {selectedQuestion.difficulty}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
              Submit Solution
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Problem Description */}
          <div className="w-1/3 border-r border-zinc-800 bg-zinc-900/30 p-6 overflow-y-auto prose prose-invert prose-amber max-w-none">
            <div dangerouslySetInnerHTML={{ __html: selectedQuestion.description.replace(/\n/g, '<br/>') }} />
            
            {result && (
              <div className={`mt-8 p-6 rounded-xl border ${result.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  {result.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {result.passed ? 'Accepted!' : 'Wrong Answer'}
                </h3>
                <p className="opacity-90">{result.message}</p>
                {result.passed && (
                  <div className="mt-4 flex gap-4 border-t border-emerald-500/20 pt-4">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                      <Zap className="w-4 h-4" /> +{result.xp_earned} XP
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-amber-500">
                      <Trophy className="w-4 h-4" /> +{result.coins_earned} Coins
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Editor (Simple Textarea for MVP) */}
          <div className="flex-1 flex flex-col bg-[#1E1E1E]">
            <div className="flex-none px-4 py-2 bg-[#2D2D2D] border-b border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> solution.py
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent text-zinc-300 font-mono p-4 focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
          <Swords className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1 flex items-center gap-2">
            The Battle Ground
            <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded font-bold uppercase tracking-wider">Beta</span>
          </h1>
          <p className="text-zinc-400">Practice LeetCode-style questions, defeat the test cases, and climb the Leaderboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map(q => (
          <div 
            key={q.id}
            onClick={() => handleSelect(q)}
            className="group p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-amber-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code2 className="w-24 h-24 text-amber-500 transform rotate-12 translate-x-4 -translate-y-4" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {q.title}
              </h3>
              
              <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                {q.description}
              </p>
              
              <div className="flex items-center text-amber-500 font-medium text-sm gap-1 group-hover:translate-x-1 transition-transform">
                Start Challenge <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="col-span-full p-12 text-center text-zinc-500 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
            No challenges available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleGround;
