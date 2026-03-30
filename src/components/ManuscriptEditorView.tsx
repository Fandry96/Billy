import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreVertical, 
  Search, 
  Layout, 
  Type, 
  AlignLeft, 
  Bold, 
  Italic, 
  List, 
  Maximize2, 
  Save, 
  Eye,
  Settings,
  Info,
  Layers,
  PenTool,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const ManuscriptEditorView = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'corkboard' | 'outline'>('editor');
  const [selectedFile, setSelectedFile] = useState('Chapter 1: The Encounter');

  const folderStructure = [
    { id: '1', name: 'Front Matter', type: 'folder', children: [
      { id: '1-1', name: 'Title Page', type: 'file' },
      { id: '1-2', name: 'Copyright', type: 'file' },
    ]},
    { id: '2', name: 'Manuscript', type: 'folder', isOpen: true, children: [
      { id: '2-1', name: 'Chapter 1: The Encounter', type: 'file' },
      { id: '2-2', name: 'Chapter 2: Shadows of the Past', type: 'file' },
      { id: '2-3', name: 'Chapter 3: The Cryptic Message', type: 'file' },
    ]},
    { id: '3', name: 'Research', type: 'folder', children: [
      { id: '3-1', name: 'Setting: New Haven', type: 'file' },
      { id: '3-2', name: 'Character: Elias Vance', type: 'file' },
    ]},
    { id: '4', name: 'Trash', type: 'folder', children: [] },
  ];

  const corkboardCards = [
    { id: '1', title: 'Chapter 1', summary: 'Elias Vance receives a mysterious package. He decides to open it despite his better judgment.', status: 'Draft' },
    { id: '2', title: 'Chapter 2', summary: 'A flashback to 15 years ago. The night Sarah disappeared. The rain was relentless.', status: 'Draft' },
    { id: '3', title: 'Chapter 3', summary: 'Elias meets Detective Miller at the old pier. They discuss the new evidence.', status: 'Outline' },
    { id: '4', title: 'Chapter 4', summary: 'The first encounter with Arthur Thorne. A tense standoff in the library.', status: 'Outline' },
  ];

  return (
    <div className="h-full flex bg-white overflow-hidden">
      {/* Binder (Left Sidebar) */}
      <aside className="w-64 border-r border-zinc-100 flex flex-col bg-zinc-50/50">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Binder</span>
          <div className="flex gap-2">
            <button onClick={() => alert("Add item coming soon!")} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-ink"><Plus className="w-4 h-4" /></button>
            <button onClick={() => alert("Search coming soon!")} className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-ink"><Search className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {folderStructure.map((folder) => (
            <div key={folder.id}>
              <button onClick={() => alert("Folder toggle coming soon!")} className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded-lg text-sm font-medium text-zinc-700 group transition-colors">
                {folder.isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                <Folder className="w-4 h-4 text-accent" />
                {folder.name}
              </button>
              {folder.isOpen && folder.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {folder.children.map((file) => (
                    <button 
                      key={file.id}
                      onClick={() => setSelectedFile(file.name)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all",
                        selectedFile === file.name ? "bg-white border border-zinc-200 shadow-sm text-ink font-semibold" : "text-zinc-500 hover:bg-zinc-100"
                      )}
                    >
                      <FileText className={cn("w-4 h-4", selectedFile === file.name ? "text-accent" : "text-zinc-300")} />
                      {file.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-zinc-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Target: 80,000</span>
            <span className="text-[10px] font-bold text-accent">30%</span>
          </div>
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-[30%] h-full bg-accent rounded-full" />
          </div>
        </div>
      </aside>

      {/* Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Editor Toolbar */}
        <header className="h-14 border-b border-zinc-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              {[
                { id: 'editor', icon: AlignLeft, label: 'Editor' },
                { id: 'corkboard', icon: Layout, label: 'Corkboard' },
                { id: 'outline', icon: Layers, label: 'Outline' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    activeTab === tab.id ? "bg-white text-ink shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-zinc-100 pr-4">
              <button onClick={() => alert("Formatting coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><Bold className="w-4 h-4" /></button>
              <button onClick={() => alert("Formatting coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><Italic className="w-4 h-4" /></button>
              <button onClick={() => alert("Formatting coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><List className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => alert("Preview coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500"><Eye className="w-4 h-4" /></button>
              <button onClick={() => alert("Save coming soon!")} className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/30">
          <AnimatePresence mode="wait">
            {activeTab === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto my-12 bg-white shadow-xl shadow-zinc-200/50 border border-zinc-100 min-h-[1000px] p-20 serif-content"
              >
                <h1 className="text-3xl font-display font-bold mb-12 text-center">{selectedFile}</h1>
                <p className="mb-6">
                  The rain hammered against the window of Elias Vance’s office, a rhythmic, relentless sound that matched the thrumming in his head. He stared at the package on his desk—a plain brown box with no return address, just his name written in a hand he hadn’t seen in fifteen years.
                </p>
                <p className="mb-6">
                  His fingers hovered over the tape. He knew he shouldn’t open it. Every instinct he’d honed in the intelligence service screamed at him to walk away, to call the bomb squad, to throw it into the harbor. But the handwriting... it was unmistakable.
                </p>
                <p className="mb-6">
                  "Sarah," he whispered, the name tasting like ash in his mouth.
                </p>
                <p className="mb-6">
                  He reached for the letter opener, his hand steady despite the storm raging inside him. The tape gave way with a sharp, tearing sound. Inside, nestled in a bed of crumpled newspaper, was a single object: a silver locket, tarnished by time but still holding the faint scent of lavender.
                </p>
                <p className="mb-6">
                  Elias felt the air leave the room. He’d given that locket to Sarah on her tenth birthday. She’d been wearing it the night she disappeared.
                </p>
              </motion.div>
            )}

            {activeTab === 'corkboard' && (
              <motion.div 
                key="corkboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {corkboardCards.map((card) => (
                  <div key={card.id} className="bg-[#fff9e6] border border-[#e6d5a3] shadow-md p-6 h-64 flex flex-col group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-bold text-lg text-zinc-800">{card.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/50 rounded border border-zinc-200 text-zinc-500">
                        {card.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 font-serif leading-relaxed flex-1 italic">
                      {card.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                      <span className="text-[10px] font-mono text-zinc-400">WC: 1,240</span>
                      <button onClick={() => alert("More options coming soon!")} className="p-1 hover:bg-white/50 rounded text-zinc-400 group-hover:text-ink transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => alert("Add scene coming soon!")} className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-400 hover:border-accent hover:text-accent transition-all h-64">
                  <Plus className="w-8 h-8" />
                  <span className="font-bold text-sm uppercase tracking-wider">Add Scene</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Inspector (Right Sidebar) */}
      <aside className="w-80 border-l border-zinc-100 flex flex-col bg-white">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Inspector</span>
          <div className="flex gap-1 bg-zinc-100 p-1 rounded-lg">
            <button onClick={() => alert("Info coming soon!")} className="p-1.5 bg-white shadow-sm rounded-md text-ink"><Info className="w-3.5 h-3.5" /></button>
            <button onClick={() => alert("Layers coming soon!")} className="p-1.5 text-zinc-400 hover:text-zinc-600"><Layers className="w-3.5 h-3.5" /></button>
            <button onClick={() => alert("Settings coming soon!")} className="p-1.5 text-zinc-400 hover:text-zinc-600"><Settings className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Synopsis</h4>
            <textarea 
              className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm italic text-zinc-600 focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
              placeholder="Write a brief summary of this scene..."
              defaultValue="Elias Vance receives a mysterious package. He decides to open it despite his better judgment."
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Scene Metadata</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Label</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">Chapter</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold uppercase tracking-wider">First Draft</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">POV</span>
                <span className="text-ink font-semibold">Elias Vance</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Connected Characters</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Elias Vance
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Sarah Vance
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {['Mystery', 'Inciting Incident', 'Rainy Night'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
              <button onClick={() => alert("Add keyword coming soon!")} className="text-[10px] font-bold text-accent uppercase tracking-wider hover:underline">+ Add</button>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Words: 1,240</span>
            <span>Chars: 6,842</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
