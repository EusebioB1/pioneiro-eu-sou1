
import React, { useState, useEffect } from 'react';
import { UserProfile, PioneerType } from '../types';
import { Settings as SettingsIcon, Bell, User, Layout, Moon, Sun, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdate, toggleTheme, isDark }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleSave = () => {
    onUpdate(formData);
    alert('Configurações atualizadas!');
  };

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === "granted") {
      setFormData({ ...formData, remindersEnabled: true });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto pb-10">
      <div className="flex items-center space-x-3 px-2">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <SettingsIcon className="text-slate-600 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black dark:text-white font-heading">Painel de Controlo</h1>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">Personalização e Sistema</p>
        </div>
      </div>

      {/* Notifications Section */}
      <section className="glass p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-blue-400">
          <Bell size={16} className="font-black" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Lembretes e Alarmes</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold dark:text-white">Alarme de Pregação (19:00)</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Dispara um dia antes do serviço</p>
            </div>
            <button 
              onClick={() => setFormData({ ...formData, remindersEnabled: !formData.remindersEnabled })}
              className={`w-12 h-6 rounded-full relative transition-colors ${formData.remindersEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.remindersEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {notifPermission !== "granted" ? (
            <button 
              onClick={requestNotifPermission}
              className="w-full py-4 flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all group"
            >
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.1em]">Autorizar Alertas no Navegador</span>
            </button>
          ) : (
            <div className="w-full py-3 flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <CheckCircle2 size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">Notificações Ativas no Sistema</span>
            </div>
          )}
        </div>
      </section>

      {/* Profile Section */}
      <section className="glass p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-200">
          <User size={14} className="font-black" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Identidade</h3>
        </div>

        <div className="flex flex-col items-center space-y-6">
           <label className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-950 border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center transition-all group-hover:scale-105">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-slate-300 dark:text-slate-700" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
                <Camera size={14} />
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            
            <div className="w-full space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1">Nome Digital</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1">Congregação</label>
                  <input 
                    type="text" 
                    value={formData.congregation}
                    onChange={(e) => setFormData({ ...formData, congregation: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1">Grupo nº</label>
                  <input 
                    type="text" 
                    value={formData.groupNumber}
                    onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="glass p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-200">
          <Layout size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Metas do Sistema</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['weekly', 'monthly', 'annual'].map((key) => (
            <div key={key} className="space-y-2">
              <label className="block text-[9px] font-black text-slate-500 dark:text-slate-400 text-center uppercase tracking-widest">
                {key === 'weekly' ? 'Semana' : key === 'monthly' ? 'Mês' : 'Ano'}
              </label>
              <input 
                type="number" 
                value={formData.goals[key as keyof typeof formData.goals]}
                onChange={(e) => setFormData({ ...formData, goals: { ...formData.goals, [key]: Number(e.target.value) } })}
                className="w-full px-3 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl dark:text-white text-center font-black text-xl shadow-inner"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Interface Preferences */}
      <section className="glass p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-200">
          <Moon size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] font-heading">Interface</h3>
        </div>
        
        <div className="flex items-center justify-between group cursor-pointer" onClick={toggleTheme}>
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500">
                {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-600" />}
             </div>
             <span className="text-sm font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest text-[11px]">Modo Visual</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all relative ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
          </div>
        </div>
      </section>

      <button 
        onClick={handleSave}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
      >
        <Save size={20} />
        <span className="font-heading tracking-widest uppercase text-sm">Atualizar Dados</span>
      </button>

      <div className="text-center pt-4 opacity-50">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] font-heading">Pioneiro Eu Sou • 2.2.1</p>
      </div>
    </div>
  );
};

export default Settings;
