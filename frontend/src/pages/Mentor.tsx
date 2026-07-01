import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const Mentor = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Hello ${user?.firstName || 'there'}! I am your SkillForge AI Mentor. How can I help you with your career or coding journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMsg.content,
          history: updatedMessages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'model', content: data.reply || 'I encountered an error.' }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'model', content: 'Connection failed.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-zinc-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-zinc-200 px-8 py-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              SkillForge Mentor <Sparkles className="w-4 h-4 text-rose-500" />
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Powered by Gemini AI</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
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
            <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-sm' : 'bg-white border border-zinc-200 shadow-sm text-zinc-700 rounded-tl-sm'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
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
      </main>

      <div className="w-full max-w-3xl p-4 bg-transparent pb-8">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about coding, career paths, or projects..."
            className="w-full pl-6 pr-16 py-4 rounded-full border border-zinc-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white/80 backdrop-blur-md transition-all text-zinc-800 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-300 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Mentor;
