
import React from 'react';
import { AppState, DayPlan } from '../types';
import { WEEK_DAYS } from '../constants';
import { CalendarCheck, AlertCircle } from 'lucide-react';

interface WeeklyPlannerProps {
  state: AppState;
  onUpdatePlans: (plans: DayPlan[]) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ state, onUpdatePlans }) => {
  const totalPlannedMinutes = state.weeklyPlans.reduce((acc, curr) => acc + (curr.active ? curr.minutes : 0), 0);
  const totalPlannedHours = Math.round(totalPlannedMinutes / 60);
  const goal = state.profile.goals.weekly;
  const isMeetingGoal = totalPlannedHours >= goal;

  const toggleDay = (dayIndex: number) => {
    const newPlans = state.weeklyPlans.map(p => 
      p.day === dayIndex ? { ...p, active: !p.active, minutes: !p.active ? 120 : 0 } : p
    );
    onUpdatePlans(newPlans);
  };

  const updateHours = (dayIndex: number, hours: string) => {
    const mins = parseFloat(hours) * 60;
    const newPlans = state.weeklyPlans.map(p => 
      p.day === dayIndex ? { ...p, minutes: isNaN(mins) ? 0 : mins } : p
    );
    onUpdatePlans(newPlans);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <CalendarCheck className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold dark:text-white">Planeamento Semanal</h1>
      </div>

      <div className={`p-6 rounded-3xl border ${isMeetingGoal ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 dark:text-white">Total Planeado</h3>
            <p className={`text-4xl font-black ${isMeetingGoal ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {totalPlannedHours}h <span className="text-base font-normal opacity-60">/ {goal}h</span>
            </p>
          </div>
          {!isMeetingGoal && (
            <div className="flex flex-col items-end text-amber-600 dark:text-amber-400">
              <AlertCircle size={32} />
              <span className="text-[10px] font-bold mt-1">Meta em falta</span>
            </div>
          )}
        </div>
        <div className="w-full h-3 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ${isMeetingGoal ? 'bg-emerald-500' : 'bg-amber-500'}`} 
            style={{ width: `${Math.min(100, (totalPlannedHours / goal) * 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {WEEK_DAYS.map((name, index) => {
          // JS days: 0 is Sunday. Our UI list usually starts Monday or Sunday. 
          // Let's match the index to DayPlan's day.
          // WEEK_DAYS: [Dom, Seg, Ter, Qua, Qui, Sex, Sab] -> index 0-6
          const plan = state.weeklyPlans.find(p => p.day === index) || { day: index, active: false, minutes: 0 };
          
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 border-b last:border-0 border-slate-50 dark:border-slate-700 transition-colors ${plan.active ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => toggleDay(index)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${plan.active ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}
                >
                  {plan.active && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
                <span className={`font-semibold ${plan.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{name}</span>
              </div>
              
              {plan.active && (
                <div className="flex items-center space-x-2 animate-in fade-in zoom-in-95 duration-200">
                  <input 
                    type="number" 
                    step="0.5"
                    value={plan.minutes / 60}
                    onChange={(e) => updateHours(index, e.target.value)}
                    className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-400">h</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Chart Bars */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Distribuição da Semana</h3>
        <div className="flex justify-between items-end h-32 px-2">
          {WEEK_DAYS.map((name, index) => {
             const plan = state.weeklyPlans.find(p => p.day === index);
             const height = plan?.active ? Math.min(100, (plan.minutes / 480) * 100) : 5; // 480min = 8h max ref
             return (
               <div key={index} className="flex flex-col items-center flex-1">
                 <div 
                    className={`w-4 rounded-full transition-all duration-1000 ${plan?.active ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-700'}`} 
                    style={{ height: `${height}%` }}
                 />
                 <span className="text-[10px] font-bold mt-2 text-slate-400 uppercase">{name.substring(0, 3)}</span>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
