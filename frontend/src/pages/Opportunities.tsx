import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Globe, Code, Calendar, Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react';

const opportunitiesList = [
  {
    id: 1,
    title: "Google Summer of Code 2026",
    org: "Google",
    type: "Open Source",
    deadline: "April 15, 2026",
    tags: ["Remote", "Stipend", "Mentorship"],
    color: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    id: 2,
    title: "Software Engineering Intern",
    org: "Microsoft",
    type: "Internship",
    deadline: "Rolling",
    tags: ["On-site", "Seattle", "Summer"],
    color: "bg-teal-50 text-teal-700 border-teal-200"
  },
  {
    id: 3,
    title: "Global AI Hackathon",
    org: "OpenAI x Scale",
    type: "Hackathon",
    deadline: "Next Weekend",
    tags: ["Remote", "$50k Prize Pool"],
    color: "bg-rose-50 text-rose-700 border-rose-200"
  }
];

const Opportunities = () => {
  const [saved, setSaved] = useState<number[]>([]);
  const [appliedTo, setAppliedTo] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<any>(null);

  const toggleSave = (id: number) => {
    if (saved.includes(id)) {
      setSaved(saved.filter(s => s !== id));
    } else {
      setSaved([...saved, id]);
    }
  };

  const handleApply = (opp: any) => {
    setAppliedTo([...appliedTo, opp.id]);
    setShowSuccessModal(opp);
    setTimeout(() => {
      setShowSuccessModal(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-teal-600" /> Opportunities Hub
          </h1>
          <p className="text-zinc-600 text-sm md:text-lg">Find internships, hackathons, open-source programs, and more.</p>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
          <button className="px-6 py-2 rounded-full bg-zinc-900 text-white font-bold whitespace-nowrap shrink-0">All Opportunities</button>
          <button className="px-6 py-2 rounded-full bg-white border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 whitespace-nowrap shrink-0">Internships</button>
          <button className="px-6 py-2 rounded-full bg-white border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 whitespace-nowrap shrink-0">Hackathons</button>
          <button className="px-6 py-2 rounded-full bg-white border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 whitespace-nowrap shrink-0">Open Source</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunitiesList.map((opp, idx) => (
            <motion.div 
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 flex flex-col relative"
            >
              <button 
                onClick={() => toggleSave(opp.id)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-teal-500 transition-colors"
              >
                {saved.includes(opp.id) ? <BookmarkCheck className="w-6 h-6 text-teal-500 fill-current" /> : <Bookmark className="w-6 h-6" />}
              </button>
              
              <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase w-max border mb-4 ${opp.color}`}>
                {opp.type}
              </div>

              <h2 className="text-xl font-bold text-zinc-900 mb-1 pr-8 leading-tight">{opp.title}</h2>
              <p className="text-zinc-500 font-medium mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4 shrink-0" /> {opp.org}
              </p>

              <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium mb-6">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" /> Deadline: <span className="text-zinc-800">{opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {opp.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg border border-zinc-200">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                {appliedTo.includes(opp.id) ? (
                  <div className="w-full py-3 bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Applied Successfully
                  </div>
                ) : (
                  <button 
                    onClick={() => handleApply(opp)}
                    className="w-full py-3 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl font-bold hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-4 z-50 w-[90%] md:w-auto"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Application Sent</h4>
              <p className="text-zinc-400 text-sm">Successfully applied for {showSuccessModal.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Opportunities;
