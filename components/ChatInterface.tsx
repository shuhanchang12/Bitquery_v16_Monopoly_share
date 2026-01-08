
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Globe, Mic } from 'lucide-react';
import { sendChatMessage } from '../services/gemini';
import { ChatMessage } from '../types';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm Bitquery, your expert AI consultant powered by Gemini 3 Pro. I can perform deep market analysis, explain complex DeFi mechanics, or architect your trading strategy with advanced reasoning. How can I assist your portfolio today?",
      timestamp: new Date()
    }
  ]);
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

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini API
    const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const response = await sendChatMessage(apiHistory, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text || "Sorry, I encountered an error.",
      timestamp: new Date(),
      isGrounding: response.sources && response.sources.length > 0,
      sources: response.sources
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Suggested prompts for a high-level consultant
  const suggestions = [
    "Predict BTC trajectory using current macro data.",
    "Draft a risk management plan for a 10k portfolio.",
    "Explain cross-chain interoperability protocols.",
    "Analyze sentiment vs volume on Solana."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-crypto-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 bg-crypto-dark/50 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-crypto-purple to-crypto-accent flex items-center justify-center shadow-lg">
                    <Bot className="text-white w-6 h-6" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-crypto-card"></div>
            </div>
            <div>
                <h3 className="font-bold text-white">Bitquery Consultant</h3>
                <p className="text-xs text-crypto-accent flex items-center">
                    <Sparkles size={12} className="mr-1" /> Gemini 3 Pro Active
                </p>
            </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-crypto-accent transition-colors" title="Voice Interaction Coming Soon">
            <Mic size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-700 shadow-inner' : 'bg-crypto-purple/20 text-crypto-purple border border-crypto-purple/30'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                        className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-[#1E2330] text-gray-200 border border-white/5 rounded-tl-sm'
                        }`}
                    >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    
                    {/* Sources for Grounding */}
                    {msg.isGrounding && msg.sources && (
                        <div className="flex flex-wrap gap-2 mt-2 ml-1">
                            {msg.sources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-[10px] bg-crypto-dark/50 border border-white/10 px-2 py-1 rounded-full text-blue-400 hover:bg-white/5 transition-colors max-w-[200px]"
                                >
                                    <Globe size={10} className="mr-1" />
                                    <span className="truncate">{source.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-600 px-1">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-crypto-dark/30 border-t border-white/5">
        {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto mb-4 pb-2 no-scrollbar">
                {suggestions.map(s => (
                    <button 
                        key={s} 
                        onClick={() => setInput(s)}
                        className="whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>
        )}
        
        <div className="relative flex items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about complex trends or request strategy audits..."
                className="w-full bg-[#0B0E14] text-white border border-gray-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent/50 transition-all"
                disabled={isLoading}
            />
            <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 p-2 rounded-lg transition-all ${
                    input.trim() && !isLoading 
                    ? 'bg-crypto-accent text-black hover:scale-105' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
            >
                {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={18} />}
            </button>
        </div>
        <p className="text-[10px] text-center text-gray-600 mt-2">
            Gemini 3 Pro can generate financial insights. Professional audit is always recommended.
        </p>
      </div>
    </div>
  );
}
