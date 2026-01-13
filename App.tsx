
import React, { useState } from 'react';
import { Lead, LeadStatus } from './types';
import Dashboard from './components/Dashboard';
import StrategyGuide from './components/StrategyGuide';
import ChatSimulator from './components/ChatSimulator';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import LeadExpertise from './components/LeadExpertise';
import AdCopyGenerator from './components/AdCopyGenerator';
import IcebreakerGenerator from './components/IcebreakerGenerator';
import MaterialsManager from './components/MaterialsManager';

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'João Silva', phone: '11 98888-7777', source: 'Instagram Ads', status: LeadStatus.HOT, lastMessage: 'Quero visitar o apto na Lapa sábado.', timestamp: '2024-05-20T10:00:00Z', score: 95, interests: ['Lapa', 'Apartamento'], isAiPaused: false, monitoringActive: true, waitingHours: 0.5, interactionCount: 8, lastSpeaker: 'lead' },
  { id: '2', name: 'Maria Souza', phone: '21 97777-6666', source: 'Facebook', status: LeadStatus.QUALIFYING, lastMessage: 'Qual o valor do condomínio?', timestamp: '2024-05-20T11:30:00Z', score: 65, interests: ['Barra', 'Casa'], isAiPaused: true, monitoringActive: false, interactionCount: 2, lastSpeaker: 'ai' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isGlobalAiActive, setIsGlobalAiActive] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard leads={leads} onNavigateToCopy={() => setActiveTab('copy')} onNavigateToIcebreaker={() => setActiveTab('icebreaker')} />;
      case 'chat': return <ChatSimulator isGlobalAiActive={isGlobalAiActive} />;
      case 'strategy': return <StrategyGuide />;
      case 'integration': return <WhatsAppIntegration isGlobalAiActive={isGlobalAiActive} onToggleGlobalAi={() => setIsGlobalAiActive(!isGlobalAiActive)} />;
      case 'expertise': return <LeadExpertise />;
      case 'copy': return <AdCopyGenerator />;
      case 'icebreaker': return <IcebreakerGenerator />;
      case 'materials': return <MaterialsManager />;
      case 'leads': return <div className="p-10 text-slate-500 font-bold">Módulo de Lista de Leads em desenvolvimento.</div>;
      default: return <Dashboard leads={leads} onNavigateToCopy={() => setActiveTab('copy')} onNavigateToIcebreaker={() => setActiveTab('icebreaker')} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Mapa de Guerra', icon: '📊' },
    { id: 'leads', label: 'Campo de Leads', icon: '👥' },
    { id: 'expertise', label: 'Espião de Bairro', icon: '📍' },
    { id: 'chat', label: 'Lab de Chat', icon: '💬' },
    { id: 'copy', label: 'Gerador Anúncios', icon: '📝' },
    { id: 'icebreaker', label: 'Operação Resgate', icon: '⚡' },
    { id: 'integration', label: 'WhatsApp Cloud', icon: '📱' },
    { id: 'strategy', label: 'Implantação', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen p-8">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter mb-10 flex items-center gap-2">
          ImobiFlow <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-xs">AI</span>
        </h1>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full text-left px-5 py-3.5 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 font-black shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className={`mt-auto p-6 rounded-[2rem] text-white transition-all ${isGlobalAiActive ? 'bg-slate-900' : 'bg-rose-900'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Status MIA</span>
            <div className={`w-2 h-2 rounded-full ${isGlobalAiActive ? 'bg-emerald-500 animate-pulse' : 'bg-white'}`}></div>
          </div>
          <p className="text-xs font-bold">{isGlobalAiActive ? 'IA Protegendo Leads' : 'IA em Descanso'}</p>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
