import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { Settings as SettingsIcon, Save, User, Laptop, Cloud, Database, Shield, Layout, Palette, Code, Terminal, Brain, Cpu, Smartphone, Sun, Moon, Link, FileText, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_INTERESTS = [
  "Frontend", "Backend", "Full Stack", "DevOps", "Cloud Computing",
  "Data Science", "Machine Learning", "AI", "Mobile App Dev",
  "Cybersecurity", "UI/UX Design", "Game Development", "Blockchain",
  "Databases", "System Design", "Algorithms"
];

const ICONS = [
  { name: 'User', icon: User },
  { name: 'Laptop', icon: Laptop },
  { name: 'Cloud', icon: Cloud },
  { name: 'Database', icon: Database },
  { name: 'Shield', icon: Shield },
  { name: 'Layout', icon: Layout },
  { name: 'Palette', icon: Palette },
  { name: 'Code', icon: Code },
  { name: 'Terminal', icon: Terminal },
  { name: 'Brain', icon: Brain },
  { name: 'Cpu', icon: Cpu },
  { name: 'Smartphone', icon: Smartphone },
];

const Settings = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'learning' | 'appearance'>('profile');

  // Profile Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileIcon, setProfileIcon] = useState('User');

  // Learning Data
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Appearance
  const [theme, setTheme] = useState(localStorage.getItem('skillforge-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('skillforge-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_id: userId,
        email: user?.primaryEmailAddress?.emailAddress,
        first_name: user?.firstName || '',
        last_name: user?.lastName || '',
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          try {
            if (data.user.first_name) setFirstName(data.user.first_name);
            if (data.user.last_name) setLastName(data.user.last_name);
            if (data.user.bio) setBio(data.user.bio);
            if (data.user.github_url) setGithubUrl(data.user.github_url);
            if (data.user.linkedin_url) setLinkedinUrl(data.user.linkedin_url);

            if (data.user.interests) setSelectedInterests(JSON.parse(data.user.interests));
            if (data.user.topics) setSelectedTopics(JSON.parse(data.user.topics));
            if (data.user.profile_icon) setProfileIcon(data.user.profile_icon);
          } catch (e) {
            console.error("Error parsing user profile data", e);
          }
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [userId, user]);

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          interests: selectedInterests,
          topics: selectedTopics,
          profile_icon: profileIcon
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg shadow-rose-500/20">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-['Outfit'] tracking-tight">Settings & Profile</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your identity, preferences, and aesthetics.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'profile' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <UserCircle className="w-4 h-4" /> Profile Info
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'learning' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Brain className="w-4 h-4" /> Learning Preferences
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'appearance' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Palette className="w-4 h-4" /> Appearance
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                    placeholder="Tell us a little about yourself and your goals..."
                  />
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Social Links</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input 
                      type="text" 
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input 
                      type="text" 
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Profile Icon</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Choose an avatar that represents your identity in the forge.</p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {ICONS.map(icn => {
                    const isSelected = profileIcon === icn.name;
                    return (
                      <button
                        key={icn.name}
                        onClick={() => setProfileIcon(icn.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-rose-500 bg-rose-500/10 text-rose-500' 
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800/50'
                        }`}
                      >
                        <icn.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">{icn.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* LEARNING TAB */}
          {activeTab === 'learning' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Your Tech Interests</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Select the broad areas of technology you are passionate about.</p>
                <div className="flex flex-wrap gap-3">
                  {ALL_INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          isSelected 
                            ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Active Study Topics</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">What specific domains are you currently trying to master?</p>
                <div className="flex flex-wrap gap-3">
                  {ALL_INTERESTS.map(topic => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleSelection(topic, selectedTopics, setSelectedTopics)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          isSelected 
                            ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Interface Theme</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">Customize the look and feel of your Forge Room.</p>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setTheme('light');
                      localStorage.setItem('skillforge-theme', 'light');
                      document.documentElement.classList.remove('dark');
                    }}
                    className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                      theme === 'light' 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    <Sun className="w-8 h-8" />
                    <span className="font-bold">Light Mode</span>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      localStorage.setItem('skillforge-theme', 'dark');
                      document.documentElement.classList.add('dark');
                    }}
                    className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                      theme === 'dark' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-800'
                    }`}
                  >
                    <Moon className="w-8 h-8" />
                    <span className="font-bold">Dark Mode</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </div>

        {/* Global Save Action */}
        <div className="flex justify-end pt-4 pb-12">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save All Preferences
          </button>
        </div>
        
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Settings;
