import React from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const BibleView = () => {
  const manuscripts = [
    { id: '1', title: 'The Silent Echo', status: 'editing', progress: 75, wordCount: '82,400', target: '110,000' },
    { id: '2', title: 'Vance: Origins', status: 'draft', progress: 30, wordCount: '24,150', target: '80,000' },
    { id: '3', title: 'The Gilded Cage', status: 'published', progress: 100, wordCount: '105,000', target: '100,000' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-ink">The Vance Chronicles</h1>
          <p className="text-zinc-500 mt-2">Series Architecture & Universe Bible</p>
        </div>
        <button onClick={() => alert("Add manuscript coming soon!")} className="flex items-center gap-2 bg-ink text-white px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add Manuscript
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manuscript Status */}
        <div className="md:col-span-2 bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Manuscript Status</h3>
            <button onClick={() => alert("More options coming soon!")} className="text-zinc-400 hover:text-ink"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            {manuscripts.map((m) => (
              <div key={m.id} onClick={() => alert(`Opening manuscript: ${m.title}`)} className="group p-4 rounded-2xl border border-zinc-50 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {m.status === 'published' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-300" />
                    )}
                    <span className="font-semibold text-zinc-900">{m.title}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                    m.status === 'published' ? "bg-green-50 text-green-600" : 
                    m.status === 'editing' ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-600"
                  )}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      className={cn(
                        "h-full rounded-full",
                        m.status === 'published' ? "bg-green-500" : "bg-accent"
                      )}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{m.wordCount} / {m.target} words</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-accent text-white rounded-3xl p-6 shadow-lg shadow-accent/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-accent-foreground/60 text-sm font-medium uppercase tracking-wider mb-1">Total Word Count</p>
              <h2 className="text-4xl font-display font-bold">211,550</h2>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg mb-4">Upcoming Milestones</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Beta Reader Launch</p>
                  <p className="text-xs text-zinc-400">April 15, 2026</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Final Polish Deadline</p>
                  <p className="text-xs text-zinc-400">May 20, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universe Map Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden h-[400px]">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-display font-bold">Nexus Map</h3>
              <button onClick={() => alert("Nexus Map view coming soon! Use the sidebar navigation.")} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-400 max-w-xs">Explore character relationships and plot threads in the Vance universe.</p>
            
            {/* Visual placeholder for the map */}
            <div className="flex-1 mt-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full" />
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-orange-500 rounded-full" />
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <line x1="33%" y1="25%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4" />
                <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4" />
                <line x1="66%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-2xl font-display font-bold mb-6">Series Timeline</h3>
          <div className="flex-1 space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
            {[
              { year: '1984', event: 'The Vance Incident', type: 'Major Event' },
              { year: '1992', event: 'Elias Vance Disappears', type: 'Inciting Incident' },
              { year: '2008', event: 'The Silent Echo Begins', type: 'Current Timeline' },
            ].map((item, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{item.year}</span>
                <h4 className="font-bold text-zinc-900">{item.event}</h4>
                <p className="text-sm text-zinc-500">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
