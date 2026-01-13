
import React, { useState, useRef, useEffect } from 'react';
import { qualifyLeadMessage } from '../services/geminiService';

const ChatSimulator: React.FC<{ isGlobalAiActive: boolean }> = ({ isGlobalAiActive }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Oi! Eu sou a MIA. Tudo bem? Tu busca teu primeiro imóvel em POA?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !isGlobalAiActive) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const result = await qualifyLeadMessage(userMsg, messages.map(m => m.content));
    setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto h-[600px] bg-[#E5DDD5] rounded-[3rem] overflow-hidden border border-slate-300 shadow-2xl flex flex-col">
      <div className="bg-[#128C7E] p-5 text-white flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
        <div>
          <p className="font-bold text-sm">MIA | Magalhães</p>
          <p className="text-[10px] text-emerald-100">online agora</p>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl text-xs max-w-[80%] shadow-sm ${m.role === 'user' ? 'bg-[#DCF8C6] text-slate-800' : 'bg-white text-slate-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-slate-400 italic animate-pulse">MIA digitando...</div>}
      </div>
      <div className="p-4 bg-[#F0F0F0] flex gap-2 border-t">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Diga algo..." 
          className="flex-1 bg-white rounded-full px-5 py-3 text-xs outline-none shadow-sm"
        />
        <button onClick={handleSend} className="bg-[#128C7E] text-white p-3 rounded-full shadow-lg">➤</button>
      </div>
    </div>
  );
};
export default ChatSimulator;
