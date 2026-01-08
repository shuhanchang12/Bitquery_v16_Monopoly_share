
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Search, Activity, ShieldAlert, RefreshCcw, TrendingUp, MessageCircle, ExternalLink, ListFilter, Cloud, X, Network, Copy, Wallet, Users, ArrowRight, Play, Pause, Bot, Terminal, Settings, Brain, Gamepad2, Info, LogIn, Check, Globe, HelpCircle, BookOpen, ChevronDown, Anchor, AlertTriangle, FileText, Server, Leaf, ShieldCheck, Zap, Heart, UserPlus, XCircle, Lock, Send, BarChart2 } from 'lucide-react';
import { Coin, UserProfile, NewsItem, WhaleTransaction, ESGReport, AssetBackground, TraderProfile } from '../types';
import { getMarketAnalysis, getBitcoinXAnalysis, getEntityGraphData, generateTradingBotAnalysis, analyzeWalletPortfolio, getAssetDeepDive, getMultiAgentAnalysis, sendChatMessage } from '../services/gemini';

// Mock Data Generator
const generateMockData = (trend: 'up' | 'down', timeframe: string) => {
  const data = [];
  let points = 24;
  let startVal = trend === 'up' ? 45000 : 3000;
  
  if (timeframe === '1H') points = 60;
  if (timeframe === '1D') points = 24;
  if (timeframe === '1W') points = 7;
  if (timeframe === '1Y') points = 12;

  let val = startVal;
  for (let i = 0; i < points; i++) {
    const volatility = timeframe === '1H' ? 50 : timeframe === '1Y' ? 5000 : 500;
    const change = Math.random() * (trend === 'up' ? volatility * 2 : volatility) - volatility;
    val += change;
    
    let label = `${i}`;
    if (timeframe === '1H') label = `${i}m`;
    if (timeframe === '1D') label = `${i}:00`;
    if (timeframe === '1W') label = `Day ${i+1}`;
    if (timeframe === '1Y') label = `Month ${i+1}`;

    data.push({ time: label, value: val });
  }
  return data;
};

// Mock User for Wallet Connection
const DEFAULT_USER: UserProfile = {
    id: 'u1',
    name: 'CryptoWhale_99',
    walletAddress: '0x71C...39A2',
    assets: [
        { symbol: 'ETH', name: 'Ethereum', amount: 4.5, valueUsd: 12825, pnl: 12.5, allocation: 60, suggestedAllocation: 40 },
        { symbol: 'USDC', name: 'USD Coin', amount: 5000, valueUsd: 5000, pnl: 0, allocation: 25, suggestedAllocation: 30 },
        { symbol: 'PEPE', name: 'Pepe', amount: 15000000, valueUsd: 150, pnl: -20, allocation: 1, suggestedAllocation: 0 },
        { symbol: 'UNI', name: 'Uniswap', amount: 200, valueUsd: 1800, pnl: 5, allocation: 9, suggestedAllocation: 10 }
    ],
    riskProfile: 'Balanced'
};

const MOCK_NEWS: NewsItem[] = [
    { id: '1', headline: "SEC hints at Ethereum ETF approval this week", source: "Bloomberg", reliabilityScore: 92, sentiment: 'positive', timestamp: '10m ago' },
    { id: '2', headline: "Major exchange halts withdrawals amid liquidity fears", source: "CryptoTwitter (Unverified)", reliabilityScore: 35, sentiment: 'negative', timestamp: '1h ago' },
    { id: '3', headline: "Solana network upgrade promises 10x speed", source: "Solana Foundation", reliabilityScore: 98, sentiment: 'positive', timestamp: '2h ago' },
    { id: '4', headline: "Bitcoin Halving effect analyzed by JP Morgan", source: "Reuters", reliabilityScore: 89, sentiment: 'neutral', timestamp: '3h ago' },
    { id: '5', headline: "New Meme coin rugs $20M", source: "OnChain Detective", reliabilityScore: 95, sentiment: 'negative', timestamp: '4h ago' },
];

const MOCK_WHALES: WhaleTransaction[] = [
    { id: '1', coin: 'BTC', amount: '250.5 BTC', value: '$15.2M', from: 'Unknown Wallet', to: 'Binance', type: 'Sell', timestamp: '2m ago' },
    { id: '2', coin: 'ETH', amount: '5,000 ETH', value: '$14.1M', from: 'Coinbase', to: '0x4f...92a', type: 'Buy', timestamp: '5m ago' },
    { id: '3', coin: 'USDT', amount: '50,000,000 USDT', value: '$50M', from: 'Tether Treasury', to: 'Kraken', type: 'Transfer', timestamp: '12m ago' },
    { id: '4', coin: 'SOL', amount: '150,000 SOL', value: '$22M', from: 'Unknown', to: 'Unknown', type: 'Transfer', timestamp: '15m ago' },
    { id: '5', coin: 'PEPE', amount: '1T PEPE', value: '$1.2M', from: 'Binance', to: 'Wintermute', type: 'Buy', timestamp: '18m ago' },
    { id: '6', coin: 'BTC', amount: '1,000 BTC', value: '$60M', from: 'Mt Gox', to: 'Unknown', type: 'Transfer', timestamp: '20m ago' },
];

const MOCK_TRADERS: TraderProfile[] = [
    { id: '1', name: 'AlphaSeeker', handle: '@alphaseek', winRate: 78, pnl: 450, riskScore: 8, strategy: 'Trend Following', followers: '12.5k' },
    { id: '2', name: 'DegenKing', handle: '@yolocrypto', winRate: 45, pnl: 1200, riskScore: 9.5, strategy: 'High Lev Scalping', followers: '8.2k' },
    { id: '3', name: 'SafeHaven', handle: '@stablesonly', winRate: 92, pnl: 15, riskScore: 2, strategy: 'Arbitrage', followers: '45k' },
    { id: '4', name: 'MacroMike', handle: '@macro_mike', winRate: 65, pnl: 120, riskScore: 5, strategy: 'Swing Trading', followers: '102k' },
];

interface DashboardProps {
  onNavigateChat: () => void;
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  onNavigatePricing: () => void;
}

const MOCK_COINS: Coin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 98450.20, change24h: 2.4, marketCap: '1.9T', volume: '45B', trend: [] },
  { symbol: 'ETH', name: 'Ethereum', price: 2850.10, change24h: -1.2, marketCap: '350B', volume: '18B', trend: [] },
  { symbol: 'SOL', name: 'Solana', price: 145.80, change24h: 5.7, marketCap: '65B', volume: '4B', trend: [] },
  { symbol: 'XRP', name: 'Ripple', price: 2.40, change24h: 0.5, marketCap: '90B', volume: '2B', trend: [] },
];

// Custom Interactive Word Cloud Component
interface Word {
    text: string;
    weight: number;
    sentiment: string;
}

interface SentimentWordCloudProps {
    words: Word[];
    onExpand: (word: string) => void;
}

const SentimentWordCloud = ({ words, onExpand }: SentimentWordCloudProps) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 p-4 h-full items-center content-center">
            {words.map((w, idx) => {
                let colorClass = 'text-gray-400 border-gray-700/50 bg-gray-800/30';
                if (w.sentiment === 'positive') colorClass = 'text-crypto-success border-crypto-success/30 bg-crypto-success/10';
                if (w.sentiment === 'negative') colorClass = 'text-crypto-danger border-crypto-danger/30 bg-crypto-danger/10';
                if (w.sentiment === 'neutral') colorClass = 'text-blue-300 border-blue-300/30 bg-blue-500/10';

                // Moderate scale: 0.7 to 1.1 max
                const scale = 0.75 + (w.weight * 0.04);

                return (
                    <div 
                        key={idx}
                        className={`flex items-center gap-1 pl-3 pr-1 py-1 rounded-full border transition-all duration-300 hover:scale-105 ${colorClass}`}
                        style={{ transform: `scale(${scale})` }}
                    >
                        <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(w.text + ' crypto news analysis')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold hover:underline underline-offset-2 cursor-pointer text-xs md:text-sm"
                            title="Search Resources"
                        >
                            {w.text}
                        </a>
                        <div className="w-[1px] h-3 bg-current opacity-20 mx-1"></div>
                        <button 
                            onClick={() => onExpand(w.text)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            title="View Entity Graph & Copy Trade"
                        >
                            <Network size={12} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

// Entity Graph Component (Mind Map)
const EntityGraph = ({ topic, onClose }: { topic: string, onClose: () => void }) => {
    const [graphData, setGraphData] = useState<{nodes: any[], edges: any[]} | null>(null);
    const [copyStatus, setCopyStatus] = useState(false);

    useEffect(() => {
        const fetchGraph = async () => {
            const data = await getEntityGraphData(topic);
            setGraphData(data);
        }
        fetchGraph();
    }, [topic]);

    const handleCopyTrade = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
    };

    return (
        <div className="w-full h-[600px] mt-6 bg-crypto-dark/50 rounded-xl border border-crypto-accent/30 shadow-2xl flex flex-col overflow-hidden relative animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-crypto-card to-crypto-dark">
                <div>
                    <div className="flex items-center space-x-2 text-crypto-accent mb-1">
                        <Network size={18} />
                        <span className="text-xs font-bold tracking-wider">INTELLIGENCE MIND MAP</span>
                    </div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        Tracking: <span className="text-white/90 underline decoration-crypto-accent underline-offset-4">{topic}</span>
                        <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(topic + ' crypto analysis')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-normal bg-white/10 px-2 py-1 rounded-lg hover:bg-white/20 text-gray-300 flex items-center no-underline"
                        >
                            View Sources <ExternalLink size={10} className="ml-1"/>
                        </a>
                    </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 relative bg-[#0B0E14] overflow-hidden border-r border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
                    {graphData ? (
                        <div className="relative w-full h-full">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-pulse-slow">
                                <div className="w-28 h-28 bg-crypto-accent/10 rounded-full flex items-center justify-center border-2 border-crypto-accent shadow-[0_0_40px_rgba(0,229,255,0.2)] backdrop-blur-md">
                                    <span className="text-sm font-bold text-center px-2 text-white">{topic}</span>
                                </div>
                            </div>
                            {graphData.nodes.filter(n => n.type !== 'Main').map((node, idx) => {
                                const totalNodes = graphData.nodes.length - 1;
                                const angle = (idx / totalNodes) * 2 * Math.PI;
                                const radius = 200; 
                                const top = `calc(50% + ${Math.sin(angle) * radius}px)`;
                                const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
                                const Icon = node.type === 'Wallet' ? Wallet : node.type === 'Influencer' ? Users : Activity;
                                const colorInfo = node.type === 'Wallet' 
                                    ? { border: 'border-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10' } 
                                    : node.type === 'Influencer' 
                                        ? { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/10' }
                                        : { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10' };
                                return (
                                    <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer" style={{ top, left }}>
                                        <div className="absolute top-1/2 left-1/2 w-[200px] h-[1px] bg-gradient-to-r from-crypto-accent/20 to-transparent origin-left -z-10" 
                                            style={{ transform: `rotate(${angle + Math.PI}rad) translate(0px, -50%)` }}></div>
                                        <div className={`w-16 h-16 rounded-full border ${colorInfo.border} ${colorInfo.bg} ${colorInfo.text} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor]`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="mt-3 bg-black/80 px-3 py-1.5 rounded-lg text-[10px] text-gray-300 border border-white/10 backdrop-blur-sm font-mono">
                                            {node.label}
                                        </div>
                                        {node.type === 'Wallet' && (
                                            <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="bg-crypto-success text-black text-[10px] font-bold px-2 py-1 rounded flex items-center">
                                                    <Copy size={8} className="mr-1"/> Copy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                            <div className="w-10 h-10 border-2 border-crypto-accent border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs tracking-widest uppercase">Scanning Blockchain Entities...</p>
                        </div>
                    )}
                </div>
                <div className="w-64 bg-crypto-card/50 backdrop-blur-xl p-6 border-l border-white/5 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Actions</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-crypto-success/10 to-transparent border border-crypto-success/20">
                            <h4 className="text-white font-bold mb-1 flex items-center"><TrendingUp size={16} className="mr-2 text-crypto-success"/> Strategy</h4>
                            <p className="text-xs text-gray-400 mb-3">Smart money flow detected. Bullish accumulation pattern.</p>
                            <button 
                                onClick={handleCopyTrade}
                                disabled={copyStatus}
                                className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center transition-all shadow-lg ${
                                    copyStatus 
                                    ? 'bg-green-500 text-black scale-95' 
                                    : 'bg-crypto-success hover:bg-green-400 text-black'
                                }`}
                            >
                                {copyStatus ? (
                                    <>
                                        <Activity size={16} className="mr-2 animate-bounce" /> Executed!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} className="mr-2" /> Copy Trade
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <h4 className="text-gray-300 font-bold mb-2 text-xs uppercase">Resource Links</h4>
                            <div className="space-y-2">
                                <a href="#" className="block text-xs text-blue-400 hover:text-blue-300 flex items-center">
                                    <ExternalLink size={10} className="mr-2" /> On-Chain Analysis
                                </a>
                                <a href="#" className="block text-xs text-blue-400 hover:text-blue-300 flex items-center">
                                    <ExternalLink size={10} className="mr-2" /> Whale Alert Logs
                                </a>
                                <a href="#" className="block text-xs text-blue-400 hover:text-blue-300 flex items-center">
                                    <ExternalLink size={10} className="mr-2" /> Twitter Sentiment
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TradingBotSimulation = ({ language, onNavigatePricing }: { language: 'en' | 'zh', onNavigatePricing: () => void }) => {
    const [config, setConfig] = useState({ strategy: 'Momentum Scalp', risk: 'Moderate', capital: 5000 });
    const [isRunning, setIsRunning] = useState(false);
    const [metrics, setMetrics] = useState({ pnl: 0, winRate: 0, drawdown: 0, tradeCount: 0, sharpe: 0, profitFactor: 0 });
    const [logs, setLogs] = useState<string[]>([]);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [runCount, setRunCount] = useState(0);
    const MAX_FREE_RUNS = 2;
  
    useEffect(() => {
      let interval: any;
      if (isRunning) {
        setAnalysis(null);
        interval = setInterval(() => {
          setMetrics(prev => {
            const riskMult = config.risk === 'High' ? 2.5 : config.risk === 'Moderate' ? 1.5 : 0.8;
            const baseVol = 50; 
            const outcome = Math.random();
            const isWin = outcome > 0.38;
            const change = isWin ? (Math.random() * baseVol * riskMult) : -(Math.random() * baseVol * riskMult * 0.8);
            const newPnl = prev.pnl + change;
            const newTrades = prev.tradeCount + 1;
            const currentWins = (prev.winRate / 100) * prev.tradeCount;
            const newWins = currentWins + (isWin ? 1 : 0);
            const inferenceDelay = (1.1 + Math.random() * 0.1).toFixed(2);
            const newLog = `${new Date().toLocaleTimeString()} | Vertex AI Infer: ${inferenceDelay}s | ${isWin ? 'BUY-SIG HIT' : 'SELL-SIG HIT'} | ${change > 0 ? '+' : ''}${change.toFixed(2)}`;
            setLogs(curr => [newLog, ...curr].slice(0, 6));
            return {
              pnl: newPnl,
              winRate: (newWins / newTrades) * 100,
              drawdown: change < 0 ? prev.drawdown + (Math.random() * 0.4) : Math.max(0, prev.drawdown - 0.15),
              tradeCount: newTrades,
              sharpe: 2.1 + (Math.random() * 0.6), 
              profitFactor: 1.4 + (Math.random() * 0.8) 
            };
          });
        }, 1200);
      }
      return () => clearInterval(interval);
    }, [isRunning, config]);

    const handleStartSim = () => {
        if (runCount >= MAX_FREE_RUNS) return;
        setRunCount(prev => prev + 1);
        setIsRunning(true);
    };
  
    const handleRunAnalysis = async () => {
        if (metrics.tradeCount === 0) return;
        setIsAnalyzing(true);
        const report = await generateTradingBotAnalysis(metrics, logs, config, language);
        setAnalysis(report);
        setIsAnalyzing(false);
    };

    return (
      <div className="bg-crypto-card border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
              <Server size={120} className="text-crypto-accent" />
          </div>
          {runCount >= MAX_FREE_RUNS && !isRunning && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                  <div className="bg-crypto-accent/20 p-4 rounded-full mb-4 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                      <Lock size={40} className="text-crypto-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Vertex AI Instance Limit</h3>
                  <p className="text-gray-400 mb-6 max-w-md">You've used your {MAX_FREE_RUNS} free simulation runs for today. Upgrade to Pro for unlimited Vertex AI model training.</p>
                  <button 
                    onClick={onNavigatePricing}
                    className="px-8 py-3 bg-crypto-accent text-black font-bold rounded-xl hover:bg-green-400 transition-all shadow-lg hover:scale-105"
                  >
                      Upgrade to Pro
                  </button>
              </div>
          )}
          <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center">
                <div className="p-2 bg-crypto-accent/20 rounded-lg mr-3 border border-crypto-accent/30">
                    <Server className="text-crypto-accent" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         {language === 'zh' ? 'Vertex AI 算法模擬器' : 'Vertex AI Strategy Simulator'}
                         <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded border border-white/10">v2.0 Stable</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                        {language === 'zh' ? '利用 Google Vertex AI 預測引擎執行回測' : 'Backtest high-frequency strategies using Vertex AI inference engines.'}
                    </p>
                </div>
              </div>
          </div>
          <div className="mb-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl relative z-10">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Zap size={20} className="text-blue-400 animate-pulse" />
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold text-blue-300 mb-0.5">Active Quant Model: Vertex-Q4-Momentum</h4>
                      <p className="text-xs opacity-70">Model optimized for sub-second volatility capture and recursive risk management.</p>
                  </div>
              </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col">
                  <h4 className="text-sm font-bold text-gray-400 flex items-center"><Settings size={14} className="mr-2"/> Configuration</h4>
                  <div>
                      <label className="text-xs text-gray-500 block mb-1">Model Architecture</label>
                      <select 
                          disabled={isRunning}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-crypto-accent outline-none bg-black"
                          value={config.strategy}
                          onChange={(e) => setConfig({...config, strategy: e.target.value})}
                      >
                          <option>Vertex RNN-Momentum</option>
                          <option>Transformer-Trend</option>
                          <option>Bayesian-Arbitrage</option>
                          <option>RL-Scalping v2</option>
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs text-gray-500 block mb-1">Leverage Type</label>
                          <select 
                              disabled={isRunning}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-crypto-accent outline-none bg-black"
                              value={config.risk}
                              onChange={(e) => setConfig({...config, risk: e.target.value})}
                          >
                              <option>Conservative</option>
                              <option>Moderate</option>
                              <option>High (Quant)</option>
                              <option>Degen (No SL)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs text-gray-500 block mb-1">Initial Cap ($)</label>
                          <input 
                              type="number" 
                              disabled={isRunning}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-crypto-accent outline-none"
                              value={config.capital}
                              onChange={(e) => setConfig({...config, capital: parseInt(e.target.value)})}
                          />
                      </div>
                  </div>
                  <div className="flex-1"></div>
                  <button 
                      onClick={() => isRunning ? setIsRunning(false) : handleStartSim()}
                      className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${
                          isRunning 
                          ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
                          : 'bg-crypto-accent text-black hover:bg-green-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      }`}
                  >
                      {isRunning ? <><Pause size={16} className="mr-2"/> Terminate Instance</> : <><Play size={16} className="mr-2"/> Deploy AI Agent</>}
                  </button>
                  {!isRunning && metrics.tradeCount > 0 && (
                     <button 
                         onClick={handleRunAnalysis}
                         disabled={isAnalyzing}
                         className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center transition-all bg-crypto-purple/20 text-crypto-purple border border-crypto-purple/50 hover:bg-crypto-purple/30 animate-fade-in mt-2"
                     >
                         {isAnalyzing ? (
                             <><RefreshCcw size={16} className="mr-2 animate-spin"/> Gemini Auditing...</>
                         ) : (
                             <><Brain size={16} className="mr-2"/> Request Quant Audit (Gemini)</>
                         )}
                     </button>
                  )}
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/5 relative">
                        <p className="text-xs text-gray-500 mb-1">Total PnL</p>
                        <p className={`text-2xl font-mono font-bold ${metrics.pnl >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                            {metrics.pnl >= 0 ? '+' : ''}{metrics.pnl.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-500 mb-1">Sharpe Ratio</p>
                        <p className="text-2xl font-mono font-bold text-indigo-400">
                            {metrics.tradeCount > 0 ? metrics.sharpe.toFixed(2) : '0.00'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-500 mb-1">Profit Factor</p>
                        <p className="text-2xl font-mono font-bold text-crypto-accent">
                            {metrics.tradeCount > 0 ? metrics.profitFactor.toFixed(2) : '0.00'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-500 mb-1">Win Rate</p>
                        <p className="text-2xl font-mono font-bold text-white">
                            {metrics.winRate.toFixed(1)}%
                        </p>
                    </div>
                </div>
                <div className="bg-black rounded-xl border border-gray-800 font-mono text-[10px] p-4 flex flex-col h-48">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                        <span className="text-crypto-accent font-bold flex items-center"><Terminal size={12} className="mr-2"/> Vertex AI Prediction Logs</span>
                        <span className="text-gray-600">Model Instance: TPU-v3-8</span>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-0 overflow-y-auto space-y-1.5 custom-scrollbar">
                            {logs.length === 0 && <span className="text-gray-600 italic">Waiting for deployment...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="flex items-center text-gray-400 border-l border-crypto-accent/20 pl-2">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {analysis && (
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 animate-fade-in relative">
                         <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                             <Bot size={20} className="text-indigo-300" />
                             <h4 className="font-bold text-indigo-200">Gemini Strategy Review</h4>
                         </div>
                         <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                             {analysis}
                         </div>
                         <button onClick={() => setAnalysis(null)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"><X size={16} /></button>
                    </div>
                )}
              </div>
          </div>
      </div>
    );
  }

const TechnicalAnalysisHub = ({ coinName, language }: { coinName: string, language: string }) => {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<string | null>(null);
    const [answering, setAnswering] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            setAnalysis(null);
            const data = await getMultiAgentAnalysis(coinName, language);
            setAnalysis(data);
            setLoading(false);
        };
        fetchAnalysis();
    }, [coinName, language]);

    const handleAsk = async () => {
        if (!question.trim()) return;
        setAnswering(true);
        const context = `Analysis: ${JSON.stringify(analysis)}`;
        const response = await sendChatMessage([{role: 'user', parts:[{text: `Context: ${context}. Question: ${question}`}]}], question);
        setAnswer(response.text);
        setAnswering(false);
        setQuestion('');
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/30 to-crypto-card border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-indigo-200 font-bold flex items-center gap-2 text-lg">
                    <Search size={20} /> Technical Consensus Hub
                </h3>
                <div className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded backdrop-blur-md border border-indigo-500/20 flex items-center">
                    <Users size={14} className="mr-2"/> Multi-Agent System
                </div>
            </div>
            <div className="flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                        <div className="h-24 bg-white/5 rounded-lg"></div>
                        <div className="h-24 bg-white/5 rounded-lg"></div>
                        <div className="h-24 bg-white/5 rounded-lg"></div>
                        <div className="h-24 bg-white/5 rounded-lg"></div>
                    </div>
                ) : analysis ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                <p className="text-xs text-blue-400 font-bold uppercase mb-2 flex items-center"><Activity size={12} className="mr-1"/> Technical</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{analysis.technical}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                <p className="text-xs text-purple-400 font-bold uppercase mb-2 flex items-center"><Globe size={12} className="mr-1"/> Macro</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{analysis.macro}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
                                <p className="text-xs text-green-400 font-bold uppercase mb-2 flex items-center"><Anchor size={12} className="mr-1"/> On-Chain</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{analysis.onchain}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-pink-500/30 transition-colors">
                                <p className="text-xs text-pink-400 font-bold uppercase mb-2 flex items-center"><Heart size={12} className="mr-1"/> Sensation</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{analysis.sensation || "Analyzing social sentiment..."}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-crypto-accent/10 to-transparent p-3 rounded-lg border-l-4 border-crypto-accent flex items-center justify-between">
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Consensus Verdict</span>
                            <span className="text-lg text-crypto-accent font-bold">{analysis.verdict}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-sm py-10">Analysis unavailable.</div>
                )}
                <div className="mt-4 pt-4 border-t border-white/10">
                    {answer && (
                        <div className="bg-indigo-500/10 p-4 rounded-xl text-sm text-indigo-200 mb-4 border border-indigo-500/20">
                            <span className="font-bold block mb-1">AI Answer:</span>
                            {answer}
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <input 
                            type="text" 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask specific question about the analysis..." 
                            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button 
                            onClick={handleAsk}
                            disabled={answering || !analysis}
                            className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            {answering ? <RefreshCcw size={18} className="animate-spin"/> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TraderMatch = ({ onNavigatePricing }: { onNavigatePricing: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [action, setAction] = useState<'follow' | 'skip' | null>(null);
    const currentTrader = MOCK_TRADERS[currentIndex];
    const handleSwipe = (direction: 'left' | 'right') => {
        setAction(direction === 'left' ? 'skip' : 'follow');
        setTimeout(() => {
            setAction(null);
            setCurrentIndex(prev => (prev + 1) % MOCK_TRADERS.length);
        }, 400);
    };
    return (
        <div className="bg-gradient-to-b from-crypto-card to-gray-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center">
                    <Users size={18} className="mr-2 text-crypto-accent" /> Top 10 Traders
                </h3>
                <span className="text-[10px] bg-crypto-accent/20 text-crypto-accent px-2 py-1 rounded font-bold">PRO</span>
            </div>
            <div className="flex-1 relative flex flex-col items-center justify-center p-2">
                {currentTrader && (
                    <div 
                        className={`w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform ${
                            action === 'skip' ? '-translate-x-[150%] -rotate-12 opacity-0' : 
                            action === 'follow' ? 'translate-x-[150%] rotate-12 opacity-0' : 
                            'translate-x-0 rotate-0 opacity-100'
                        }`}
                    >
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                             <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-800 rounded-full border-4 border-crypto-card flex items-center justify-center text-4xl shadow-xl">
                                 🧑‍🚀
                             </div>
                        </div>
                        <div className="pt-14 px-6 pb-8 text-center">
                            <h4 className="text-2xl font-bold text-white mb-1">{currentTrader.name}</h4>
                            <p className="text-xs text-gray-500 mb-6">{currentTrader.handle} • {currentTrader.followers} followers</p>
                            <div className="flex justify-center gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-crypto-success">+{currentTrader.pnl}%</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">PnL</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-400">{currentTrader.winRate}%</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Win Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-500">{currentTrader.riskScore}/10</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Risk</div>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Strategy</span>
                                <span className="block text-sm font-bold text-white mt-1">{currentTrader.strategy}</span>
                            </div>
                            <div className="flex gap-4 mb-6">
                                <button 
                                    onClick={() => handleSwipe('left')}
                                    className="flex-1 py-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors group"
                                >
                                    <XCircle size={32} className="group-hover:scale-110 transition-transform"/>
                                </button>
                                <button 
                                    onClick={() => handleSwipe('right')}
                                    className="flex-1 py-4 rounded-xl bg-crypto-success text-black hover:bg-green-400 flex items-center justify-center transition-colors font-bold shadow-lg shadow-green-500/20 group"
                                >
                                    <UserPlus size={32} className="mr-2 group-hover:scale-110 transition-transform" /> Follow
                                </button>
                            </div>
                            <button 
                                onClick={onNavigatePricing}
                                className="w-full py-4 rounded-xl bg-crypto-purple/20 border border-crypto-purple/50 text-crypto-purple hover:bg-crypto-purple/30 flex items-center justify-center transition-colors text-sm font-bold hover:scale-105 active:scale-95"
                            >
                                <Copy size={18} className="mr-2" /> Copy Strategy ($29/mo)
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-2">Swipe right to track, Upgrade to Copy</p>
        </div>
    );
}

export default function Dashboard({ onNavigateChat, language, setLanguage, onNavigatePricing }: DashboardProps) {
  const [selectedCoin, setSelectedCoin] = useState(MOCK_COINS[0]);
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [chartData, setChartData] = useState(generateMockData('up', '1D'));
  const [xAnalysis, setXAnalysis] = useState<{markdownReport: string, wordCloud: any[], sources: any[]} | null>(null);
  const [loadingX, setLoadingX] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showBeginnerMode, setShowBeginnerMode] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletAnalysis, setWalletAnalysis] = useState<string | null>(null);
  const [analyzingWallet, setAnalyzingWallet] = useState(false);
  const [assetDeepDive, setAssetDeepDive] = useState<{background: AssetBackground, esg: ESGReport} | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart'|'background'|'esg'>('chart');

  useEffect(() => {
    setChartData(generateMockData(selectedCoin.change24h >= 0 ? 'up' : 'down', chartTimeframe));
    fetchAssetDeepDive(selectedCoin.name);
  }, [selectedCoin, chartTimeframe]);

  useEffect(() => {
      fetchXTrends();
  }, [language]);

  const fetchXTrends = async () => {
      setLoadingX(true);
      const result = await getBitcoinXAnalysis(language);
      setXAnalysis(result);
      setLoadingX(false);
  }

  const fetchAssetDeepDive = async (coinName: string) => {
      setLoadingDeepDive(true);
      const data = await getAssetDeepDive(coinName, language);
      setAssetDeepDive(data);
      setLoadingDeepDive(false);
  }

  const handleConnectWallet = async () => {
      setUser(DEFAULT_USER);
      setAnalyzingWallet(true);
      const report = await analyzeWalletPortfolio(DEFAULT_USER.assets, language);
      setWalletAnalysis(report);
      setAnalyzingWallet(false);
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              Market Overview
              {showBeginnerMode && <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">GAME MODE: ON</span>}
          </h2>
          <p className="text-gray-400">Real-time global market cap: <span className="text-crypto-success font-mono">$3.12T (+1.2%)</span></p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button 
             onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
             className="flex items-center px-4 py-2 bg-crypto-card border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
             <Globe size={16} className="mr-2" /> {language === 'en' ? 'EN' : '中文'}
          </button>
          <button 
             onClick={() => setShowBeginnerMode(!showBeginnerMode)}
             className={`flex items-center px-4 py-2 border rounded-lg text-sm transition-colors ${showBeginnerMode ? 'bg-purple-900/50 border-purple-500 text-white' : 'bg-crypto-card border-gray-700 text-gray-400'}`}
          >
             <Gamepad2 size={16} className="mr-2" /> {showBeginnerMode ? 'BitPoly ON' : 'BitPoly OFF'}
          </button>
          <button onClick={fetchXTrends} className="flex items-center px-4 py-2 bg-crypto-card border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors">
            <RefreshCcw size={16} className={`mr-2 ${loadingX ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/20 to-crypto-card border border-blue-500/30 rounded-2xl p-6 animate-fade-in relative overflow-hidden">
           <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/20 rounded-full">
                       <ShieldCheck className="text-blue-400" size={20} />
                   </div>
                   <div>
                        <h3 className="text-lg font-bold text-white flex items-center">
                            Portfolio Risk Guardian
                            <span className="ml-2 text-[10px] bg-crypto-accent text-black px-1.5 py-0.5 rounded font-bold">PRO</span>
                        </h3>
                        <p className="text-xs text-gray-400">AI-Powered Asset Allocation & Risk Auditing</p>
                   </div>
               </div>
               {!user && (
                    <button onClick={handleConnectWallet} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-bold shadow-lg transition-all">
                        <Wallet size={16} className="mr-2" /> Simulate Connect Wallet
                    </button>
               )}
           </div>
           {user ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="col-span-2 space-y-4">
                       {analyzingWallet ? (
                           <div className="flex items-center space-x-2 text-blue-300 animate-pulse p-4">
                               <RefreshCcw className="animate-spin" size={16} />
                               <span>Analyzing holdings via Gemini 2.5...</span>
                           </div>
                       ) : (
                           <>
                                <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                                    {walletAnalysis}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                                        <div className="flex items-center">
                                            <div className="flex-1 h-2 bg-gray-700 rounded-full mr-2">
                                                <div className="h-full bg-yellow-500 rounded-full" style={{width: '65%'}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-yellow-500">65/100</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Exposure</p>
                                        <span className="text-sm font-bold text-white">Heavy on Layer 1s</span>
                                    </div>
                                </div>
                           </>
                       )}
                   </div>
                   <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                       <p className="text-xs text-gray-500 uppercase mb-2 flex items-center justify-between">
                           <span>Current vs Suggested</span>
                           <Info size={12} />
                       </p>
                       <div className="space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar">
                           {user.assets.map((a) => (
                               <div key={a.symbol} className="text-sm">
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-gray-300">{a.symbol}</span>
                                       <span className={`text-[10px] ${(a.suggestedAllocation || 0) > a.allocation ? 'text-green-400' : 'text-red-400'}`}>
                                           {(a.suggestedAllocation || 0) > a.allocation ? 'Underweight' : 'Overweight'}
                                       </span>
                                   </div>
                                   <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
                                       <div className="h-full bg-blue-500" style={{width: `${a.allocation}%`}}></div>
                                       <div className="h-full bg-green-500/50" style={{width: `${Math.max(0, (a.suggestedAllocation || 0) - a.allocation)}%`}}></div>
                                   </div>
                                   <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                                       <span>{a.allocation}%</span>
                                       <span>Target: {a.suggestedAllocation}%</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           ) : (
               <div className="bg-black/20 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                   <ShieldAlert size={40} className="text-gray-600 mb-2"/>
                   <p className="text-gray-400">Connect a wallet to receive an AI Risk Audit.</p>
               </div>
           )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-crypto-card border border-white/5 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="flex border-b border-white/10">
              <button onClick={() => setActiveTab('chart')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'chart' ? 'border-crypto-accent text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}>
                  <Activity size={16} className="mr-2" /> Price Action
              </button>
              <button onClick={() => setActiveTab('background')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'background' ? 'border-purple-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}>
                  <BookOpen size={16} className="mr-2" /> Asset Background
              </button>
              <button onClick={() => setActiveTab('esg')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'esg' ? 'border-green-500 text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}>
                  <Leaf size={16} className="mr-2" /> ESG & Controversy <span className="ml-2 text-[10px] bg-crypto-accent text-black px-1 rounded font-bold">PRO</span>
              </button>
          </div>
          <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${selectedCoin.symbol === 'BTC' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                     <img src={`https://ui-avatars.com/api/?name=${selectedCoin.symbol}&background=random&color=fff`} alt={selectedCoin.symbol} className="w-6 h-6 rounded-full"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">{selectedCoin.name} <span className="text-sm text-gray-500 font-mono">/ USD</span></h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-mono font-bold">${selectedCoin.price.toLocaleString()}</span>
                      <span className={`flex items-center text-sm font-bold px-2 py-0.5 rounded ${selectedCoin.change24h >= 0 ? 'bg-crypto-success/10 text-crypto-success' : 'bg-crypto-danger/10 text-crypto-danger'}`}>
                        {selectedCoin.change24h >= 0 ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                        {Math.abs(selectedCoin.change24h)}%
                      </span>
                    </div>
                  </div>
                </div>
                {activeTab === 'chart' && (
                    <div className="flex space-x-2">
                        {['1H', '1D', '1W', '1Y'].map(tf => (
                            <button key={tf} onClick={() => setChartTimeframe(tf)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${chartTimeframe === tf ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:bg-white/5'}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                )}
              </div>
              {activeTab === 'chart' && (
                  <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedCoin.change24h >= 0 ? '#00D68F' : '#FF3B30'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={selectedCoin.change24h >= 0 ? '#00D68F' : '#FF3B30'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" vertical={false} />
                        <XAxis dataKey="time" stroke="#4B5563" tick={{fontSize: 12}} tickMargin={10} />
                        <YAxis stroke="#4B5563" tick={{fontSize: 12}} domain={['auto', 'auto']} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#151A25', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: selectedCoin.change24h >= 0 ? '#00D68F' : '#FF3B30' }}/>
                        <Area type="monotone" dataKey="value" stroke={selectedCoin.change24h >= 0 ? '#00D68F' : '#FF3B30'} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              )}
              {activeTab === 'background' && (
                  <div className="min-h-[300px] animate-fade-in">
                      {loadingDeepDive ? (
                          <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                              <RefreshCcw className="animate-spin text-purple-500" size={32} />
                              <p className="text-gray-500">Generating asset profile...</p>
                          </div>
                      ) : assetDeepDive ? (
                          <div className="space-y-6">
                              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                  <h4 className="text-purple-400 font-bold mb-2 flex items-center"><FileText size={16} className="mr-2"/> What is it?</h4>
                                  <p className="text-gray-300 leading-relaxed text-sm">{assetDeepDive.background.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                      <h4 className="text-blue-400 font-bold mb-2 flex items-center"><Server size={16} className="mr-2"/> Consensus</h4>
                                      <p className="text-white text-lg font-mono">{assetDeepDive.background.consensus}</p>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                      <h4 className="text-green-400 font-bold mb-2 flex items-center"><Zap size={16} className="mr-2"/> Utility</h4>
                                      <p className="text-white text-lg font-mono">{assetDeepDive.background.utility}</p>
                                  </div>
                              </div>
                          </div>
                      ) : <p className="text-gray-500">No data available.</p>}
                  </div>
              )}
              {activeTab === 'esg' && (
                  <div className="min-h-[300px] animate-fade-in">
                       {loadingDeepDive ? (
                          <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                              <RefreshCcw className="animate-spin text-green-500" size={32} />
                              <p className="text-gray-500">Auditing blockchain history...</p>
                          </div>
                      ) : assetDeepDive ? (
                          <div className="space-y-6">
                              <div className="flex items-center gap-6">
                                  <div className="relative w-32 h-32 flex items-center justify-center">
                                       <svg className="w-full h-full" viewBox="0 0 36 36">
                                            <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                                            <path className={`${assetDeepDive.esg.score > 70 ? 'text-green-500' : assetDeepDive.esg.score > 40 ? 'text-yellow-500' : 'text-red-500'}`} strokeDasharray={`${assetDeepDive.esg.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"/>
                                       </svg>
                                       <div className="absolute flex flex-col items-center">
                                           <span className="text-3xl font-bold text-white">{assetDeepDive.esg.score}</span>
                                           <span className="text-[8px] text-gray-500">ESG SCORE</span>
                                       </div>
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm text-gray-300 italic mb-2">"{assetDeepDive.esg.summary}"</p>
                                      <div className="flex gap-2">
                                          <span className="text-[10px] border border-white/20 px-2 py-1 rounded text-gray-400">Environmental Impact</span>
                                          <span className="text-[10px] border border-white/20 px-2 py-1 rounded text-gray-400">Governance</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  <h4 className="text-sm font-bold text-red-400 flex items-center uppercase tracking-wider"><AlertTriangle size={14} className="mr-2"/> Known Controversies</h4>
                                  {assetDeepDive.esg.controversies.length > 0 ? assetDeepDive.esg.controversies.map((c, i) => (
                                      <div key={i} className="bg-red-900/10 border border-red-500/20 p-3 rounded-lg flex gap-3">
                                          <div className={`w-1 h-full rounded-full ${c.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                          <div>
                                              <div className="flex items-center justify-between mb-1">
                                                  <span className="text-white font-bold text-sm">{c.title}</span>
                                                  <span className="text-[10px] text-gray-500">{c.date}</span>
                                              </div>
                                              <p className="text-xs text-gray-400">{c.description}</p>
                                          </div>
                                      </div>
                                  )) : <p className="text-sm text-gray-500">No major controversies detected in the audit period.</p>}
                              </div>
                          </div>
                      ) : <p className="text-gray-500">No data available.</p>}
                  </div>
              )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-crypto-card border border-white/5 rounded-2xl overflow-hidden relative">
            {showBeginnerMode && <div className="absolute top-2 right-2 z-20 bg-purple-600/20 text-purple-200 text-[10px] px-2 py-0.5 rounded border border-purple-500/30">Property List</div>}
            <div className="p-4 border-b border-white/5"><h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Watchlist</h3></div>
            {MOCK_COINS.map((coin) => (
                <div key={coin.symbol} onClick={() => setSelectedCoin(coin)} className={`p-4 flex justify-between items-center cursor-pointer border-b border-white/5 last:border-0 transition-colors ${selectedCoin.symbol === coin.symbol ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center gap-3"><div className="font-bold">{coin.symbol}</div><div className="text-xs text-gray-400">{coin.name}</div></div>
                    <div className="text-right"><div className="font-mono text-sm">${coin.price.toLocaleString()}</div><div className={`text-xs ${coin.change24h >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>{coin.change24h > 0 ? '+' : ''}{coin.change24h}%</div></div>
                </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-black/40 border-y border-white/10 overflow-hidden py-4 flex items-center space-x-4">
          <div className="bg-crypto-accent/20 text-crypto-accent px-4 py-2 text-sm font-bold rounded-r-lg whitespace-nowrap flex items-center"><Anchor size={16} className="mr-2" /> WHALE TRACKER <span className="ml-2 text-[10px] bg-crypto-accent text-black px-1.5 py-0.5 rounded font-bold">PRO</span></div>
          <div className="flex space-x-12 animate-pulse overflow-x-auto no-scrollbar">
              {MOCK_WHALES.map(tx => (
                  <div key={tx.id} className="flex items-center text-sm space-x-3 whitespace-nowrap min-w-fit">
                      <span className={`font-bold uppercase ${tx.type === 'Buy' ? 'text-green-500' : tx.type === 'Sell' ? 'text-red-500' : 'text-gray-400'}`}>{tx.type}</span>
                      <span className="text-white font-mono text-base">{tx.amount}</span>
                      <span className="text-gray-500 text-xs">({tx.value})</span>
                      <span className="text-gray-500 flex items-center gap-1"><ArrowRight size={12} /> {tx.to}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-crypto-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            {showBeginnerMode && <div className="absolute top-4 left-40 z-20 bg-purple-600/20 text-purple-200 text-xs px-2 py-1 rounded border border-purple-500/30 flex items-center"><Info size={12} className="mr-1" /> Public Opinion (Sentiment)</div>}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-2 rounded-full"><MessageCircle size={20} className="text-blue-400" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">{language === 'zh' ? 'X (Twitter) 輿情中心' : 'X (Twitter) Intelligence Hub'} <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">LIVE</span> <span className="text-[10px] bg-crypto-accent text-black px-1.5 py-0.5 rounded font-bold">PRO</span></h3>
                        <p className="text-xs text-blue-400">{language === 'zh' ? 'AI 驅動的市場敘事與情緒分析' : 'AI-Organized Narrative & Sentiment Analysis'}</p>
                    </div>
                </div>
            </div>
            <div className="mb-6 bg-white/5 rounded-xl p-4 flex items-center justify-between">
                <div><h4 className="text-sm font-bold text-gray-300 mb-1">Market Sensation Meter</h4><p className="text-[10px] text-gray-500">Hype vs. Fear based on 50k+ Tweets</p></div>
                <div className="flex items-center gap-4"><span className="text-xs text-red-400 font-bold">FEAR</span><div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden relative"><div className="absolute top-0 bottom-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full opacity-30"></div><div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] left-[74%]"></div></div><span className="text-xs text-green-400 font-bold">HYPE (74)</span></div>
            </div>
            <div className="relative z-10 mb-6 bg-blue-900/10 border border-blue-500/20 p-5 rounded-xl">
            <h4 className="font-bold text-blue-300 mb-3 flex items-center text-sm uppercase tracking-wider"><Info size={16} className="mr-2"/> {language === 'zh' ? '什麼是情緒雲與心智圖？' : 'What is the Sentiment Cloud & Mind Map?'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                    <p className="mb-2 font-bold text-white flex items-center"><Cloud size={14} className="mr-2 text-blue-400"/> {language === 'zh' ? '情緒雲 (Sentiment Cloud)' : 'Sentiment Cloud'}</p>
                    <p className="opacity-80 leading-relaxed text-xs mb-2">{language === 'zh' ? '這是 AI 實時分析 X (Twitter) 上數萬條討論後的結果。' : 'Real-time AI analysis of thousands of X (Twitter) discussions.'}</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs opacity-70"><li>{language === 'zh' ? '字體越大 = 討論越熱烈' : 'Larger Text = Higher Hype'}</li><li>{language === 'zh' ? '綠色 = 正面情緒 (看漲)' : 'Green = Positive (Bullish)'}</li><li>{language === 'zh' ? '紅色 = 負面情緒 (恐慌)' : 'Red = Negative (Fear/Panic)'}</li></ul>
                </div>
                <div>
                        <p className="mb-2 font-bold text-white flex items-center"><Network size={14} className="mr-2 text-crypto-accent"/> {language === 'zh' ? '智能心智圖 (Intelligence Mind Map)' : 'Intelligence Mind Map'}</p>
                    <p className="opacity-80 leading-relaxed text-xs mb-2">{language === 'zh' ? '點擊雲中的任意關鍵字，AI 會立即生成該主題的關聯網絡。' : 'Click any keyword in the cloud to generate a connection network.'}</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs opacity-70"><li>{language === 'zh' ? '追蹤關聯錢包 (Whales)' : 'Track Related Wallets'}</li><li>{language === 'zh' ? '發現關鍵意見領袖 (KOLs)' : 'Identify Key Influencers'}</li><li>{language === 'zh' ? '無需跳轉頁面，直接在下方顯示' : 'Displays instantly below without leaving the page'}</li></ul>
                </div>
            </div>
        </div>
            <div className="relative z-10">
                {loadingX ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse"><div className="md:col-span-2 space-y-4"><div className="h-4 bg-white/10 rounded w-1/3"></div><div className="h-3 bg-white/5 rounded w-full"></div><div className="h-3 bg-white/5 rounded w-full"></div><div className="h-4 bg-white/10 rounded w-1/3 mt-6"></div><div className="h-3 bg-white/5 rounded w-full"></div></div><div className="h-40 bg-white/5 rounded-xl"></div></div>
                ) : xAnalysis ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2"><div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-light text-sm">{xAnalysis.markdownReport}</div></div>
                        <div className="space-y-4">
                            <div className="bg-black/20 rounded-xl border border-white/5 relative overflow-hidden min-h-[200px]">
                                <div className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 flex items-center z-10 uppercase tracking-widest"><Cloud size={10} className="mr-1" /> Sentiment Cloud</div>
                                <div className="absolute top-2 right-3 text-[9px] text-crypto-accent animate-pulse uppercase tracking-widest">Interactive</div>
                                {xAnalysis.wordCloud && xAnalysis.wordCloud.length > 0 ? (
                                    <SentimentWordCloud words={xAnalysis.wordCloud} onExpand={setSelectedTopic} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-500 italic p-10">No keywords found.</div>
                                )}
                            </div>
                            <div className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-xl p-4 border border-white/5"><p className="text-xs font-bold text-gray-400 mb-2">AI Reliability Score</p><div className="flex items-end gap-2"><span className="text-3xl font-bold text-white">High</span><span className="text-sm text-green-400 mb-1">Verified</span></div><p className="text-[10px] text-gray-500 mt-1">Based on cross-referencing multiple analyst accounts.</p></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500"><p>Unable to retrieve social intelligence data.</p><button onClick={fetchXTrends} className="mt-4 text-blue-400 hover:text-blue-300 text-sm">Try Again</button></div>
                )}
                {selectedTopic && (
                    <div className="mt-8 border-t border-white/10 pt-6 animate-fade-in"><div className="flex items-center text-crypto-accent mb-4 animate-pulse"><ChevronDown className="mr-2" size={20}/><span className="font-bold tracking-wider">{language === 'zh' ? '正在展開心智圖...' : 'Expanding Mind Map...'}</span></div><EntityGraph topic={selectedTopic} onClose={() => setSelectedTopic(null)} /></div>
                )}
            </div>
        </div>
        <div className="flex flex-col gap-6">
            <div className="bg-crypto-card border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
                <h3 className="font-bold text-white mb-4 flex items-center"><ListFilter size={18} className="mr-2 text-crypto-accent"/> Reliability Feed <span className="ml-2 text-[10px] bg-crypto-accent text-black px-1.5 py-0.5 rounded font-bold">PRO</span></h3>
                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                    {MOCK_NEWS.map(news => (
                        <div key={news.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2"><span className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded">{news.source}</span><span className="text-[10px] text-gray-500">{news.timestamp}</span></div>
                            <p className="text-sm font-bold text-gray-200 leading-tight mb-3">{news.headline}</p>
                            <div className="flex items-center justify-between"><div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${news.reliabilityScore > 80 ? 'bg-green-500' : news.reliabilityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div><span className="text-xs font-mono text-gray-400">{news.reliabilityScore}% Verified</span></div>{news.sentiment === 'positive' ? <TrendingUp size={14} className="text-green-500"/> : <TrendingUp size={14} className="text-red-500 rotate-180"/>}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[600px]"><TraderMatch onNavigatePricing={onNavigatePricing} /></div>
        </div>
      </div>
      <TechnicalAnalysisHub coinName={selectedCoin.name} language={language} />
      <TradingBotSimulation language={language} onNavigatePricing={onNavigatePricing} />
    </div>
  );
}
