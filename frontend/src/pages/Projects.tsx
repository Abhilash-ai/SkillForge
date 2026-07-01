import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Star, Code, ExternalLink, Clock } from 'lucide-react';

const projects = [
  {
    title: "E-Commerce Microservices",
    level: "Advanced",
    duration: "4 Weeks",
    tech: ["Node.js", "Docker", "RabbitMQ", "Redis"],
    description: "Build a scalable e-commerce backend using microservices architecture.",
    color: "from-orange-500 to-amber-500"
  },
  {
    title: "AI Resume ATS",
    level: "Intermediate",
    duration: "2 Weeks",
    tech: ["Python", "FastAPI", "Gemini API", "React"],
    description: "An AI-powered ATS system that parses resumes and gives improvement suggestions.",
    color: "from-rose-500 to-pink-500"
  },
  {
    title: "Real-time Chat App",
    level: "Beginner",
    duration: "1 Week",
    tech: ["React", "Socket.io", "Express"],
    description: "A simple real-time chat application with distinct rooms and active user lists.",
    color: "from-lime-500 to-teal-500"
  }
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
              <FolderGit2 className="w-10 h-10 text-orange-600" /> Project Recommendations
            </h1>
            <p className="text-zinc-600 text-lg">Curated projects based on your skills and career goals.</p>
          </div>
          <button className="px-6 py-2 bg-white border border-zinc-200 shadow-sm rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-50 transition-colors">
            <Star className="w-5 h-5 text-amber-500" /> Saved Projects
          </button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 flex flex-col"
            >
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${proj.color} mb-6`} />
              
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-800 leading-tight">{proj.title}</h2>
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                  proj.level === 'Beginner' ? 'bg-lime-100 text-lime-700' :
                  proj.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {proj.level}
                </span>
              </div>
              
              <p className="text-zinc-600 text-sm mb-6 flex-1">{proj.description}</p>
              
              <div className="flex items-center gap-2 mb-6 text-zinc-500 text-sm font-medium">
                <Clock className="w-4 h-4" /> {proj.duration}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tech.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
                <button className="p-3 bg-zinc-100 text-zinc-700 rounded-xl hover:bg-zinc-200 transition-colors">
                  <Code className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
