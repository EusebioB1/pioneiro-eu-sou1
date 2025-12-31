
import React, { useState } from 'react';
import { BibleStudy } from '../types';
import { BookOpen, Plus, Trash2, UserPlus, GraduationCap, Edit3, MessageSquare } from 'lucide-react';

interface BibleStudiesProps {
  studies: BibleStudy[];
  onUpdate: (studies: BibleStudy[]) => void;
}

const BibleStudies: React.FC<BibleStudiesProps> = ({ studies, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNote, setNewNote] = useState('');
  
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  
  const addStudy = () => {
    if (!newName.trim()) return;
    const newStudy: BibleStudy = {
      id: Date.now().toString(),
      name: newName,
      month: currentMonth,
      sessions: 1,
      notes: newNote
    };
    onUpdate([...studies, newStudy]);
    setNewName('');
    setNewNote('');
    setShowAdd(false);
  };

  const updateSessions = (id: string, delta: number) => {
    onUpdate(studies.map(s => s.id === id ? { ...s, sessions: Math.max(0, s.sessions + delta) } : s));
  };

  const updateNote = (id: string, note: string) => {
    onUpdate(studies.map(s => s.id === id ? { ...s, notes: note } : s));
  };

  const removeStudy = (id: string) => {
    if (window.confirm('Remover este estudo da lista?')) {
      onUpdate(studies.filter(s => s.id !== id));
    }
  };

  const currentMonthStudies = studies.filter(s => s.month === currentMonth);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black dark:text-white font-heading">Estudos Bíblicos</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">Gestão de Estudantes</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition active:scale-95"
        >
          <UserPlus size={18} />
          <span className="text-xs font-black uppercase tracking-widest font-heading">Novo</span>
        </button>
      </div>

      {showAdd && (
        <div className="p-6 glass rounded-[2rem] shadow-xl space-y-4 animate-in slide-in-from-top-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase tracking-widest mb-1.5 ml-1">Nome do Estudante</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Pedro Silva"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none dark:text-white text-sm font-bold"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase tracking-widest mb-1.5 ml-1">Observações (Progresso, Capítulos...)</label>
              <textarea 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ex: Está no capítulo 3 do livro 'Seja Feliz Para Sempre!'"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none dark:text-white text-sm min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={addStudy} className="flex-1 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-widest font-heading">Confirmar</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl text-xs uppercase tracking-widest">Sair</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentMonthStudies.length === 0 ? (
          <div className="glass p-16 text-center rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
            <GraduationCap className="mx-auto mb-4 opacity-20" size={64} />
            <p className="text-sm font-bold dark:text-slate-300">Nenhum estudo reportado este mês.</p>
            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Regista o progresso dos teus estudantes aqui.</p>
          </div>
        ) : (
          currentMonthStudies.map(study => (
            <div key={study.id} className="glass p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg dark:text-white font-heading">{study.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">ID: {new Date(parseInt(study.id)).toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-2xl p-1 shadow-inner border border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => updateSessions(study.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold"
                    >
                      -
                    </button>
                    <div className="flex flex-col items-center px-2">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{study.sessions}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Estudos</span>
                    </div>
                    <button 
                      onClick={() => updateSessions(study.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeStudy(study.id)}
                    className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group relative">
                <div className="flex items-center space-x-2 mb-2 text-slate-400">
                  <MessageSquare size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Observações</span>
                </div>
                <textarea
                  value={study.notes || ''}
                  onChange={(e) => updateNote(study.id, e.target.value)}
                  placeholder="Escreve aqui sobre o progresso do estudante..."
                  className="w-full bg-transparent outline-none dark:text-white text-sm font-medium resize-none min-h-[60px]"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {currentMonthStudies.length > 0 && (
        <div className="p-4 bg-indigo-600/10 dark:bg-indigo-900/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center">
          <p className="text-indigo-700 dark:text-indigo-200 text-[11px] font-black uppercase tracking-widest">
            Total de Estudos Reportáveis: <span className="text-lg ml-1 font-heading">{currentMonthStudies.length}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BibleStudies;
