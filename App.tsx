
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon,
  Bell
} from 'lucide-react';
import { AppState, PioneerType, UserProfile, ServiceEntry, BibleStudy, DayPlan } from './types';
import { DEFAULT_PROFILE, INITIAL_WEEKLY_PLANS } from './constants';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import WeeklyPlanner from './components/WeeklyPlanner';
import Stopwatch from './components/Stopwatch';
import BibleStudies from './components/BibleStudies';
import Reports from './components/Reports';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pioneiro_fiel_state');
    if (saved) return JSON.parse(saved);
    return {
      profile: DEFAULT_PROFILE,
      serviceEntries: [],
      bibleStudies: [],
      weeklyPlans: INITIAL_WEEKLY_PLANS
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pioneiro_fiel_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    localStorage.setItem('pioneiro_fiel_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pioneiro_fiel_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Reminder Engine
  const checkReminders = useCallback(() => {
    if (!state.profile.remindersEnabled || !("Notification" in window) || Notification.permission !== "granted") return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Only remind at 19:00
    if (now.getHours() !== 19) return;
    if (state.profile.lastReminderSent === todayStr) return;

    // Check if tomorrow is a preaching day
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowDay = tomorrow.getDay();
    
    const isTomorrowPreaching = state.weeklyPlans.find(p => p.day === tomorrowDay)?.active;

    if (isTomorrowPreaching) {
      // Calculate current monthly progress
      const monthStr = now.toISOString().substring(0, 7);
      const monthlyMins = state.serviceEntries
        .filter(e => e.date.startsWith(monthStr))
        .reduce((acc, curr) => acc + curr.minutes, 0);
      const monthlyHrs = Math.floor(monthlyMins / 60);
      const goal = state.profile.goals.monthly;

      new Notification("Lembrete de Pregação", {
        body: `Amanhã é dia de serviço de campo! 📢\nProgresso da Meta: ${monthlyHrs}h de ${goal}h concluídas.`,
        icon: "/favicon.ico"
      });

      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, lastReminderSent: todayStr }
      }));
    }
  }, [state.profile.remindersEnabled, state.profile.lastReminderSent, state.weeklyPlans, state.serviceEntries, state.profile.goals.monthly]);

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkReminders]);

  const updateProfile = (profile: UserProfile) => setState(prev => ({ ...prev, profile }));
  const addServiceEntry = (entry: ServiceEntry) => setState(prev => ({ ...prev, serviceEntries: [entry, ...prev.serviceEntries] }));
  const deleteServiceEntry = (id: string) => setState(prev => ({ ...prev, serviceEntries: prev.serviceEntries.filter(e => e.id !== id) }));
  const updateWeeklyPlans = (plans: DayPlan[]) => setState(prev => ({ ...prev, weeklyPlans: plans }));
  const setBibleStudies = (studies: BibleStudy[]) => setState(prev => ({ ...prev, bibleStudies: studies }));

  if (!state.profile.onboarded) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
          <Onboarding onComplete={(p) => updateProfile({ ...p, onboarded: true })} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard state={state} onAddEntry={addServiceEntry} onDeleteEntry={deleteServiceEntry} />;
      case 'planner': return <WeeklyPlanner state={state} onUpdatePlans={updateWeeklyPlans} />;
      case 'stopwatch': return <Stopwatch onAddEntry={addServiceEntry} />;
      case 'studies': return <BibleStudies studies={state.bibleStudies} onUpdate={setBibleStudies} />;
      case 'reports': return <Reports state={state} />;
      case 'settings': return <Settings profile={state.profile} onUpdate={updateProfile} toggleTheme={() => setDarkMode(!darkMode)} isDark={darkMode} />;
      default: return <Dashboard state={state} onAddEntry={addServiceEntry} onDeleteEntry={deleteServiceEntry} />;
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <main className="max-w-4xl mx-auto px-4 pt-6">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe z-50">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16 px-2">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label="Início" />
          <NavButton active={activeTab === 'planner'} onClick={() => setActiveTab('planner')} icon={<Calendar size={20} />} label="Plano" />
          <NavButton active={activeTab === 'stopwatch'} onClick={() => setActiveTab('stopwatch')} icon={<Clock size={20} />} label="Timer" />
          <NavButton active={activeTab === 'studies'} onClick={() => setActiveTab('studies')} icon={<BookOpen size={20} />} label="Estudos" />
          <NavButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={20} />} label="Relatos" />
          <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={20} />} label="Configs" />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-all ${
      active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
    }`}
  >
    <div className={`p-1 rounded-lg ${active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
