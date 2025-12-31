
import React, { useState } from 'react';
import { PioneerType, UserProfile } from '../types';
import { ChevronRight, Camera, User, Home, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [congregation, setCongregation] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [type, setType] = useState<PioneerType>(PioneerType.REGULAR);
  const [annualGoal, setAnnualGoal] = useState(600);
  const [monthlyGoal, setMonthlyGoal] = useState(50);
  const [weeklyGoal, setWeeklyGoal] = useState(12);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onComplete({
      name,
      photo,
      congregation,
      groupNumber,
      type,
      goals: {
        annual: annualGoal,
        monthly: monthlyGoal,
        weekly: weeklyGoal
      },
      onboarded: true,
      reminderTime: '19:00',
      remindersEnabled: true
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto min-h-screen">
      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50 animate-float relative overflow-hidden">
        <span className="text-white text-4xl font-black font-heading tracking-tighter z-10">P</span>
      </div>
      
      <h1 className="text-3xl font-black text-center mb-1 dark:text-white font-heading">PIONEIRO EU SOU</h1>
      <p className="text-slate-500 text-center mb-8 dark:text-slate-300 font-medium text-sm">Organiza a tua jornada ministerial com excelência.</p>

      <form onSubmit={handleSubmit} className="w-full space-y-6 glass p-8 rounded-[2rem]">
        {/* Photo Upload */}
        <div className="flex flex-col items-center space-y-2">
          <label className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-xl overflow-hidden flex items-center justify-center transition-all group-hover:scale-105">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-slate-400" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg border-2 border-white dark:border-slate-900">
              <Camera size={12} />
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-200">Foto de Perfil</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-200 mb-1.5 ml-1">Nome Completo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none transition-all dark:text-white font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-200 mb-1.5 ml-1">Congregação</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={congregation}
                  onChange={(e) => setCongregation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none dark:text-white font-semibold text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-200 mb-1.5 ml-1">Grupo nº</label>
              <input 
                required
                type="text" 
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 outline-none dark:text-white font-semibold text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-200 mb-2.5 ml-1 text-center">Designação</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setType(PioneerType.REGULAR); setAnnualGoal(600); setMonthlyGoal(50); setWeeklyGoal(12); }}
              className={`py-3 rounded-xl border font-bold text-xs transition-all ${type === PioneerType.REGULAR ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-slate-200'}`}
            >
              Regular
            </button>
            <button
              type="button"
              onClick={() => { setType(PioneerType.AUXILIAR); setAnnualGoal(360); setMonthlyGoal(30); setWeeklyGoal(7); }}
              className={`py-3 rounded-xl border font-bold text-xs transition-all ${type === PioneerType.AUXILIAR ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 dark:text-slate-200'}`}
            >
              Auxiliar
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <span className="font-heading tracking-widest uppercase text-sm">Começar Jornada</span>
          <ChevronRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
