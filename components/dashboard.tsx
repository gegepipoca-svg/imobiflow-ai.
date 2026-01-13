
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lead, LeadStatus } from '../types';
import { getLeadAnalytics } from '../services/geminiService';

const Dashboard: React.FC<{ leads: Lead[], onNavigateToCopy: () => void, onNavigateToIcebreaker: () => void }> = ({ leads, onNavigateToIcebreaker }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeadAnalytics(leads).then(res => {
      setAnalytics(res);
      setLoading(false);
    });
  }, [leads]);

  const stats = [
    { name: 'Novos', value: leads.filter(l => l.status === LeadStatus.NEW).length, color: '#3b82f6' },
    { name: 'Quentes', value: leads.filter(l => l.status === LeadStatus.HOT).length, color: '#ef4444' },
    { name: 'Follow-up', value: leads.filter(l => l.status === LeadStatus.FOLLOW_UP).length, color: '#10b981' },
  ];

  return (
    <div className="space-y-10">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Comando de Elite Magalhães</h2>
          <p className="text-slate-400 text-sm font-medium">Infraestrutura Vercel | MIA Ativa</p>
        </div>
        <div className="bg-emerald-500/20 border border-emerald-500/30 px-6 py-2 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
          Sistema Operacional
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-[400px]">
          <h3 className="text-slate-800 font-bold mb-8">Fluxo de Leads</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                {stats.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <h3 className="font-black uppercase text-xs tracking-[0.2em] text-indigo-400">Resumo IA</h3>
            {loading ? <div className="animate-pulse h-4 bg-white/10 rounded w-full"></div> : (
              <p className="text-sm font-medium leading-relaxed italic">"{analytics?.prioritySummary}"</p>
            )}
          </div>
          <button onClick={onNavigateToIcebreaker} className="w-full bg-rose-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all mt-6 shadow-lg">Reativar Leads Agora</button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
