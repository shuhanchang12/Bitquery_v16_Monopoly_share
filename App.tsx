
import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, GraduationCap, TrendingUp, Menu, X, Zap, Gamepad2, CreditCard, Presentation } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import EducationDeck from './components/EducationDeck';
import BitPoly from './components/BitPoly';
import Pricing from './components/Pricing';
import DemoPage from './components/DemoPage';

// Replaced enum with const object for better compatibility across transpilers
const VIEWS = {
  DASHBOARD: 'DASHBOARD',
  CHAT: 'CHAT',
  LEARN: 'LEARN',
  GAME: 'GAME',
  PRICING: 'PRICING',
  DEMO: 'DEMO'
} as const;

type ViewType = typeof VIEWS[keyof typeof VIEWS];

export default function App() {
  // Changed default view to GAME as requested
  const [currentView, setCurrentView] = useState<ViewType>(VIEWS.GAME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-gradient-to-r from-crypto-accent/20 to-crypto-purple/20 text-white border-l-4 border-crypto-accent' 
          : 'text-gray-400 hover:bg-crypto-card hover:text-white'
      }`}
    >
      <Icon size={20} className={`mr-3 ${currentView === view ? 'text-crypto-accent' : 'group-hover:text-white'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-crypto-dark text-white overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-crypto-card border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Zap className="text-crypto-accent fill-crypto-accent" />
          <span className="font-bold text-lg tracking-wider">BITQUERY</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:relative z-50 w-64 h-full bg-crypto-card/50 backdrop-blur-xl border-r border-gray-800 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-crypto-accent/10 p-2 rounded-lg">
            <Zap className="text-crypto-accent w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wide">BITQUERY</h1>
            <p className="text-xs text-gray-500 font-mono">v2.0.4 • BETA</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Project Information</p>
          <NavItem view={VIEWS.DEMO} icon={Presentation} label="Project Demo" />

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4 mt-6">Gamification</p>
          <NavItem view={VIEWS.GAME} icon={Gamepad2} label="BitPoly (Start Here)" />
          
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4 mt-6">Platform</p>
          <NavItem view={VIEWS.DASHBOARD} icon={LayoutDashboard} label="Market Overview" />
          <NavItem view={VIEWS.CHAT} icon={MessageSquare} label="AI Consultant" />
          <NavItem view={VIEWS.LEARN} icon={GraduationCap} label="Bitquery Academy" />
          <NavItem view={VIEWS.PRICING} icon={CreditCard} label="Pro Plans" />
        </nav>

        <div className="p-4 m-4 bg-gradient-to-br from-crypto-purple/20 to-blue-900/20 rounded-2xl border border-white/5">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-crypto-success w-4 h-4" />
            <span className="text-xs font-bold text-crypto-success">Join us</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Join 1B+ users mastering the market with Gemini 2.5.</p>
          <button 
            onClick={() => setCurrentView(VIEWS.PRICING)}
            className="w-full py-2 text-xs font-bold bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-60px)] md:h-screen overflow-y-auto relative flex flex-col">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-crypto-accent/5 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-crypto-purple/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {currentView === VIEWS.DASHBOARD && <Dashboard onNavigateChat={() => setCurrentView(VIEWS.CHAT)} language={language} setLanguage={setLanguage} onNavigatePricing={() => setCurrentView(VIEWS.PRICING)} />}
          {currentView === VIEWS.CHAT && <ChatInterface />}
          {currentView === VIEWS.LEARN && <EducationDeck />}
          {currentView === VIEWS.GAME && <BitPoly language={language} />}
          {currentView === VIEWS.PRICING && <Pricing />}
          {currentView === VIEWS.DEMO && <DemoPage />}
        </div>

        {/* Global Footer Disclaimer */}
        <div className="relative z-20 border-t border-white/5 bg-black/40 backdrop-blur-md py-4 px-8 text-center mt-auto">
            <p className="text-[10px] text-gray-500">
                DISCLAIMER: Bitquery is an educational and simulation platform powered by AI. 
                All market analysis, trading signals, and simulations are for entertainment purposes only and do not constitute financial advice. 
                Cryptocurrency trading involves significant risk. Always conduct your own research before investing.
            </p>
        </div>
      </main>
    </div>
  );
}
