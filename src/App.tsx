import React, { useState } from 'react';
import { 
  BookOpen, 
  Map as MapIcon, 
  User, 
  BarChart3, 
  Settings, 
  LayoutDashboard, 
  ChevronRight, 
  Search, 
  Bell, 
  Menu,
  PenTool,
  Globe,
  Database,
  Layers,
  Share2,
  Package,
  Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { View } from './types';

// Import views
import { BibleView } from './components/BibleView';
import { NexusMapView } from './components/NexusMapView';
import { CharacterProfileView } from './components/CharacterProfileView';
import { KDPManagerView } from './components/KDPManagerView';
import { AnalyticsView } from './components/AnalyticsView';
import { ManuscriptEditorView } from './components/ManuscriptEditorView';
import { PlotBeatsView } from './components/PlotBeatsView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('bible');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'bible', label: 'Universe Bible', icon: Globe },
    { id: 'map', label: 'Nexus Map', icon: Share2 },
    { id: 'profile', label: 'Characters', icon: User },
    { id: 'plot', label: 'Plot Beats', icon: Film },
    { id: 'editor', label: 'Manuscript', icon: PenTool },
    { id: 'kdp', label: 'KDP Manager', icon: Package },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'bible': return <BibleView />;
      case 'map': return <NexusMapView />;
      case 'profile': return <CharacterProfileView />;
      case 'plot': return <PlotBeatsView />;
      case 'kdp': return <KDPManagerView />;
      case 'analytics': return <AnalyticsView />;
      case 'editor': return <ManuscriptEditorView />;
      default: return <BibleView />;
    }
  };

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r border-zinc-200 bg-white flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-display font-bold text-lg tracking-tight">Billy's Truck</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                currentView === item.id 
                  ? "bg-zinc-100 text-ink" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-ink"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                currentView === item.id ? "text-accent" : "text-zinc-400 group-hover:text-zinc-600"
              )} />
              {isSidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {currentView === item.id && isSidebarOpen && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 bg-accent rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <button onClick={() => alert("Settings coming soon!")} className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:bg-zinc-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcfcfc]">
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-500" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-200 mx-2" />
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span onClick={() => alert("Series overview coming soon!")} className="hover:text-ink cursor-pointer">Series</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-ink font-medium">The Vance Chronicles</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search universe..."
                className="pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
              />
            </div>
            <button onClick={() => alert("No new notifications")} className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-zinc-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
            <div onClick={() => alert("Profile settings coming soon!")} className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 cursor-pointer hover:ring-2 hover:ring-accent/20 transition-all" />
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
