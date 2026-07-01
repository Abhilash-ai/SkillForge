import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { Settings as SettingsIcon, Save, User, Laptop, Cloud, Database, Shield, Layout, Palette, Code, Terminal, Brain, Cpu, Smartphone } from 'lucide-react';
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

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); // Using same list for topics for simplicity
  const [profileIcon, setProfileIcon] = useState('User');

  useEffect(() => {
    // Fetch current profile
    if (!userId) return;
    fetch(`/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_id: userId,
        email: user?.primaryEmailAddress?.emailAddress,
        first_name: user?.firstName,
        last_name: user?.lastName,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          try {
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
          interests: selectedInterests,
          topics: selectedTopics,
          profile_icon: profileIcon
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
          <SettingsIcon className="w-8 h-8 text-zinc-300" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Profile Settings</h1>
          <p className="text-zinc-400">Customize your SkillForge identity and preferences.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Icon Selection */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Choose Profile Icon</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {ICONS.map((icn) => {
              const isSelected = profileIcon === icn.name;
              return (
                <button
                  key={icn.name}
                  onClick={() => setProfileIcon(icn.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500' 
                      : 'border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <icn.icon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">{icn.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Interests Selection */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">Your Interests</h2>
          <p className="text-zinc-400 text-sm mb-4">Select the areas of tech you are passionate about.</p>
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
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        {/* Topics for Study */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">Preferred Topics to Learn</h2>
          <p className="text-zinc-400 text-sm mb-4">What topics are you actively trying to study?</p>
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
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end pt-4">
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
            Save Preferences
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
