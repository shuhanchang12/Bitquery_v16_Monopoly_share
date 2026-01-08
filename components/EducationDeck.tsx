
import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronRight, Brain, Play, GraduationCap, Headphones, Mic2, FileText, Sparkles, List, Volume2, Network, Video } from 'lucide-react';
import { LearningModule } from '../types';
import { getCryptoConcept, generateNotebookPodcast } from '../services/gemini';

const MODULES: LearningModule[] = [
  { id: '1', title: 'Blockchain Basics', difficulty: 'Beginner', description: 'Understand the digital ledger.', duration: '5 min' },
  { id: '2', title: 'DeFi Explained', difficulty: 'Intermediate', description: 'Decentralized Finance mechanics.', duration: '8 min' },
  { id: '3', title: 'Technical Analysis', difficulty: 'Advanced', description: 'Reading charts like a pro.', duration: '12 min' },
  { id: '4', title: 'Smart Contracts', difficulty: 'Intermediate', description: 'Code that executes itself.', duration: '6 min' },
];

export default function EducationDeck() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [notebookData, setNotebookData] = useState<{script: string, takeaways: string[]} | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'notebook' | 'mindmap' | 'video'>('text');

  const handleStartModule = async (module: LearningModule) => {
    setSelectedModule(module);
    setLoading(true);
    setContent(null);
    setNotebookData(null);
    setActiveTab('text');
    
    const explanation = await getCryptoConcept(module.title);
    setContent(explanation);
    setLoading(false);
  };

  const handleGenerateNotebook = async () => {
    if (!selectedModule) return;
    setLoading(true);
    const data = await generateNotebookPodcast(selectedModule.title);
    setNotebookData(data);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-fade-in">
      
      {/* Course List */}
      <div className="space-y-4">
        <div className="bg-crypto-card p-6 rounded-2xl border border-white/5 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bitquery Academy</h2>
            <p className="text-gray-400 text-sm">Master crypto concepts with AI-powered explanations tailored to your level.</p>
            
            <div className="mt-6 flex items-center space-x-4 text-sm">
                <div className="flex items-center text-crypto-success">
                    <CheckCircle size={16} className="mr-2" />
                    <span>2 Modules Completed</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-crypto-success h-full w-1/2"></div>
                </div>
            </div>
        </div>

        {MODULES.map((module) => (
            <button
                key={module.id}
                onClick={() => handleStartModule(module)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                    selectedModule?.id === module.id
                    ? 'bg-crypto-accent/10 border-crypto-accent'
                    : 'bg-crypto-card border-white/5 hover:border-white/10 hover:bg-white/5'
                }`}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className={`font-bold ${selectedModule?.id === module.id ? 'text-crypto-accent' : 'text-white group-hover:text-crypto-accent'}`}>
                            {module.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                         <span className={`text-[10px] px-2 py-1 rounded border ${
                            module.difficulty === 'Beginner' ? 'border-green-500/30 text-green-500' :
                            module.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-500' :
                            'border-red-500/30 text-red-500'
                        }`}>
                            {module.difficulty}
                        </span>
                        <ChevronRight size={16} className="text-gray-600" />
                    </div>
                </div>
            </button>
        ))}
      </div>

      {/* Content Viewer */}
      <div className="bg-crypto-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col relative min-h-[500px]">
         {selectedModule ? (
             <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-crypto-card to-crypto-dark">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-crypto-accent">LESSON 0{selectedModule.id}</span>
                        <div className="flex space-x-1">
                            <button 
                                onClick={() => setActiveTab('text')}
                                className={`px-3 py-1 rounded text-xs flex items-center transition-colors ${activeTab === 'text' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <FileText size={12} className="mr-1" /> Read
                            </button>
                            <button 
                                onClick={() => setActiveTab('mindmap')}
                                className={`px-3 py-1 rounded text-xs flex items-center transition-colors ${activeTab === 'mindmap' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Network size={12} className="mr-1" /> Mind Map
                            </button>
                            <button 
                                onClick={() => setActiveTab('video')}
                                className={`px-3 py-1 rounded text-xs flex items-center transition-colors ${activeTab === 'video' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Video size={12} className="mr-1" /> Video
                            </button>
                            <button 
                                onClick={() => {
                                    setActiveTab('notebook');
                                    if (!notebookData) handleGenerateNotebook();
                                }}
                                className={`px-3 py-1 rounded text-xs flex items-center transition-colors ${activeTab === 'notebook' ? 'bg-crypto-purple/20 text-crypto-purple border border-crypto-purple/50' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Sparkles size={12} className="mr-1" /> Podcast
                            </button>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedModule.title}</h2>
                </div>
                
                <div className="p-8 flex-1 overflow-y-auto relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-12 h-12 border-4 border-crypto-purple border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-400 animate-pulse">AI is synthesizing content...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'text' && (
                                <div className="prose prose-invert max-w-none animate-fade-in">
                                    <div className="p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg mb-6">
                                        <p className="text-blue-200 text-sm italic">
                                            "The best investment you can make is an investment in yourself." - Warren Buffett
                                        </p>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Brain className="mr-2 text-crypto-purple" size={20} />
                                        Concept Breakdown
                                    </h3>
                                    <p className="text-gray-300 leading-8 text-lg">
                                        {content}
                                    </p>
                                    
                                    <div className="mt-10 flex justify-end">
                                        <button className="flex items-center px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                            Complete Lesson <Play size={16} className="ml-2 fill-black" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'mindmap' && (
                                <div className="animate-fade-in h-full flex flex-col items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
                                    {/* Simple Mind Map Visualization */}
                                    <div className="relative w-full h-[400px]">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                             <div className="bg-crypto-accent/20 border-2 border-crypto-accent text-white font-bold p-4 rounded-full shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                                                 {selectedModule.title}
                                             </div>
                                        </div>
                                        {/* Child Nodes */}
                                        <div className="absolute top-[20%] left-[20%] p-3 bg-white/10 rounded-lg border border-white/20 text-xs">Core Concept</div>
                                        <div className="absolute top-[20%] right-[20%] p-3 bg-white/10 rounded-lg border border-white/20 text-xs">Use Cases</div>
                                        <div className="absolute bottom-[20%] left-[30%] p-3 bg-white/10 rounded-lg border border-white/20 text-xs">History</div>
                                        <div className="absolute bottom-[20%] right-[30%] p-3 bg-white/10 rounded-lg border border-white/20 text-xs">Risks</div>
                                        
                                        {/* Connector Lines (Simulated via SVG) */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="white" strokeWidth="2" />
                                            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="white" strokeWidth="2" />
                                            <line x1="50%" y1="50%" x2="35%" y2="75%" stroke="white" strokeWidth="2" />
                                            <line x1="50%" y1="50%" x2="65%" y2="75%" stroke="white" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4">Interactive AI Mind Map Generated for {selectedModule.title}</p>
                                </div>
                            )}

                            {activeTab === 'video' && (
                                <div className="animate-fade-in h-full flex flex-col items-center">
                                    <div className="w-full aspect-video bg-black rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform z-10">
                                            <Play size={32} className="text-white ml-1" />
                                        </div>
                                        <p className="absolute bottom-4 left-4 text-white font-bold z-10">{selectedModule.title}: Visual Explanation</p>
                                        <p className="absolute bottom-4 right-4 text-xs text-gray-300 z-10 bg-black/50 px-2 py-1 rounded">05:30</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-4 text-center max-w-md">
                                        This video is AI-generated based on the module content. It visualizes key concepts like distributed ledgers and hashing algorithms.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'notebook' && (
                                <div className="animate-fade-in h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <Headphones className="mr-2 text-crypto-purple" size={20} />
                                            Audio Overview
                                        </h3>
                                        {!notebookData && (
                                            <button onClick={handleGenerateNotebook} className="text-xs text-crypto-accent hover:underline">
                                                Regenerate
                                            </button>
                                        )}
                                    </div>

                                    {notebookData ? (
                                        <div className="flex flex-col h-full space-y-6">
                                            
                                            {/* Audio Player Visual */}
                                            <div className="bg-crypto-card border border-white/5 rounded-xl p-4 flex items-center shadow-lg">
                                                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center mr-4 cursor-pointer hover:scale-105 transition-transform">
                                                    <Play size={20} className="ml-1"/>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span className="font-bold text-white">Deep Dive: {selectedModule.title}</span>
                                                        <span>12:04</span>
                                                    </div>
                                                    {/* Fake Waveform */}
                                                    <div className="flex items-center gap-0.5 h-8">
                                                        {Array.from({ length: 40 }).map((_, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="w-1 bg-crypto-purple/50 rounded-full animate-pulse"
                                                                style={{ 
                                                                    height: `${Math.max(20, Math.random() * 100)}%`,
                                                                    animationDelay: `${i * 0.05}s`
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                                                {/* Script Column */}
                                                <div className="lg:col-span-2 bg-black/20 rounded-xl p-6 border border-white/5 overflow-y-auto custom-scrollbar">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                        <Volume2 size={12} className="mr-2"/> Transcript
                                                    </h4>
                                                    <div className="space-y-6 font-mono text-sm">
                                                        {notebookData.script?.split('\n').map((line, idx) => {
                                                            if (!line.trim()) return null;
                                                            const isHost1 = line.startsWith('Alex:');
                                                            return (
                                                                <div key={idx} className={`flex ${isHost1 ? 'justify-start' : 'justify-end'}`}>
                                                                    <div className={`max-w-[90%] p-3 rounded-xl ${isHost1 ? 'bg-blue-900/20 text-blue-200 rounded-tl-none' : 'bg-purple-900/20 text-purple-200 rounded-tr-none'}`}>
                                                                        <span className="block text-[10px] opacity-50 mb-1 uppercase tracking-wider">
                                                                            {isHost1 ? 'Alex' : 'Sarah'}
                                                                        </span>
                                                                        {line.replace(/^(Alex:|Sarah:)/, '')}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Takeaways Column */}
                                                <div className="bg-gradient-to-b from-crypto-card to-black/40 rounded-xl p-6 border border-white/5 overflow-y-auto">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                        <List size={12} className="mr-2"/> Key Takeaways
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {notebookData.takeaways?.map((point, i) => (
                                                            <li key={i} className="text-sm text-gray-300 flex items-start leading-relaxed">
                                                                <span className="text-crypto-accent mr-2 mt-1.5">•</span>
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    
                                                    <div className="mt-8 pt-6 border-t border-white/5">
                                                        <h5 className="text-[10px] text-gray-500 uppercase mb-2">Sources</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Investopedia</span>
                                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">CoinDesk</span>
                                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">Whitepaper</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-40 text-gray-500">
                                            Generating audio overview...
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
             </div>
         ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-50">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <GraduationCap size={40} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Select a module</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">Choose a topic from the left to start your learning journey with Bitquery.</p>
             </div>
         )}
      </div>

    </div>
  );
}
