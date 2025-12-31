
import React, { useState, useEffect, useRef } from 'react';
import { ServiceEntry } from '../types';
import { Play, Pause, Square, Clock, Save, Trash2 } from 'lucide-react';

interface StopwatchProps {
  onAddEntry: (entry: ServiceEntry) => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ onAddEntry }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  
  // Fix: Use number for browser-based timer reference instead of NodeJS.Timeout
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if there's a running timer in local storage
    const savedStartTime = localStorage.getItem('pioneiro_timer_start');
    const savedSeconds = localStorage.getItem('pioneiro_timer_seconds');
    
    if (savedStartTime && localStorage.getItem('pioneiro_timer_active') === 'true') {
      const elapsedSinceStart = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
      setSeconds(elapsedSinceStart + (savedSeconds ? parseInt(savedSeconds) : 0));
      setIsActive(true);
    } else if (savedSeconds) {
      setSeconds(parseInt(savedSeconds));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      // Use window.setInterval to ensure return type is number
      timerRef.current = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    // Persist current state
    localStorage.setItem('pioneiro_timer_active', isActive.toString());
    localStorage.setItem('pioneiro_timer_seconds', seconds.toString());
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds]);

  const toggle = () => {
    if (!isActive) {
      localStorage.setItem('pioneiro_timer_start', Date.now().toString());
    } else {
      localStorage.removeItem('pioneiro_timer_start');
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    if (window.confirm('Tens a certeza que queres descartar este tempo?')) {
      setIsActive(false);
      setSeconds(0);
      localStorage.removeItem('pioneiro_timer_start');
      localStorage.removeItem('pioneiro_timer_seconds');
      localStorage.setItem('pioneiro_timer_active', 'false');
    }
  };

  const finish = () => {
    if (seconds <= 0) return;

    // Convert seconds to minutes. Using Math.ceil to ensure at least 1 minute is recorded if some time passed,
    // or simply decimal for higher precision. Let's use rounding for typical reporting.
    const mins = Math.max(1, Math.round(seconds / 60));

    onAddEntry({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      minutes: mins,
      note: note
    });

    setIsActive(false);
    setSeconds(0);
    setNote('');
    setShowNote(false);
    localStorage.removeItem('pioneiro_timer_start');
    localStorage.removeItem('pioneiro_timer_seconds');
    localStorage.setItem('pioneiro_timer_active', 'false');
    alert('Serviço registado com sucesso!');
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <Clock className="text-blue-600 dark:text-blue-400" size={32} />
        </div>
        <h2 className="text-xl font-bold dark:text-white font-heading">Cronómetro de Serviço</h2>
      </div>

      <div className="text-7xl font-mono font-black tracking-tighter tabular-nums dark:text-white">
        {formatTime(seconds)}
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={reset}
          disabled={seconds === 0}
          className="p-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 transition disabled:opacity-30 disabled:scale-100 active:scale-90 shadow-sm"
        >
          <Trash2 size={24} />
        </button>

        <button 
          onClick={toggle}
          className={`p-10 rounded-full shadow-2xl transition-all active:scale-95 ${
            isActive 
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
          }`}
        >
          {isActive ? <Pause size={48} className="text-white fill-current" /> : <Play size={48} className="text-white fill-current ml-2" />}
        </button>

        <button 
          onClick={() => setShowNote(!showNote)}
          className={`p-5 rounded-full transition active:scale-90 shadow-sm ${showNote ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
        >
          <Square size={24} />
        </button>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {showNote && (
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Adicionar observação..."
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 animate-in slide-in-from-top-2 dark:text-white font-medium"
          />
        )}

        <button 
          onClick={finish}
          disabled={seconds === 0}
          className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition flex items-center justify-center space-x-2 disabled:opacity-30 active:scale-[0.98] font-heading uppercase tracking-widest text-sm"
        >
          <Save size={20} />
          <span>Finalizar e Salvar</span>
        </button>
      </div>
      
      {isActive && (
        <p className="text-xs text-blue-500 font-black uppercase tracking-widest animate-pulse">Serviço em curso...</p>
      )}
    </div>
  );
};

export default Stopwatch;
