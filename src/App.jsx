import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import CalculatorPage from './components/CalculatorPage';
import PetLibrary from './components/PetLibrary';
import VetCoach from './components/VetCoach';
import MarketNews from './components/MarketNews';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import HistoryView from './components/HistoryView';
import { hydrateLocalStoreFromRemote } from './lib/storage';
import { supabase } from './lib/supabaseClient';
import './index.css';

const VIEWS = {
  dashboard: Dashboard,
  records: Records,
  calculator: CalculatorPage,
  pets: PetLibrary,
  history: HistoryView,
  vetcoach: VetCoach,
  market: MarketNews,
  settings: Settings,
};


export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const ActiveView = VIEWS[activeTab] || Dashboard;

  useEffect(() => {
    // Check current session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (session) {
      hydrateLocalStoreFromRemote();
    }
  }, [session]);

  return (
    <div className="min-h-screen flex bg-[#eef7ef]">
      {!session ? (
        <LandingPage />
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main content */}
          <main className="flex-1 min-w-0 pt-16 lg:pt-0 z-10 animate-fade-in bg-[linear-gradient(180deg,#eef7ef_0%,#f8fbf6_42%,#edf6fb_100%)]">
            <div className="h-full min-h-screen max-w-7xl mx-auto px-3 pb-5 pt-4 sm:p-5 lg:p-8">
              <ActiveView onTabChange={setActiveTab} />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
