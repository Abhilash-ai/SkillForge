import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Plus, MessageSquare, Menu, X } from 'lucide-react';
import { useAuth, useUser } from '@clerk/react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface Session {
  id: number;
  title: string;
  updated_at: string;
}

const Mentor = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`/api/mentor/sessions?clerk_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (data.length > 0 && !activeSessionId) {
          loadSession(data[0].id);
        } else if (data.length === 0) {
          createNewSession();
        }
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const loadSession = async (id: number) => {
    setActiveSessionId(id);
    setMessages([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
    try {
      const res = await fetch(`/api/mentor/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load session", err);
    }
  };

  const createNewSession = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/mentor/sessions?clerk_id=${userId}`, { method: 'POST' });
      if (res.ok) {
        const newSession = await res.json();
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newSession.id);
        setMessages([{ role: 'model', content: "Hello! I am your SkillForge AI Mentor. How can I help you today?" }]);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !activeSessionId || !userId) return;

    const newMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/mentor/sessions/${activeSessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: userId,
          message: newMsg.content
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...updatedMessages, { role: 'model', content: data.reply }]);
        
        // Update session title locally if it was renamed
        if (data.session_title) {
          setSessions(sessions.map(s => s.id === activeSessionId ? { ...s, title: data.session_title } : s));
        }
      } else {
        setMessages([...updatedMessages, { role: 'model', content: 'I encountered an error connecting to the server.' }]);
      }
    } catch (err) {
      setMessages([...updatedMessages, { role: 'model', content: 'Connection failed.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-zinc-50 flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar for Chat History */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-zinc-200 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50 shrink-0">
          <h2 className="font-bold text-zinc-800">Chat History</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 shrink-0">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-hide">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSessionId === s.id 
                  ? 'bg-rose-50 text-rose-600 font-medium' 
                  : 'hover:bg-zinc-100 text-zinc-600'
              }`}
            >
              <MessageSquare className={`w-4 h-4 shrink-0 ${activeSessionId === s.id ? 'text-rose-500' : 'text-zinc-400'}`} />
              <div className="truncate text-sm flex-1">{s.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="w-full bg-white border-b border-zinc-200 px-4 md:px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-800 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-2">
                SkillForge Mentor <Sparkles className="w-4 h-4 text-rose-500 hidden sm:block" />
              </h1>
              <p className="text-xs text-zinc-500 font-medium">Powered by Gemini AI</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-zinc-50/50">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 mt-20">
                <Bot className="w-16 h-16 mb-4 text-zinc-300" />
                <p>Start a conversation with your AI Mentor.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-200 text-zinc-600' : 'bg-rose-100 text-rose-600'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-sm' : 'bg-white border border-zinc-200 shadow-sm text-zinc-700 rounded-tl-sm'}`}>
                  <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>
        </main>

        <div className="p-4 shrink-0 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about coding, career paths, or projects..."
                className="w-full pl-6 pr-16 py-4 rounded-full border border-zinc-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white transition-all text-zinc-800 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || !activeSessionId}
                className="absolute right-2 w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-300 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentor;
