import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Plus, Search, Hash, X, Send } from 'lucide-react';
import { useAuth, useUser } from '@clerk/react';

interface Reply {
  id: number;
  content: string;
  created_at: string;
  user: {
    clerk_id: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  created_at: string;
  user: {
    clerk_id: string;
    rank?: string;
  };
  replies: Reply[];
}

const Community = () => {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const [activePost, setActivePost] = useState<Post | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/community/posts?category=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !userId) return;
    
    try {
      const response = await fetch(`/api/community/posts?clerk_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: activeTab,
          tags: newTags
        })
      });
      if (response.ok) {
        setShowNewPost(false);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReply = async () => {
    if (!replyContent.trim() || !userId || !activePost) return;

    try {
      const response = await fetch(`/api/community/posts/${activePost.id}/replies?clerk_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      });
      if (response.ok) {
        const newReply = await response.json();
        setActivePost({
          ...activePost,
          replies: [...activePost.replies, newReply]
        });
        setReplyContent('');
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-600" /> Community Hub
            </h1>
            <p className="text-zinc-600 text-base md:text-lg">Connect, collaborate, and grow with peers and mentors.</p>
          </div>
          <button 
            onClick={() => setShowNewPost(true)}
            className="px-6 py-3 bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Post
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 md:sticky md:top-8">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-zinc-600 dark:text-zinc-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('discussions')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'discussions' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  General Discussions
                </button>
                <button 
                  onClick={() => setActiveTab('teams')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'teams' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  Find Teammates
                </button>
                <button 
                  onClick={() => setActiveTab('study')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'study' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-zinc-600 hover:bg-zinc-100'}`}
                >
                  Study Groups
                </button>
              </div>

              <div className="mt-8 hidden md:block">
                <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['#react', '#dsa', '#interview', '#python', '#hackathon'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium cursor-pointer hover:bg-zinc-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-zinc-500 font-medium animate-pulse">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 bg-white rounded-3xl border border-zinc-200">
                <p className="font-medium text-lg">No posts yet!</p>
                <p className="text-sm">Be the first to start a conversation.</p>
              </div>
            ) : (
              posts.map((post, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={post.id} 
                  onClick={() => setActivePost(post)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                        {post.user?.clerk_id?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm">User {post.user?.clerk_id?.substring(0, 5) || 'Anonymous'}</h4>
                        <p className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-fuchsia-50 text-fuchsia-700 rounded-full text-xs font-bold capitalize">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">{post.title}</h3>
                  <p className="text-zinc-600 mb-4 line-clamp-2 whitespace-pre-wrap">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-fuchsia-600">
                      <MessageSquare className="w-4 h-4" /> {post.replies?.length || 0} Replies
                    </div>
                    {post.tags && (
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-4 h-4" /> {post.tags}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <h2 className="text-xl font-bold text-zinc-900">Create New Post</h2>
                <button onClick={() => setShowNewPost(false)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Title</label>
                  <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-fuchsia-500 outline-none" placeholder="What's on your mind?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Content</label>
                  <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none" placeholder="Add more details..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Tags (optional)</label>
                  <input type="text" value={newTags} onChange={e => setNewTags(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-fuchsia-500 outline-none" placeholder="e.g. react, interview" />
                </div>
              </div>
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
                <button onClick={handleCreatePost} className="px-8 py-3 bg-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-700 transition-colors">
                  Post to Community
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Post Detail & Replies Modal */}
        {activePost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-start bg-zinc-50 rounded-t-3xl shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">{activePost.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span className="font-medium text-zinc-700">User {activePost.user?.clerk_id?.substring(0,5)}</span>
                    <span>•</span>
                    <span>{new Date(activePost.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setActivePost(null)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 bg-white p-2 rounded-full shadow-sm border border-zinc-200"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-hide">
                <div className="text-zinc-800 whitespace-pre-wrap leading-relaxed mb-10 text-lg">
                  {activePost.content}
                </div>

                <div className="border-t border-zinc-100 pt-8">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-fuchsia-600" /> 
                    Replies ({activePost.replies?.length || 0})
                  </h3>
                  
                  <div className="space-y-6">
                    {activePost.replies?.map(reply => (
                      <div key={reply.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold shrink-0 border border-zinc-200">
                          {reply.user?.clerk_id?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 bg-zinc-50 p-4 rounded-2xl rounded-tl-none border border-zinc-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-zinc-900">User {reply.user?.clerk_id?.substring(0,5)}</span>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-700 whitespace-pre-wrap text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 bg-white rounded-b-3xl shrink-0">
                <div className="flex items-end gap-3 relative">
                  <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 min-h-[60px] max-h-[150px] p-4 pr-16 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 resize-y"
                  />
                  <button 
                    onClick={handleCreateReply}
                    disabled={!replyContent.trim()}
                    className="absolute right-3 bottom-3 p-2 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
