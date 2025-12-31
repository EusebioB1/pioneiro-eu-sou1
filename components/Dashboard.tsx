
import React, { useEffect, useState, useMemo } from 'react';
import { AppState, ServiceEntry } from '../types';
import { Plus, Clock, Target, Calendar, Quote, Send, Zap, User as UserIcon, Trash2 } from 'lucide-react';
import { getMotivationalThought } from '../geminiService';
import { MOTIVATIONAL_MESSAGES } from '../constants';

interface DashboardProps {
  state: AppState;
  onAddEntry: (entry: ServiceEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onAddEntry, onDeleteEntry }) => {
  const [greeting, setGreeting] = useState('');
  const [motivation, setMotivation] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualNote, setManualNote] = useState('');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const stats = useMemo(() => {
    const entries = state.serviceEntries;
    
    // Weekly
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0,0,0,0);

    const weeklyMinutes = entries
      .filter(e => new Date(e.date) >= startOfWeek)
      .reduce((acc, curr) => acc + curr.minutes, 0);

    // Monthly
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyMinutes = entries
      .filter(e => e.date.startsWith(now.toISOString().substring(0, 7)))
      .reduce((acc, curr) => acc + curr.minutes, 0);

    // Annual
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const annualMinutes = entries
      .filter(e => new Date(e.date) >= startOfYear)
      .reduce((acc, curr) => acc + curr.minutes, 0);

    return {
      weekly: Math.floor(weeklyMinutes / 60),
      monthly: Math.floor(monthlyMinutes / 60),
      annual: Math.floor(annualMinutes / 60)
    };
  }, [state.serviceEntries]);

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Bom dia');
    else if (hrs < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const fetchMotivation = async () => {
      const msg = await getMotivationalThought(state.profile.name, state.profile.type);
      setMotivation(msg);
    };
    
    setMotivation(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]);
    fetchMotivation();
  }, [state.profile.name, state.profile.type]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseFloat(manualHours) * 60;
    if (isNaN(mins) || mins <= 0) return;

    onAddEntry({
      id: Date.now().toString(),
      date: todayStr,
      minutes: mins,
      note: manualNote
    });
    setManualHours('');
    setManualNote('');
    setShowManualAdd(false);
  };

  const handleDelete = (id: string, hours: number) => {
    if (window.confirm(`Tens a certeza que queres eliminar este registo de ${hours}h?`)) {
      onDeleteEntry(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-2xl mx-auto scanline relative pb-6">
      {/* App Logo/Name Banner */}
      <div className="flex justify-center -mt-2">
        <div className="px-6 py-1 bg-blue-600/10 dark:bg-blue-400/10 border-x border-b border-blue-500/30 rounded-b-2xl">
          <span className="font-futuristic text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-[0.6em] uppercase neon-text">
            Pioneiro Eu Sou
          </span>
        </div>
      </div>

      {/* Header with Photo */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/20 group">
            <div className="w-full h-full rounded-[0.85rem] bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center">
              {state.profile.photo ? (
                <img src={state.profile.photo} alt="User" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <UserIcon size={24} className="text-slate-300 dark:text-slate-700" />
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black dark:text-white tracking-tight leading-none font-futuristic">{greeting},</h1>
            <p className="text-lg font-bold text-slate-500 dark:text-slate-400">{state.profile.name}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowManualAdd(!showManualAdd)}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
          <Plus size={28} className={`transition-transform duration-500 z-10 ${showManualAdd ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Manual Entry Form */}
      {showManualAdd && (
        <form onSubmit={handleManualSubmit} className="glass p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300 z-10 relative">
          <h3 className="text-xl font-black dark:text-white font-futuristic tracking-tight">Registo Manual</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horas</label>
              <input 
                required
                type="number" 
                step="0.1"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                placeholder="0.0"
                className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-lg transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
              <input 
                type="date" 
                defaultValue={todayStr}
                className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none font-bold"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas da Missão</label>
            <input 
              type="text" 
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="Ex: Território comercial..."
              className="w-full px-5 py-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl dark:text-white outline-none"
            />
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-[0.98] font-futuristic tracking-widest">
            CONFIRMAR
          </button>
        </form>
      )}

      {/* Motivational Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-700 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="text-amber-400 fill-amber-400 animate-pulse" size={16} />
              <h3 className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] font-futuristic">Diretriz</h3>
            </div>
            <div className="w-8 h-[2px] bg-white/20 rounded-full"></div>
          </div>
          <p className="text-xl font-bold leading-tight tracking-tight italic">
            "{motivation}"
          </p>
          <div className="flex items-center space-x-4">
             <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-amber-400 rounded-full"></div>
             </div>
             <Quote size={20} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] font-futuristic neon-text">Monitorização</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ProgressCard 
            title="Semana" 
            current={stats.weekly} 
            goal={state.profile.goals.weekly} 
            icon={<Calendar className="text-blue-500" size={18} />}
            color="bg-blue-500"
          />
          <ProgressCard 
            title="Mês" 
            current={stats.monthly} 
            goal={state.profile.goals.monthly} 
            icon={<Target className="text-emerald-500" size={18} />}
            color="bg-emerald-500"
          />
          <ProgressCard 
            title="Ano" 
            current={stats.annual} 
            goal={state.profile.goals.annual} 
            icon={<Clock className="text-amber-500" size={18} />}
            color="bg-amber-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black dark:text-white tracking-tight font-futuristic">Logs Recentes</h3>
           <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Ativos</span>
           </div>
        </div>
        {state.serviceEntries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto opacity-50 shadow-inner">
              <Send size={28} className="text-blue-500" />
            </div>
            <p className="font-bold text-sm tracking-wide">NENHUMA TRANSMISSÃO DETETADA</p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.serviceEntries.slice(0, 5).map((entry, idx) => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-5 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-blue-500/20 rounded-2xl transition-all group active:scale-[0.99] shadow-sm"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-gradient-to-tr from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 font-futuristic text-lg group-hover:neon-text transition-all">
                    {Math.floor(entry.minutes / 60)}h
                  </div>
                  <div>
                    <div className="font-black dark:text-white tracking-tight">
                      {Math.floor(entry.minutes / 60)}h {entry.minutes % 60}min
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                      {new Date(entry.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {entry.note && (
                    <div className="hidden sm:block text-[10px] font-black italic text-slate-400 max-w-[140px] truncate bg-slate-100/50 dark:bg-slate-950/50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                      {entry.note}
                    </div>
                  )}
                  <button 
                    onClick={() => handleDelete(entry.id, Math.floor(entry.minutes / 60))}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"
                    title="Eliminar registo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="text-center py-8">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-[1em] font-futuristic">Pioneiro Eu Sou</p>
      </div>
    </div>
  );
};

interface ProgressCardProps {
  title: string;
  current: number;
  goal: number;
  icon: React.ReactNode;
  color: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, current, goal, icon, color }) => {
  const percentage = Math.min(100, Math.round((current / goal) * 100));
  
  return (
    <div className="glass p-7 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group border border-transparent hover:border-blue-500/20">
      <div className="flex items-center justify-between mb-5">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] font-futuristic">{title}</span>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-1 mb-4">
        <span className="text-4xl font-black dark:text-white tracking-tighter font-futuristic">{current}</span>
        <span className="text-xs font-black text-slate-400 tracking-tight">/ {goal}h</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-full neon-glow`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-3">
         <div className="text-[9px] font-black text-slate-400 tracking-[0.1em]">{percentage}% COMPLETO</div>
         {percentage >= 100 && <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />}
      </div>
    </div>
  );
};

export default Dashboard;
