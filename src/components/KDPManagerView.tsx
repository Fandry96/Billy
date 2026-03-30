import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  ExternalLink, 
  Upload, 
  BookOpen, 
  Tag, 
  Type, 
  Globe, 
  DollarSign,
  ChevronRight,
  Eye,
  PenTool,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const KDPManagerView = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'metadata' | 'description'>('inventory');

  const books = [
    { id: '1', title: 'The Gilded Cage', format: 'Paperback, eBook', status: 'Live', sales: '$1,240.50', rank: '#12,450' },
    { id: '2', title: 'The Silent Echo', format: 'eBook', status: 'Draft', sales: '$0.00', rank: 'N/A' },
    { id: '3', title: 'Vance: Origins', format: 'eBook', status: 'Pre-order', sales: '$450.20', rank: '#45,120' },
  ];

  const checklist = [
    { task: 'Cover Art (Front/Back/Spine)', status: 'complete' },
    { task: 'Manuscript Formatting (Vellum)', status: 'complete' },
    { task: 'Blurb / Description', status: 'pending' },
    { task: 'Categories & Keywords', status: 'pending' },
    { task: 'Pricing Strategy', status: 'complete' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-ink">KDP Publishing Manager</h1>
          <p className="text-zinc-500 mt-2">Manage your Amazon KDP inventory and metadata.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert("KDP Import coming soon!")} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-600 px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import from KDP
          </button>
          <button onClick={() => alert("New Publication flow coming soon!")} className="flex items-center gap-2 bg-ink text-white px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
            <Package className="w-4 h-4" />
            New Publication
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-zinc-100">
        {['inventory', 'metadata', 'description'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "pb-4 text-sm font-semibold uppercase tracking-wider transition-all relative",
              activeTab === tab ? "text-accent" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'inventory' && (
            <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Book Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Format</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Sales (30d)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-zinc-100 rounded-md border border-zinc-200 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-zinc-300" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900">{book.title}</p>
                            <p className="text-xs text-zinc-400">Rank: {book.rank}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          book.status === 'Live' ? "bg-green-50 text-green-600" :
                          book.status === 'Draft' ? "bg-zinc-100 text-zinc-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-500">{book.format}</td>
                      <td className="px-6 py-5 font-mono text-sm font-semibold text-zinc-900">{book.sales}</td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={() => alert(`More options for ${book.title} coming soon!`)} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-ink">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Book Title
                  </label>
                  <input type="text" defaultValue="The Silent Echo" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <PenTool className="w-3 h-3" /> Subtitle
                  </label>
                  <input type="text" placeholder="Optional subtitle..." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Keywords (7 available)
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
                  {['Mystery', 'Thriller', 'Private Eye', 'Noir', 'Vance Chronicles'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-medium flex items-center gap-2">
                      {tag} <button onClick={() => alert("Remove keyword coming soon!")} className="text-zinc-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                  <button onClick={() => alert("Add keyword coming soon!")} className="px-3 py-1 border border-dashed border-zinc-300 rounded-lg text-xs font-medium text-zinc-400 hover:border-accent hover:text-accent transition-all">+ Add Keyword</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Primary Marketplace
                  </label>
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none transition-all">
                    <option>Amazon.com</option>
                    <option>Amazon.co.uk</option>
                    <option>Amazon.de</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> List Price (USD)
                  </label>
                  <input type="number" defaultValue="4.99" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => alert("Discard changes coming soon!")} className="px-6 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl font-medium hover:bg-zinc-200 transition-colors">Discard Changes</button>
                <button onClick={() => alert("Save metadata coming soon!")} className="px-6 py-2.5 bg-ink text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Metadata
                </button>
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-lg">Book Description (HTML)</h3>
                <div className="flex gap-2">
                  <button onClick={() => alert("Preview description coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => alert("Edit description coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"><PenTool className="w-4 h-4" /></button>
                </div>
              </div>
              <textarea 
                className="w-full h-[400px] p-6 bg-zinc-50 border border-zinc-100 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                defaultValue={`<b>He thought he could leave the past behind. He was wrong.</b>\n\nElias Vance hasn't seen his daughter in fifteen years. But when a cryptic message arrives on his doorstep, he's pulled back into a world of shadows and secrets he thought he'd escaped.\n\n"The Silent Echo" is the gripping first installment in the Vance Chronicles, a series that redefines the modern noir thriller.`}
              />
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Character count: 342 / 4000</span>
                <span>KDP Compatible HTML only</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Checklist */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg mb-6">Publishing Readiness</h3>
            <div className="space-y-4">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.status === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="text-sm font-medium text-zinc-700">{item.task}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Overall Progress</span>
                <span className="text-xs font-bold text-accent">60%</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-accent rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 text-white">
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button onClick={() => alert("KDP Dashboard link coming soon!")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-xl transition-colors group">
                <span className="text-sm">KDP Dashboard</span>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </button>
              <button onClick={() => alert("Book Report link coming soon!")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-xl transition-colors group">
                <span className="text-sm">Book Report (Sales)</span>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </button>
              <button onClick={() => alert("Amazon Author Central link coming soon!")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-xl transition-colors group">
                <span className="text-sm">Amazon Author Central</span>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
