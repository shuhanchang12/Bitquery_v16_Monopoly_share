
import React from 'react';
import { Presentation, Users, Target, ShieldCheck, Zap, Server, BarChart, ExternalLink, PlayCircle } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="animate-fade-in pb-16 space-y-12 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1 rounded-full bg-crypto-accent/10 border border-crypto-accent/20 text-crypto-accent text-xs font-bold uppercase tracking-widest mb-4">
          Bitquery MVP (v1.0)
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">
          Next-Gen AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-crypto-accent to-crypto-purple">Co-Pilot</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Transitioning from passive data libraries to a proactive "Safety Net" for the next billion crypto users.
        </p>
      </div>

      {/* Video Presentation Section */}
      <div className="bg-crypto-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative group">
          <div className="aspect-video bg-[#000] flex flex-col items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
               
               <a 
                href="https://loom.com/share/your-loom-link-here" 
                target="_blank" 
                rel="noopener noreferrer"
                className="z-10 flex flex-col items-center gap-4 hover:scale-105 transition-transform"
               >
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <PlayCircle size={48} className="text-white fill-white/10" />
                  </div>
                  <span className="text-white font-bold tracking-wider">Watch Product Demo (3-5m)</span>
               </a>

               <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10">
                   <div>
                       <h3 className="text-xl font-bold text-white">Full Walkthrough</h3>
                       <p className="text-gray-400 text-sm">Experience the Bitquery ecosystem in action.</p>
                   </div>
                   <div className="flex gap-2">
                       <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-gray-300 font-mono">React 19</span>
                       <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-gray-300 font-mono">Gemini 3 Pro</span>
                   </div>
               </div>
          </div>
      </div>

      {/* The Crisis & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-crypto-card/50 p-8 rounded-3xl border border-white/5">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 border border-red-500/20 text-red-500">
            <Target size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">The "Retail Crisis"</h3>
          <p className="text-gray-400 leading-relaxed">
            Crypto investors suffer from <span className="text-white font-semibold">Information Overload</span> and a massive <span className="text-white font-semibold">Knowledge Gap</span>. Pros use complex tools while retail users trade on emotion and vulnerability.
          </p>
          <div className="mt-6 flex gap-4">
             <div className="bg-black/30 p-4 rounded-xl flex-1 border border-white/5">
                 <p className="text-2xl font-bold text-red-400">41%</p>
                 <p className="text-[10px] uppercase text-gray-500">Cite "Signal Noise"</p>
             </div>
             <div className="bg-black/30 p-4 rounded-xl flex-1 border border-white/5">
                 <p className="text-2xl font-bold text-red-400">48%</p>
                 <p className="text-[10px] uppercase text-gray-500">Find tools too complex</p>
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-crypto-card p-8 rounded-3xl border border-blue-500/20 shadow-[0_0_40px_rgba(0,229,255,0.1)]">
          <div className="w-12 h-12 bg-crypto-accent/10 rounded-xl flex items-center justify-center mb-6 border border-crypto-accent/20 text-crypto-accent">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Actionable Trust</h3>
          <p className="text-gray-300 leading-relaxed">
            Bitquery is an <span className="text-crypto-accent font-semibold">Active AI Copilot</span>. We inject fact-checked intelligence directly into the user workflow, empowering through real-time risk mitigation and gamified learning.
          </p>
          <ul className="mt-6 space-y-2">
            {["Real-time Risk Guardian", "Search-Grounded Intelligence", "Gamified Learning Board"].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-gray-400">
                <Zap size={14} className="text-crypto-accent mr-2" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tech Stack Visualizer */}
      <div className="bg-crypto-card rounded-3xl border border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Server size={180} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <Server className="mr-3 text-crypto-purple" /> Technical Architecture
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {[
            { label: "Gemini 3 Pro/Flash", desc: "The reasoning engine for multi-modal synthesis and search grounding.", icon: <BarChart /> },
            { label: "Vertex AI", desc: "Manages NLP models optimized for crypto sentiment analysis.", icon: <ShieldCheck /> },
            { label: "BigQuery", desc: "Analytical engine for petabyte-scale on-chain whale tracking.", icon: <Server /> },
            { label: "React 19 & Vite", desc: "High-performance frontend delivering 1.18s avg system latency.", icon: <Zap /> }
          ].map((tech, i) => (
            <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-crypto-accent/30 transition-colors">
              <div className="text-crypto-accent mb-4">{tech.icon}</div>
              <h4 className="text-sm font-bold text-white mb-2">{tech.label}</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-8 justify-center items-center">
            <div className="text-center">
                <p className="text-3xl font-black text-white">82.5%</p>
                <p className="text-[10px] uppercase text-gray-500 font-bold">Sentiment Accuracy</p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-black text-white">92%</p>
                <p className="text-[10px] uppercase text-gray-500 font-bold">Fact-Check Success</p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-black text-white">1.18s</p>
                <p className="text-[10px] uppercase text-gray-500 font-bold">Avg Latency</p>
            </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
          <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Users className="mr-3 text-crypto-accent" /> The Founders
              </h3>
              <p className="text-gray-500">Elite engineers and strategists building the future of crypto trust.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: "Shuhan Chang", role: "AI Lead", focus: "Reasoning & LLM Pipeline" },
               { name: "Roland Juilhard", role: "UI/UX Strategist", focus: "Futuristic Visual Systems" },
               { name: "Mazen Ismail", role: "Systems Architect", focus: "Data & Scaling Architecture" }
             ].map((member, i) => (
                <div key={i} className="bg-crypto-card p-6 rounded-3xl border border-white/5 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-crypto-accent to-crypto-purple flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="text-lg font-bold text-white">{member.name}</h4>
                    <p className="text-crypto-accent text-xs font-mono mb-3">{member.role}</p>
                    <p className="text-[11px] text-gray-500">{member.focus}</p>
                </div>
             ))}
          </div>
      </div>

      {/* Mission Footer */}
      <div className="bg-gradient-to-r from-crypto-purple/20 via-blue-900/20 to-crypto-accent/20 p-12 rounded-3xl border border-white/10 text-center">
          <p className="text-[10px] text-crypto-accent font-bold uppercase tracking-[0.3em] mb-6">Our Mission</p>
          <h2 className="text-4xl font-black text-white mb-8 max-w-3xl mx-auto italic">
            "To deliver the most accessible and trustworthy AI trading copilot for retail investors."
          </h2>
          <div className="flex justify-center gap-4">
              <button className="flex items-center px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Join the 1B+ Community
              </button>
              <button className="flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                  Read Technical Docs <ExternalLink size={16} className="ml-2" />
              </button>
          </div>
      </div>

    </div>
  );
}
