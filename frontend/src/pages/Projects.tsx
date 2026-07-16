import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Star, Code, ExternalLink, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    title: "E-Commerce Microservices",
    level: "Advanced",
    duration: "4 Weeks",
    tech: ["Node.js", "Docker", "RabbitMQ", "Redis"],
    description: "Build a scalable e-commerce backend using microservices architecture. You'll learn containerization, message queues, and distributed databases.",
    color: "from-fuchsia-500 to-violet-500",
    defaultCode: "const express = require('express');\nconst app = express();\n\napp.get('/api/products', (req, res) => {\n  res.json({ products: [] });\n});\n\napp.listen(3000);"
  },
  {
    title: "AI Resume ATS",
    level: "Intermediate",
    duration: "2 Weeks",
    tech: ["Python", "FastAPI", "Gemini API", "React"],
    description: "An AI-powered ATS system that parses resumes and gives improvement suggestions. Great for learning LLM integration and parsing algorithms.",
    color: "from-cyan-500 to-pink-500",
    defaultCode: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post('/analyze')\ndef analyze_resume(text: str):\n    return {'score': 85, 'feedback': 'Great resume!'}"
  },
  {
    title: "Real-time Chat App",
    level: "Beginner",
    duration: "1 Week",
    tech: ["React", "Socket.io", "Express"],
    description: "A simple real-time chat application with distinct rooms and active user lists. Perfect for grasping WebSockets and event-driven programming.",
    color: "from-emerald-500 to-emerald-500",
    defaultCode: "import { io } from 'socket.io-client';\n\nconst socket = io('http://localhost:3000');\n\nsocket.on('connect', () => {\n  console.log('Connected to chat server!');\n});"
  }
];

const Projects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleOpenPlayground = (project: any) => {
    // In a real app, we might pass project ID to load specific starter code
    navigate('/playground');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-3">
              <FolderGit2 className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-600" /> Project Recommendations
            </h1>
            <p className="text-slate-600 text-sm md:text-lg">Curated projects based on your skills and career goals.</p>
          </div>
          <button className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors w-full md:w-auto justify-center">
            <Star className="w-5 h-5 text-violet-500" /> Saved Projects
          </button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col"
            >
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${proj.color} mb-6`} />
              
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 leading-tight">{proj.title}</h2>
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md shrink-0 ${
                  proj.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                  proj.level === 'Intermediate' ? 'bg-violet-100 text-violet-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {proj.level}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{proj.description}</p>
              
              <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm font-medium">
                <Clock className="w-4 h-4" /> {proj.duration}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tech.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => setSelectedProject(proj)}
                  className="flex-1 py-3 bg-white dark:bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-100 dark:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
                <button 
                  onClick={() => handleOpenPlayground(proj)}
                  className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                  title="Open in Playground"
                >
                  <Code className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className={`h-3 w-full bg-gradient-to-r ${selectedProject.color}`} />
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{selectedProject.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                        selectedProject.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                        selectedProject.level === 'Intermediate' ? 'bg-violet-100 text-violet-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedProject.level}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4" /> {selectedProject.duration}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2">Project Overview</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                <h3 className="text-lg font-bold text-slate-800 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tech.map((t: string) => (
                    <span key={t} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => {
                      setSelectedProject(null);
                      handleOpenPlayground(selectedProject);
                    }}
                    className="flex-1 py-4 bg-fuchsia-600 text-white rounded-xl font-bold hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-fuchsia-600/20"
                  >
                    <Code className="w-6 h-6" /> Start Coding Now
                  </button>
                  <button className="py-4 px-6 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" /> Save for Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
