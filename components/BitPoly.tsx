
import React, { useState, useEffect, useRef } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Coins, AlertTriangle, HelpCircle, Building2, TrendingUp, Skull, Zap, MapPin, X, Trophy, Briefcase, Lock, User, RefreshCw, Shield, ChevronRight, BookOpen, Gamepad2, Lightbulb, Check, Users, Heart, Star, MessageCircle, Send, Bot, Globe, Radio, Medal } from 'lucide-react';
import { GameTile, PlayerState, GameEvent, AIPartner, GameChatMessage, ChatMessage } from '../types';
import { generateGameContent, getBankerAdvice, generateSocialChatResponse, sendChatMessage } from '../services/gemini';

// --- Game Configuration ---
const BOARD_SIZE = 20; 
const INITIAL_BALANCE = 10000;

const TILES: GameTile[] = [
  { id: 0, type: 'START', label: 'GO', subLabel: '+2000 Credits', color: 'bg-green-500' },
  { id: 1, type: 'ASSET', label: 'Bitcoin', subLabel: 'BTC', cost: 1500, assetId: 'BTC', color: 'bg-orange-500' },
  { id: 2, type: 'NEWS', label: 'News Alert', subLabel: 'Fact Check', color: 'bg-blue-500' },
  { id: 3, type: 'ASSET', label: 'Ethereum', subLabel: 'ETH', cost: 1000, assetId: 'ETH', color: 'bg-purple-500' },
  { id: 4, type: 'CHANCE', label: 'Chance', subLabel: 'Whale Move', color: 'bg-pink-500' },
  { id: 5, type: 'JAIL', label: 'REKT Zone', subLabel: 'Just Visiting', color: 'bg-gray-700' },
  { id: 6, type: 'ASSET', label: 'Solana', subLabel: 'SOL', cost: 800, assetId: 'SOL', color: 'bg-indigo-500' },
  { id: 7, type: 'NEWS', label: 'Sentiment', subLabel: 'Check', color: 'bg-blue-500' },
  { id: 8, type: 'ASSET', label: 'Dogecoin', subLabel: 'DOGE', cost: 400, assetId: 'DOGE', color: 'bg-yellow-400' },
  { id: 9, type: 'FATE', label: 'Fate', subLabel: 'Rug Pull?', color: 'bg-red-500' },
  { id: 10, type: 'PARKING', label: 'HODL Mode', subLabel: 'Free Parking', color: 'bg-gray-500' },
  { id: 11, type: 'ASSET', label: 'Cardano', subLabel: 'ADA', cost: 500, assetId: 'ADA', color: 'bg-blue-600' },
  { id: 12, type: 'SENTIMENT', label: 'Fear/Greed', subLabel: 'Index', color: 'bg-teal-500' },
  { id: 13, type: 'ASSET', label: 'Polkadot', subLabel: 'DOT', cost: 600, assetId: 'DOT', color: 'bg-pink-600' },
  { id: 14, type: 'CHANCE', label: 'Chance', subLabel: 'Airdrop?', color: 'bg-pink-500' },
  { id: 15, type: 'JAIL', label: 'Go to REKT', subLabel: 'Bad Trade', color: 'bg-red-700' },
  { id: 16, type: 'ASSET', label: 'Chainlink', subLabel: 'LINK', cost: 700, assetId: 'LINK', color: 'bg-blue-400' },
  { id: 17, type: 'NEWS', label: 'Regulation', subLabel: 'News', color: 'bg-blue-500' },
  { id: 18, type: 'ASSET', label: 'Uniswap', subLabel: 'UNI', cost: 900, assetId: 'UNI', color: 'bg-pink-400' },
  { id: 19, type: 'FATE', label: 'Tax Season', subLabel: 'Pay 10%', color: 'bg-red-500' },
];

const STATIC_FALLBACK_QUIZ: GameEvent = {
  title: "Fast Audit",
  description: "Market speed is essential. Answer quickly.",
  type: "QUIZ",
  question: "What is the consensus mechanism used by Bitcoin?",
  options: ["Proof of Work", "Proof of Stake", "Proof of History"],
  correctAnswer: 0,
  explanation: "Bitcoin uses Proof of Work (PoW) where miners solve complex mathematical puzzles to secure the network."
};

const DiceIcon = ({ num }: { num: number }) => {
  switch(num) {
    case 1: return <Dice1 size={36} />;
    case 2: return <Dice2 size={36} />;
    case 3: return <Dice3 size={36} />;
    case 4: return <Dice4 size={36} />;
    case 5: return <Dice5 size={36} />;
    case 6: return <Dice6 size={36} />;
    default: return <Dice1 size={36} />;
  }
};

const LeaderboardItem = ({ rank, name, balance, avatar }: { rank: number, name: string, balance: string, avatar: string }) => (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
        <div className="flex items-center gap-3">
            <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${rank === 1 ? 'bg-yellow-500 text-black shadow-[0_0_10px_#EAB308]' : rank === 2 ? 'bg-gray-400 text-black' : rank === 3 ? 'bg-orange-600 text-white' : 'text-gray-500 bg-white/5'}`}>
                {rank}
            </span>
            <span className="text-xl group-hover:scale-125 transition-transform">{avatar}</span>
            <span className="text-xs font-bold text-gray-200 truncate max-w-[90px]">{name}</span>
        </div>
        <span className="text-xs font-mono text-crypto-accent font-bold">${balance}</span>
    </div>
);

export default function BitPoly({ language = 'en' }: { language?: 'en' | 'zh' }) {
  const [player, setPlayer] = useState<PlayerState & { _tempSteps?: number }>({
    balance: INITIAL_BALANCE,
    position: 0,
    assets: [],
    isJailed: false,
    jailTurns: 0,
    riskResistance: 10, 
    landlordLevel: 1,
    badges: [],
    gameRulesSeen: false,
    history: ['Session Active. Ready to Roll.'],
    activeAllianceId: undefined
  });

  // PERSONAS - Added USA as requested
  const [socialMessages, setSocialMessages] = useState<GameChatMessage[]>([
    { id: '1', sender: 'Satoshi_San 🇯🇵', text: 'Good morning from Tokyo! Buying BTC.', isAI: true, timestamp: new Date(), avatar: '🏯', color: '#FF4D4D' },
    { id: '2', sender: 'Mei_Crypto 🇹🇼', text: 'TSMC news is driving sentiment in Taipei! 💎', isAI: true, timestamp: new Date(), avatar: '🏙️', color: '#00D68F' },
    { id: '3', sender: 'DubaiMogul 🇦🇪', text: 'Institutional flows are heavy today.', isAI: true, timestamp: new Date(), avatar: '🏜️', color: '#FFC107' },
    { id: '4', sender: 'CryptoCowboy 🇺🇸', text: 'YEEHAW! BTC to 100k! Sending it! 🤠🚀', isAI: true, timestamp: new Date(), avatar: '🦅', color: '#3B82F6' },
    { id: '5', sender: 'K-Crypto 🇰🇷', text: 'Kimchi premium is rising! Fast trades only.', isAI: true, timestamp: new Date(), avatar: '🍜', color: '#3261FF' }
  ]);

  const [robotMessages, setRobotMessages] = useState<ChatMessage[]>([
    { id: 'r1', role: 'model', text: "Bitquery Assistant online. Gemini 3 Pro reasoning enabled. How can I help you make money?", timestamp: new Date() }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [robotInput, setRobotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRobotThinking, setIsRobotThinking] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1402859);

  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [bankerMessage, setBankerMessage] = useState("AI Banker: Connected.");
  const [showEventModal, setShowEventModal] = useState(false);
  const [processingTurn, setProcessingTurn] = useState(false);
  const [showRules, setShowRules] = useState(true);
  
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastResult, setLastResult] = useState<{correct: boolean, msg: string}>({correct: false, msg: ''});

  const [showTradeModal, setShowTradeModal] = useState(false);
  const [activeTradeTile, setActiveTradeTile] = useState<GameTile | null>(null);
  const [currentMarketPrice, setCurrentMarketPrice] = useState(0);

  const socialRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socialRef.current) socialRef.current.scrollTop = socialRef.current.scrollHeight;
    if (robotRef.current) robotRef.current.scrollTop = robotRef.current.scrollHeight;
  }, [socialMessages, robotMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineCount(prev => prev + Math.floor(Math.random() * 200) - 80);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
      setPlayer(prev => ({...prev, history: [...prev.history, msg].slice(-10)}));
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setSocialMessages(prev => [...prev, { id: Date.now().toString(), sender: 'You', text: msg, isAI: false, timestamp: new Date(), avatar: '👤' }]);
    setIsTyping(true);
    const aiResp = await generateSocialChatResponse(msg, player, language);
    setIsTyping(false);
    if (aiResp) setSocialMessages(prev => [...prev, { ...aiResp, id: (Date.now()+1).toString(), isAI: true, timestamp: new Date() }]);
  };

  const handleRobotQuery = async () => {
      if (!robotInput.trim() || isRobotThinking) return;
      const msg = robotInput;
      setRobotInput('');
      setRobotMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, timestamp: new Date() }]);
      setIsRobotThinking(true);
      const resp = await sendChatMessage([], msg);
      setIsRobotThinking(false);
      setRobotMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: resp.text, timestamp: new Date(), sources: resp.sources, isGrounding: resp.sources.length > 0 }]);
  };

  const handleRoll = async () => {
    if (isRolling || processingTurn || showEventModal || showExplanation || showTradeModal) return;
    setIsRolling(true);
    
    // FETCH FAST QUIZ - Forced to English
    const quizPromise = generateGameContent('QUIZ', 'Quick Blockchain Facts', 'en');
    
    let rollResult = 1;
    // Faster animation (400ms total)
    for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 80));
        rollResult = Math.floor(Math.random() * 6) + 1;
        setDice(rollResult);
    }
    
    let quiz = await quizPromise;
    if (!quiz) quiz = STATIC_FALLBACK_QUIZ; // Instant fallback if AI slow

    setIsRolling(false);
    setActiveEvent({
        ...quiz,
        reward: rollResult,
        type: 'QUIZ'
    });
    setPlayer(prev => ({ ...prev, _tempSteps: rollResult }));
    setShowEventModal(true);
  };

  const movePlayer = async (steps: number) => {
    setProcessingTurn(true);
    if (player.isJailed) {
        if (steps >= 4) { 
             addLog(`Escaped REKT Zone!`);
             setPlayer(prev => ({...prev, isJailed: false, jailTurns: 0}));
        } else {
            addLog(`Margin call still active.`);
            setPlayer(prev => ({...prev, jailTurns: prev.jailTurns + 1}));
            setProcessingTurn(false);
            return;
        }
    }

    let newPos = (player.position + steps) % BOARD_SIZE;
    const passedGo = player.position + steps >= BOARD_SIZE;

    setPlayer(prev => ({ ...prev, position: newPos, balance: passedGo ? prev.balance + 2000 : prev.balance }));
    if (passedGo) addLog("+2000 Go Bonus Claimed.");
    
    const tile = TILES[newPos];
    await handleTileEvent(tile);
    const advice = await getBankerAdvice({...player, position: newPos}, language);
    setBankerMessage(advice || "Watching...");
    setProcessingTurn(false);
  };

  const handleTileEvent = async (tile: GameTile) => {
      addLog(`Landed on ${tile.label}`);
      if (tile.type === 'START' || tile.type === 'PARKING') return;
      if (tile.type === 'JAIL' && tile.id === 15) {
          setPlayer(prev => ({...prev, position: 5, isJailed: true}));
          addLog("Liquidation! Forced to REKT Zone.");
          return;
      }
      if (tile.type === 'ASSET') {
          const owned = player.assets.find(a => a.symbol === tile.assetId);
          if (owned) {
              setActiveTradeTile(tile);
              setCurrentMarketPrice(Math.floor((tile.cost || 0) * (0.9 + Math.random() * 0.2)));
              setShowTradeModal(true);
          } else if (player.balance >= (tile.cost || 0)) {
              addLog(`Opp: ${tile.label} ($${tile.cost})`);
          }
      } else {
          // Normal events don't require English-only
          const content = await generateGameContent(tile.type === 'NEWS' ? 'NEWS' : 'CHANCE', 'General', language);
          if (content) { setActiveEvent(content); setShowEventModal(true); }
      }
  };

  const handleEventOption = (idx: number) => {
    if (!activeEvent) return;
    const isCorrect = idx === activeEvent.correctAnswer;
    
    if (activeEvent.type === 'QUIZ') {
        if (isCorrect) {
            setLastResult({ correct: true, msg: "ACCESS GRANTED. MOVE APPROVED." });
        } else {
            setLastResult({ correct: false, msg: "AUDIT FAILED. STAYING AT HUB." });
            setPlayer(prev => {
                const { _tempSteps, ...rest } = prev;
                return rest;
            });
        }
    }
    
    setShowEventModal(false);
    setShowExplanation(true);
  };

  const handleCloseExplanation = () => {
    setShowExplanation(false);
    const steps = player._tempSteps;
    if (steps && lastResult.correct) {
        movePlayer(steps);
    }
    setPlayer(prev => {
        const { _tempSteps, ...rest } = prev;
        return rest;
    });
    setActiveEvent(null);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in relative">
      
      {/* 3-COLUMN TERMINAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* PANE 1: BOARD (Left 6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-crypto-card border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-crypto-accent/20 rounded-xl text-crypto-accent shadow-inner">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">BitCredits</p>
                        <p className="text-2xl font-mono font-bold text-white tracking-tighter">{player.balance.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-l border-white/5 pl-4">
                     <div className="text-right">
                         <p className="text-[10px] text-gray-500 font-bold uppercase">Online</p>
                         <p className="text-xs font-mono text-crypto-success">{onlineCount.toLocaleString()}</p>
                     </div>
                     <div className="p-2.5 bg-white text-black rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                         <DiceIcon num={dice} />
                     </div>
                </div>
            </div>

            <div className="flex-1 bg-crypto-dark relative flex items-center justify-center min-h-[500px] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden group">
                 <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                 <div className="relative w-[500px] h-[500px] border-8 border-crypto-card bg-black/40 rounded-xl shadow-2xl scale-75 md:scale-95 lg:scale-100">
                     <div className="absolute inset-[60px] bg-crypto-card/90 flex flex-col items-center justify-center border border-white/5 rounded-2xl p-6 text-center z-0">
                         <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-crypto-accent to-crypto-purple mb-2 tracking-tighter">BITPOLY</h1>
                         <p className="text-[10px] text-crypto-accent/50 mb-6 font-mono font-bold flex items-center gap-2 uppercase tracking-widest"><Radio size={12} className="animate-pulse"/> Simulation Active</p>
                         <button onClick={handleRoll} disabled={isRolling || showEventModal || showExplanation} className={`px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transition-all ${isRolling ? 'bg-gray-800 text-gray-600 scale-95 cursor-not-allowed' : 'bg-crypto-accent text-black hover:scale-110 active:scale-90 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]'}`}>
                            {isRolling ? 'Processing...' : 'Roll Dice'}
                         </button>
                         <div className="mt-4 text-[10px] text-gray-500 italic">"{bankerMessage}"</div>
                     </div>
                     {TILES.map((tile) => {
                         let top, left;
                         if (tile.id < 6) { top = 'calc(100% - 70px)'; left = `${100 - (tile.id * 16.6) - 16.6}%`; }
                         else if (tile.id < 11) { left = '0%'; top = `${100 - ((tile.id - 5) * 16.6) - 16.6}%`; }
                         else if (tile.id < 16) { top = '0%'; left = `${(tile.id - 10) * 16.6}%`; }
                         else { left = 'calc(100% - 70px)'; top = `${(tile.id - 15) * 16.6}%`; }
                         const isCurrent = player.position === tile.id;
                         return (
                             <div key={tile.id} className={`absolute w-[70px] h-[70px] border border-white/5 bg-[#151A25] flex flex-col items-center justify-between p-1.5 text-[9px] transition-all ${isCurrent ? 'z-20 ring-2 ring-white shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'hover:bg-white/5'}`} style={{ left: tile.id >= 15 ? undefined : left, right: tile.id >= 15 ? 0 : undefined, top, bottom: tile.id < 6 ? 0 : undefined }}>
                                 <div className={`w-full h-2 ${tile.color} rounded-sm opacity-80`}></div>
                                 <span className="font-bold text-gray-300 text-center leading-[1.1]">{tile.label}</span>
                                 <span className="text-gray-500 font-mono text-[8px]">{tile.cost ? `$${tile.cost}` : <Zap size={8}/>}</span>
                                 {isCurrent && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-6 h-6 bg-white rounded-full border-2 border-crypto-accent animate-bounce flex items-center justify-center text-black shadow-lg"><User size={12} /></div></div>}
                             </div>
                         );
                     })}
                 </div>
            </div>
        </div>

        {/* PANE 2: SOCIAL LOUNGE (Mid 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col bg-crypto-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
                <h3 className="text-xs font-black text-white flex items-center gap-2 tracking-widest uppercase"><Globe size={14} className="text-crypto-success"/> Global Lounge</h3>
                <span className="text-[10px] text-crypto-success font-bold flex items-center gap-1 animate-pulse"><Users size={12}/> LIVE</span>
            </div>
            <div ref={socialRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {socialMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold opacity-60 uppercase">{msg.avatar} {msg.sender}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[95%] shadow-sm ${msg.sender === 'You' ? 'bg-crypto-accent text-black font-medium rounded-tr-none' : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'}`} style={msg.color && msg.sender !== 'You' ? { borderLeft: `2px solid ${msg.color}` } : {}}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="text-[9px] text-gray-500 italic ml-2 animate-pulse">Transmitting...</div>}
            </div>
            <div className="p-3 border-t border-white/5 bg-black/20 relative">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} placeholder="Broadcast to network..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-[11px] text-white focus:outline-none focus:border-crypto-success transition-all" />
                <button onClick={handleSendChat} className="absolute right-5 top-1/2 -translate-y-1/2 text-crypto-success hover:scale-125 transition-transform"><Send size={14}/></button>
            </div>
        </div>

        {/* PANE 3: AI & LEADERBOARD (Right 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            {/* TOP: AI ASSISTANT */}
            <div className="flex-1 min-h-0 flex flex-col bg-crypto-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                 <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 tracking-widest uppercase"><Bot size={14} className="text-crypto-purple"/> AI Co-Pilot</h3>
                    <span className="text-[10px] text-crypto-purple font-bold flex items-center gap-1"><Shield size={12}/> PRO</span>
                </div>
                <div ref={robotRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-purple-900/5">
                    {robotMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl text-[11px] leading-relaxed max-w-[95%] shadow-lg border ${msg.role === 'user' ? 'bg-purple-900/40 text-purple-100 border-purple-500/20 rounded-tr-none' : 'bg-gray-900 text-gray-200 border-white/10 rounded-tl-none'}`}>
                                <div className="flex items-center gap-2 mb-1 opacity-50 font-bold uppercase text-[9px]">
                                    {msg.role === 'model' ? <Bot size={10} /> : <User size={10} />}
                                    {msg.role === 'model' ? 'Robot Advisor' : 'You'}
                                </div>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                                        {msg.sources.map((s, i) => (
                                            <a key={i} href={s.uri} target="_blank" rel="noopener" className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-blue-400 hover:bg-white/10 transition-colors">
                                                🔗 {s.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isRobotThinking && <div className="text-[10px] text-purple-400 italic flex items-center gap-2 animate-pulse"><RefreshCw size={12} className="animate-spin"/> Thinking...</div>}
                </div>
                <div className="p-3 border-t border-white/5 bg-black/20 relative">
                    <input value={robotInput} onChange={e => setRobotInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRobotQuery()} placeholder="Ask Robot Strategy..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-[11px] text-white focus:outline-none focus:border-crypto-purple transition-all" />
                    <button onClick={handleRobotQuery} disabled={isRobotThinking} className="absolute right-5 top-1/2 -translate-y-1/2 text-crypto-purple hover:scale-125 disabled:opacity-30 transition-transform"><Send size={14}/></button>
                </div>
            </div>

            {/* BOTTOM: GAME LEADERBOARD */}
            <div className="h-64 flex flex-col bg-crypto-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-white flex items-center gap-2 tracking-widest uppercase"><Medal size={12} className="text-yellow-500"/> Global Ranking</h3>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Season 1</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    <LeaderboardItem rank={1} name="DubaiWhale_1" balance="1.2M" avatar="🐋" />
                    <LeaderboardItem rank={2} name="Satoshi_Ghost" balance="840k" avatar="👻" />
                    <LeaderboardItem rank={3} name="BrazucaGainz" balance="620k" avatar="🦜" />
                    <LeaderboardItem rank={4} name="Degen_Zero" balance="590k" avatar="🚀" />
                    <LeaderboardItem rank={5} name="LondonHedge" balance="450k" avatar="👔" />
                    <div className="pt-2 border-t border-white/5">
                        <LeaderboardItem rank={142} name="You" balance={`${(player.balance/1000).toFixed(1)}k`} avatar="👤" />
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* FOOTER: HISTORY (Bottom Ribbon) */}
      <div className="bg-black/60 border border-white/5 rounded-xl p-3 flex items-center gap-4 overflow-hidden">
          <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Game Logs</div>
          <div className="flex-1 flex gap-8 animate-marquee whitespace-nowrap overflow-hidden">
              {player.history.map((h, i) => (
                  <span key={i} className="text-[11px] text-gray-500 font-mono tracking-tight">• {h}</span>
              ))}
          </div>
      </div>

      {/* MODALS */}
      {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
              <div className="bg-crypto-card max-w-2xl w-full rounded-3xl border border-crypto-accent/30 p-10 shadow-2xl text-center">
                  <div className="flex justify-center mb-6"><div className="p-5 bg-crypto-accent/10 rounded-full border border-crypto-accent/20 animate-pulse"><Radio size={48} className="text-crypto-accent"/></div></div>
                  <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">BITPOLY TERMINAL</h2>
                  <p className="text-gray-400 mb-8 font-medium">1 Billion User Simulation Infrastructure.</p>
                  <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <h4 className="text-crypto-success font-bold text-sm mb-1 flex items-center gap-2 uppercase tracking-widest"><Medal size={14}/> Ranking</h4>
                          <p className="text-[10px] text-gray-400">Climb the leaderboard in a high-stakes global simulation.</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <h4 className="text-crypto-purple font-bold text-sm mb-1 flex items-center gap-2 uppercase tracking-widest"><Zap size={14}/> AI Audit</h4>
                          <p className="text-[10px] text-gray-400">Pass blockchain quizzes to execute your moves.</p>
                      </div>
                  </div>
                  <button onClick={() => setShowRules(false)} className="w-full bg-crypto-accent text-black font-black py-4 rounded-xl hover:bg-green-400 transition-all uppercase tracking-widest shadow-lg">Authenticate Session</button>
              </div>
          </div>
      )}

      {showEventModal && activeEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="bg-crypto-card max-lg w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                  <div className={`p-6 bg-gradient-to-b from-white/10 to-transparent`}>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{activeEvent.title}</h3>
                      <p className="text-gray-400 text-sm">{activeEvent.description}</p>
                  </div>
                  <div className="p-8 space-y-4">
                      {activeEvent.type === 'QUIZ' ? (
                          <>
                              <p className="text-lg font-bold text-white mb-4">{activeEvent.question}</p>
                              {activeEvent.options?.map((opt, idx) => (
                                  <button key={idx} onClick={() => handleEventOption(idx)} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-crypto-accent hover:bg-crypto-accent/10 transition-all text-sm font-medium">{opt}</button>
                              ))}
                          </>
                      ) : (
                          <button onClick={() => setShowEventModal(false)} className="w-full bg-crypto-accent text-black font-bold py-3 rounded-xl uppercase tracking-widest">Execute</button>
                      )}
                  </div>
              </div>
          </div>
      )}

      {showTradeModal && activeTradeTile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-crypto-card max-w-sm w-full rounded-2xl border border-white/10 p-8 text-center">
                <div className="w-20 h-20 bg-crypto-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-crypto-accent/20"><Briefcase size={32} className="text-crypto-accent"/></div>
                <h3 className="text-2xl font-bold text-white mb-2">{activeTradeTile.label}</h3>
                <p className="text-gray-500 text-sm mb-8">Asset Portfolio Management.</p>
                <div className="space-y-3">
                    <button onClick={() => { setPlayer(prev => ({...prev, balance: prev.balance - activeTradeTile.cost!, assets: [...prev.assets, {symbol: activeTradeTile.assetId!, amount: 1, value: activeTradeTile.cost!}]})); setShowTradeModal(false); }} className="w-full bg-crypto-success text-black py-4 rounded-xl font-bold hover:scale-105 transition-transform uppercase tracking-widest">Increase Stake</button>
                    <button onClick={() => { setPlayer(prev => ({...prev, balance: prev.balance + currentMarketPrice, assets: prev.assets.filter(a => a.symbol !== activeTradeTile.assetId)})); setShowTradeModal(false); }} className="w-full bg-crypto-danger text-white py-4 rounded-xl font-bold hover:scale-105 transition-transform uppercase tracking-widest">Liquidate</button>
                    <button onClick={() => setShowTradeModal(false)} className="text-gray-500 text-sm mt-4 hover:text-white uppercase tracking-tighter">Close Terminal</button>
                </div>
            </div>
        </div>
      )}

      {showExplanation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 text-center">
              <div className="max-w-md w-full">
                  <div className={`p-8 rounded-full inline-block mb-6 shadow-2xl ${lastResult.correct ? 'bg-crypto-success/20 text-crypto-success border border-crypto-success/50' : 'bg-crypto-danger/20 text-crypto-danger border border-crypto-danger/50'}`}>
                      {lastResult.correct ? <Check size={64} /> : <X size={64} />}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{lastResult.msg}</h3>
                  <div className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/10 text-left backdrop-blur-md">
                      <h4 className="text-crypto-accent font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-widest"><Lightbulb size={14}/> Audit Insight (詳解)</h4>
                      <p className="text-sm text-gray-300 leading-relaxed italic">{activeEvent?.explanation || 'Knowledge is the strongest asset.'}</p>
                  </div>
                  <button onClick={handleCloseExplanation} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-2xl">Resume Session</button>
              </div>
          </div>
      )}
    </div>
  );
}
