import React from 'react';
import { ShieldAlert, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUser } from '@clerk/react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, isLoaded } = useUser();

  // Very basic mock check for demo purposes. 
  // In a real app, use Clerk metadata or backend validation for admin roles.
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.primaryEmailAddress?.emailAddress?.includes('admin');

  // Commented out strict check to allow viewing for demo without strict admin config
  /*
  if (isLoaded && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  */

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Admin Dashboard</h1>
              <p className="text-zinc-400">Platform Analytics & Moderation</p>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Total Users</h4>
              <p className="text-2xl font-black">12,458</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Active Sessions</h4>
              <p className="text-2xl font-black">1,245</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Reported Posts</h4>
              <p className="text-2xl font-black">23</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-bold">Recent User Signups</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-zinc-800/50 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">User ID</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role Target</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 pl-6 font-mono text-sm text-zinc-300">usr_mock_{i}9x8z</td>
                    <td className="p-4 font-medium">user{i}@example.com</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-xs font-bold">
                        Software Engineer
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">{i} hr ago</td>
                    <td className="p-4 pr-6 text-right">
                      <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm font-medium transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
