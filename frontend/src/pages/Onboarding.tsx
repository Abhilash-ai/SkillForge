import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { motion } from 'framer-motion';

const Onboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('College Student');
  const [career, setCareer] = useState('Software Engineer');
  const [time, setTime] = useState('1-2 hours / day');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!user) return;
      setIsSubmitting(true);
      try {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerk_id: user.id,
            education_level: education,
            dream_career: career,
            time_commitment: time
          })
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-300 dark:border-zinc-700 shadow-2xl"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Completed</span>
          </div>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-500 to-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-2">Welcome to SkillForge, {user?.firstName}!</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Let's personalize your experience. What is your current education level?</p>
            
            <div className="space-y-3">
              {['High School', 'College Student', 'Fresh Graduate', 'Self Learner'].map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setEducation(opt)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${education === opt ? 'bg-zinc-700 border-rose-500' : 'border-zinc-600 bg-zinc-700/50 hover:bg-zinc-700 hover:border-rose-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-2">What is your dream career?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">This helps us build your personalized roadmap.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {['Software Engineer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'Cybersecurity', 'Cloud Engineer'].map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setCareer(opt)}
                  className={`w-full p-4 rounded-xl border transition-all text-left text-sm ${career === opt ? 'bg-zinc-700 border-orange-500' : 'border-zinc-600 bg-zinc-700/50 hover:bg-zinc-700 hover:border-orange-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-2">How much time can you commit?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">We'll schedule your weekly milestones accordingly.</p>
            
            <div className="space-y-3">
              {['1-2 hours / day', '3-4 hours / day', '5+ hours / day', 'Weekends only'].map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setTime(opt)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${time === opt ? 'bg-zinc-700 border-amber-500' : 'border-zinc-600 bg-zinc-700/50 hover:bg-zinc-700 hover:border-amber-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : step === 3 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
