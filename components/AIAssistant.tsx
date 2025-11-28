import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import { getBusinessAdvice } from '../services/geminiService';
import { Product, Customer, Sale } from '../types';

interface AIAssistantProps {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ products, customers, sales }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: '¡Hola! Soy Don Facil. Analizo tu tienda para ayudarte a vender más y perder menos. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const advice = await getBusinessAdvice(userMsg, products, customers, sales);
    
    setMessages(prev => [...prev, { role: 'assistant', text: advice }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
       {/* Header */}
       <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold">Asesor Inteligente</h2>
            <p className="text-xs text-indigo-100">Potenciado por Gemini AI</p>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                 msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
               }`}>
                  {msg.role === 'assistant' && <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold text-xs"><Bot size={14}/> Don Facil</div>}
                  {msg.text}
               </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 relative">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Pregunta sobre tus ventas, clientes o inventario..."
               className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
             />
             <button 
               onClick={handleSend}
               disabled={isLoading || !input.trim()}
               className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={18} />
             </button>
          </div>
       </div>
    </div>
  );
};