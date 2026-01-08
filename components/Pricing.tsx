
import React from 'react';
import { Check, X, Zap, Crown, Shield } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Unlock Professional Intelligence</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upgrade to Bitquery Pro to access real-time Whale Tracking, unlimited Algorithmic Simulations, and Deep ESG Analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FREE PLAN */}
        <div className="bg-crypto-card border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/10 transition-colors">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-300">Explorer</h3>
            <p className="text-4xl font-bold text-white mt-2">$0 <span className="text-sm font-normal text-gray-500">/mo</span></p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-crypto-success mr-3"/> BitPoly Game (Unlimited)</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-crypto-success mr-3"/> Basic Market Charts</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-crypto-success mr-3"/> AI Chat (Limited Grounding)</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-crypto-success mr-3"/> Algo Simulator (3 Runs/Day)</li>
            <li className="flex items-center text-sm text-gray-500"><X size={16} className="text-gray-600 mr-3"/> Whale Tracker</li>
            <li className="flex items-center text-sm text-gray-500"><X size={16} className="text-gray-600 mr-3"/> Copy Trading Strategies</li>
            <li className="flex items-center text-sm text-gray-500"><X size={16} className="text-gray-600 mr-3"/> Deep ESG Audits</li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-bold text-white">
            Current Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="bg-gradient-to-b from-blue-900/20 to-crypto-card border border-crypto-accent/50 rounded-2xl p-8 flex flex-col relative transform scale-105 shadow-2xl">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-crypto-accent text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-crypto-accent flex items-center"><Zap size={20} className="mr-2"/> Pro Trader</h3>
            <p className="text-4xl font-bold text-white mt-2">$29 <span className="text-sm font-normal text-gray-500">/mo</span></p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> <strong>Unlimited</strong> Algo Simulations</li>
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> <strong>Live Whale Tracker</strong></li>
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> Portfolio Risk Guardian</li>
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> Sentiment Cloud & Mind Maps</li>
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> <strong>Copy Top 10 Traders</strong></li>
            <li className="flex items-center text-sm text-white"><Check size={16} className="text-crypto-accent mr-3"/> Reliability News Feed</li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-crypto-accent text-black hover:bg-green-400 transition-colors font-bold shadow-lg shadow-crypto-accent/20">
            Upgrade Now
          </button>
        </div>

        {/* WHALE PLAN */}
        <div className="bg-crypto-card border border-purple-500/30 rounded-2xl p-8 flex flex-col hover:border-purple-500/50 transition-colors">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-purple-400 flex items-center"><Crown size={20} className="mr-2"/> Institutional</h3>
            <p className="text-4xl font-bold text-white mt-2">$199 <span className="text-sm font-normal text-gray-500">/mo</span></p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-purple-400 mr-3"/> All Pro Features</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-purple-400 mr-3"/> API Access</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-purple-400 mr-3"/> Dedicated Account Manager</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-purple-400 mr-3"/> Custom ESG Reports</li>
            <li className="flex items-center text-sm text-gray-300"><Check size={16} className="text-purple-400 mr-3"/> 1-on-1 Strategy Calls</li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600/30 transition-colors font-bold">
            Contact Sales
          </button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
