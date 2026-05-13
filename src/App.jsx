import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PetLibrary from './components/PetLibrary';
import VetCoach from './components/VetCoach';
import MarketNews from './components/MarketNews';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import './index.css';

const VIEWS = {
  dashboard: Dashboard,
  pets: PetLibrary,
  vetcoach: VetCoach,
  market: MarketNews,
  settings: Settings,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const ActiveView = VIEWS[activeTab] || Dashboard;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {!isAuthenticated ? (
        <LandingPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main content */}
          <main className="flex-1 min-w-0 pt-16 lg:pt-0 z-10 animate-fade-in">
            <div className="h-full min-h-screen p-5 lg:p-8 max-w-7xl mx-auto">
              <ActiveView onTabChange={setActiveTab} />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
