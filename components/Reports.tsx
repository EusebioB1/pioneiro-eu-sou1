
import React, { useRef } from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Download, TrendingUp, Award, Share2, FileDown, Image } from 'lucide-react';

// Access libraries from the window object
declare var jspdf: any;
declare var html2canvas: any;

interface ReportsProps {
  state: AppState;
}

const Reports: React.FC<ReportsProps> = ({ state }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const entries = state.serviceEntries;
  const now = new Date();
  const currentMonthKey = now.toISOString().substring(0, 7);

  // Prepare data for monthly chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleString('pt-PT', { month: 'short' });
    const year = d.getFullYear();
    const monthKey = `${year}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const totalMins = entries
      .filter(e => e.date.startsWith(monthKey))
      .reduce((acc, curr) => acc + curr.minutes, 0);
    
    return { name: monthStr, hours: Math.round(totalMins / 60) };
  }).reverse();

  const currentMonthMins = entries
    .filter(e => e.date.startsWith(currentMonthKey))
    .reduce((acc, curr) => acc + curr.minutes, 0);
  
  const currentMonthHrs = Math.floor(currentMonthMins / 60);
  const currentMonthMinsRem = currentMonthMins % 60;
  const monthGoal = state.profile.goals.monthly;
  const bibleStudiesCount = state.bibleStudies.filter(s => s.month === currentMonthKey).length;

  const handleShare = async () => {
    const monthName = now.toLocaleString('pt-PT', { month: 'long' });
    const reportText = `📄 *Relatório de Serviço - ${monthName}*\n` +
      `👤 *Pioneiro:* ${state.profile.name}\n` +
      `🏛 *Congregação:* ${state.profile.congregation}\n` +
      `👥 *Grupo:* ${state.profile.groupNumber}\n` +
      `⏱ *Horas:* ${currentMonthHrs}h${currentMonthMinsRem > 0 ? ` ${currentMonthMinsRem}min` : ''}\n` +
      `📚 *Estudos Bíblicos:* ${bibleStudiesCount}\n` +
      `🎯 *Meta:* ${monthGoal}h\n` +
      `✨ Enviado via app *PIONEIRO EU SOU*`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório de ${monthName}`,
          text: reportText,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(reportText);
        alert('Relatório copiado para a área de transferência!');
      } catch (err) {
        alert('Não foi possível partilhar o relatório automaticamente.');
      }
    }
  };

  const exportPDF = () => {
    try {
      const { jsPDF } = jspdf;
      const doc = new jsPDF();
      const monthName = now.toLocaleString('pt-PT', { month: 'long' });
      const year = now.getFullYear();

      // Modern PDF Header
      doc.setFillColor(59, 130, 246); // Blue-600
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("PIONEIRO EU SOU", 20, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("RELATÓRIO MENSAL DE SERVIÇO DE CAMPO", 20, 30);

      if (state.profile.photo) {
        try {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(165, 5, 30, 30, 4, 4, 'F');
          doc.addImage(state.profile.photo, 'JPEG', 167, 7, 26, 26);
        } catch (imgError) {
          console.error("Error adding image to PDF", imgError);
        }
      }

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Relatório: ${monthName.toUpperCase()} ${year}`, 20, 55);
      
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 60, 190, 60);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      doc.setFont("helvetica", "bold");
      doc.text("Pioneiro(a):", 20, 75);
      doc.setFont("helvetica", "normal");
      doc.text(state.profile.name, 50, 75);

      doc.setFont("helvetica", "bold");
      doc.text("Congregação:", 20, 85);
      doc.setFont("helvetica", "normal");
      doc.text(state.profile.congregation || "Não informada", 50, 85);

      doc.setFont("helvetica", "bold");
      doc.text("Designação:", 110, 75);
      doc.setFont("helvetica", "normal");
      doc.text(state.profile.type, 140, 75);

      doc.setFont("helvetica", "bold");
      doc.text("Grupo nº:", 110, 85);
      doc.setFont("helvetica", "normal");
      doc.text(state.profile.groupNumber || "N/A", 140, 85);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, 95, 170, 45, 4, 4, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("RESUMO DA ATIVIDADE", 30, 110);
      
      doc.setFontSize(12);
      doc.text("Horas:", 30, 125);
      doc.setFont("helvetica", "normal");
      doc.text(`${currentMonthHrs}h ${currentMonthMinsRem}min`, 50, 125);

      doc.setFont("helvetica", "bold");
      doc.text("Estudos Bíblicos:", 110, 125);
      doc.setFont("helvetica", "normal");
      doc.text(`${bibleStudiesCount}`, 150, 125);

      const diff = currentMonthHrs - monthGoal;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Meta Mensal: ${monthGoal}h`, 30, 148);
      doc.text(`Diferença: ${diff >= 0 ? '+' : ''}${diff}h`, 80, 148);

      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(`Documento gerado pelo App PIONEIRO EU SOU em ${new Date().toLocaleDateString('pt-PT')}`, 105, 285, { align: "center" });

      doc.save(`Relatorio_${monthName}_${year}_${state.profile.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF generation error", error);
      alert("Erro ao gerar PDF.");
    }
  };

  const exportJPG = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      const monthName = now.toLocaleString('pt-PT', { month: 'long' });
      link.download = `Relatorio_${monthName}_${state.profile.name.replace(/\s+/g, '_')}.jpg`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("JPG export error", error);
      alert("Erro ao gerar imagem.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-10">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black dark:text-white font-heading">Relatórios</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">Atividade Ministerial</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={exportJPG}
            title="Exportar como Imagem (JPG)"
            className="p-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 hover:text-indigo-600 transition active:scale-95"
          >
            <Image size={20} />
          </button>
          <button 
            onClick={exportPDF}
            title="Exportar como Documento (PDF)"
            className="p-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 hover:text-blue-600 transition active:scale-95"
          >
            <FileDown size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition active:scale-95"
          >
            <Share2 size={16} />
            <span className="text-xs font-black uppercase tracking-widest font-heading">Reportar</span>
          </button>
        </div>
      </div>

      {/* Profile Info Brief */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
           <p className="text-[8px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest mb-1">Congregação</p>
           <p className="text-xs font-bold dark:text-white truncate">{state.profile.congregation || "—"}</p>
        </div>
        <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
           <p className="text-[8px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest mb-1">Grupo de Serviço</p>
           <p className="text-xs font-bold dark:text-white">{state.profile.groupNumber || "—"}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <TrendingUp className="text-emerald-500 mb-3" size={20} />
          <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase mb-1 tracking-widest font-heading">Acumulado</h3>
          <p className="text-3xl font-black dark:text-white tracking-tighter font-heading">
            {Math.round(entries.reduce((acc, c) => acc + c.minutes, 0) / 60)}<span className="text-sm font-medium opacity-40 ml-1 font-sans">h</span>
          </p>
        </div>
        <div className="glass p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <Award className="text-amber-500 mb-3" size={20} />
          <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase mb-1 tracking-widest font-heading">Desempenho</h3>
          <p className="text-3xl font-black dark:text-white tracking-tighter font-heading">
            {monthlyData.length > 0 ? Math.round(monthlyData.reduce((acc, c) => acc + c.hours, 0) / monthlyData.length) : 0}<span className="text-sm font-medium opacity-40 ml-1 font-sans">h</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-8 rounded-[2rem] shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 font-heading mb-8">Evolução Mensal (Horas)</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', background: '#0f172a', color: '#fff' }}
                itemStyle={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '12px' }}
              />
              <Bar dataKey="hours" radius={[8, 8, 8, 8]} barSize={28}>
                {monthlyData.map((entry, index) => (
                  <Cell key={index} fill={entry.hours >= monthGoal ? '#10b981' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Summary Box (Target for JPG Export) */}
      <div ref={reportRef} className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 rounded-[2.5rem] shadow-xl text-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight font-heading">
              {now.toLocaleString('pt-PT', { month: 'long' }).toUpperCase()} {now.getFullYear()}
            </h3>
            <p className="text-[9px] font-bold text-blue-200/60 uppercase tracking-widest mt-1">
              {state.profile.congregation} • Grupo {state.profile.groupNumber}
            </p>
          </div>
          <div className="flex flex-col items-end">
             {state.profile.photo && (
               <div className="w-12 h-12 rounded-xl bg-white/10 p-0.5 border border-white/20 overflow-hidden mb-2">
                 <img src={state.profile.photo} alt="Pioneiro" className="w-full h-full object-cover rounded-[0.6rem]" />
               </div>
             )}
             <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20">
               {state.profile.type}
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1 font-heading">Horas Realizadas</p>
              <p className="text-4xl font-black tracking-tighter font-heading">{currentMonthHrs}<span className="text-lg opacity-40 ml-1 font-sans">h</span></p>
              <p className="text-xs font-bold opacity-30 font-sans">{currentMonthMinsRem}min</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                <span>Progresso da Meta</span>
                <span>{Math.round((currentMonthHrs / monthGoal) * 100)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${currentMonthHrs >= monthGoal ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}
                  style={{ width: `${Math.min(100, (currentMonthHrs / monthGoal) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center text-center">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
               <Award className="text-white" size={28} />
             </div>
             <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1 font-heading">Estudos Bíblicos</p>
             <p className="text-5xl font-black tracking-tighter font-heading">{bibleStudiesCount}</p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/5 text-center">
           <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">PIONEIRO EU SOU • SISTEMA DE GESTÃO</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
