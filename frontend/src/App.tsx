import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ClerkProvider, useAuth, RedirectToSignIn } from '@clerk/react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Careers from './pages/Careers';
import Roadmap from './pages/Roadmap';
import Playground from './pages/Playground';
import Mentor from './pages/Mentor';
import Assessment from './pages/Assessment';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Placement from './pages/Placement';
import Projects from './pages/Projects';
import Community from './pages/Community';
import Opportunities from './pages/Opportunities';
import BattleGround from './pages/BattleGround';
import Leaderboard from './pages/Leaderboard';
import Layout from './components/Layout';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_sample';

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) return null;
  
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  return <Layout />;
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes with Sidebar Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/mentor" element={<Mentor />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/community" element={<Community />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/arena" element={<BattleGround />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
