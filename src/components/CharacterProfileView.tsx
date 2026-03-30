import React, { useState, useRef } from 'react';
import { 
  User, 
  Heart, 
  Zap, 
  Shield, 
  AlertCircle, 
  MoreHorizontal, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Circle,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  Globe,
  Layers,
  Upload,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { cn } from '../lib/utils';
import { Character } from '../types';

export const CharacterProfileView = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('Elias Vance');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Character | null>(null);
  const [traitsInput, setTraitsInput] = useState("");

  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: 'Elias Vance', role: 'Protagonist', description: 'Former Intelligence Officer / Private Investigator', traits: ['Stoic', 'Analytical', 'Protective'], connections: [] },
    { id: '2', name: 'Sarah Vance', role: 'Daughter', description: 'Missing daughter of Elias', traits: ['Creative', 'Brave', 'Curious'], connections: [] },
    { id: '3', name: 'Arthur Thorne', role: 'Antagonist', description: 'Leader of The Silent Echo', traits: ['Manipulative', 'Ambitious', 'Vengeful'], connections: [] },
    { id: '4', name: 'Detective Miller', role: 'Ally', description: 'Old friend in the police force', traits: ['Loyal', 'Cynical', 'Experienced'], connections: [] },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          const newCharacters = Array.isArray(parsed) ? parsed : [parsed];
          // Basic validation
          const validCharacters = newCharacters.filter(c => c.name && c.role).map(c => ({
            id: c.id || Math.random().toString(36).substr(2, 9),
            name: c.name,
            role: c.role,
            description: c.description || '',
            traits: Array.isArray(c.traits) ? c.traits : (typeof c.traits === 'string' ? c.traits.split(',').map((t: string) => t.trim()) : []),
            connections: Array.isArray(c.connections) ? c.connections : []
          }));
          
          if (validCharacters.length > 0) {
            setCharacters(prev => [...prev, ...validCharacters]);
            setSelectedCharacter(validCharacters[0].name);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file format.');
        }
      } else if (file.name.endsWith('.csv')) {
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const validCharacters = results.data
              .filter((row: any) => row.name && row.role)
              .map((row: any) => ({
                id: row.id || Math.random().toString(36).substr(2, 9),
                name: row.name,
                role: row.role,
                description: row.description || '',
                traits: row.traits ? row.traits.split(',').map((t: string) => t.trim()) : [],
                connections: [] // CSV connections are harder to parse simply, leaving empty for now
              }));

            if (validCharacters.length > 0) {
              setCharacters(prev => [...prev, ...validCharacters]);
              setSelectedCharacter(validCharacters[0].name);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file.');
          }
        });
      } else {
        alert('Unsupported file type. Please upload a JSON or CSV file.');
      }
      
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const activeChar = characters.find(c => c.name === selectedCharacter) || characters[0];

  const handleEdit = () => {
    setEditForm(activeChar);
    setTraitsInput(activeChar.traits ? activeChar.traits.join(', ') : '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      const updatedForm = {
        ...editForm,
        traits: traitsInput.split(',').map(t => t.trim()).filter(Boolean)
      };
      setCharacters(characters.map(c => c.id === updatedForm.id ? updatedForm : c));
      setSelectedCharacter(updatedForm.name);
    }
    setIsEditing(false);
    setEditForm(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const plotBeats = [
    { id: '1', title: 'The Mysterious Package', chapter: 'Chapter 1', status: 'Draft' },
    { id: '2', title: 'Flashback: The Night of Disappearance', chapter: 'Chapter 2', status: 'Draft' },
    { id: '3', title: 'Meeting at the Old Pier', chapter: 'Chapter 3', status: 'Outline' },
  ];

  return (
    <div className="h-full flex bg-white overflow-hidden">
      {/* Character List (Left Sidebar) */}
      <aside className="w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/50">
        <div className="p-6 border-b border-zinc-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Characters</h3>
            <div className="flex gap-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".json,.csv" 
                className="hidden" 
              />
              <button 
                onClick={triggerFileInput}
                disabled={isImporting}
                title="Import Characters (CSV/JSON)"
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-ink transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button onClick={() => alert("Manual character creation coming soon! Use the import button for now.")} className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-ink transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search characters..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                setSelectedCharacter(char.name);
                setIsEditing(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group",
                selectedCharacter === char.name ? "bg-white border border-zinc-200 shadow-sm text-ink" : "text-zinc-500 hover:bg-zinc-100"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors",
                selectedCharacter === char.name ? "bg-accent/10 border-accent/20" : "bg-zinc-100 border-zinc-200"
              )}>
                <User className={cn("w-5 h-5", selectedCharacter === char.name ? "text-accent" : "text-zinc-300")} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{char.name}</p>
                <p className="text-xs text-zinc-400 truncate">{char.role}</p>
              </div>
              <ChevronRight className={cn(
                "ml-auto w-4 h-4 shrink-0 transition-all",
                selectedCharacter === char.name ? "text-accent translate-x-0" : "text-zinc-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              )} />
            </button>
          ))}
        </div>
      </aside>

      {/* Profile Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        <div className="p-12 space-y-12 max-w-5xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-[40px] bg-zinc-100 border-4 border-zinc-50 flex items-center justify-center overflow-hidden shadow-xl shadow-zinc-200/50 shrink-0">
                <User className="w-16 h-16 text-zinc-300" />
              </div>
              <div className="space-y-2">
                {isEditing && editForm ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="text-4xl font-display font-bold text-ink bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-accent/20 w-full max-w-sm"
                        placeholder="Character Name"
                      />
                      <input 
                        type="text" 
                        value={editForm.role} 
                        onChange={e => setEditForm({...editForm, role: e.target.value})}
                        className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 w-40"
                        placeholder="Role"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-display font-bold text-ink">{activeChar.name}</h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">{activeChar.role}</span>
                  </div>
                )}
                
                {!(isEditing && editForm) && (
                  <p className="text-zinc-500 text-lg font-medium">{activeChar.description || 'No description provided.'}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Age: Unknown</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Location: Unknown</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Status: Active</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="px-4 py-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600 font-bold text-sm">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-ink text-white hover:bg-zinc-800 rounded-xl transition-colors font-bold text-sm shadow-md shadow-ink/20">Save</button>
                </>
              ) : (
                <>
                  <button onClick={handleEdit} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400 hover:text-ink"><Edit3 className="w-5 h-5" /></button>
                  <button onClick={() => alert("Share feature coming soon!")} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400 hover:text-ink"><Share2 className="w-5 h-5" /></button>
                  <button onClick={() => alert("Delete character coming soon!")} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors text-zinc-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </>
              )}
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Biography & Traits */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-display font-bold flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-accent" /> Biography
                </h3>
                <div className="serif-content text-zinc-600 space-y-4">
                  {isEditing && editForm ? (
                    <textarea 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full h-40 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-ink font-serif outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                      placeholder="Write the character's biography..."
                    />
                  ) : (
                    <p>
                      {activeChar.description || 'Biography details have not been added for this character yet.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" /> Key Traits & Flaws
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Traits</h4>
                    <div className="space-y-2">
                      {isEditing && editForm ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Traits (comma separated)"
                            value={traitsInput}
                            onChange={e => setTraitsInput(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20"
                          />
                          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Separate with commas</p>
                        </div>
                      ) : (
                        activeChar.traits && activeChar.traits.length > 0 ? (
                          activeChar.traits.map(trait => (
                            <div key={trait} className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> {trait}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-zinc-400 italic">No traits defined.</p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Weaknesses</h4>
                    <div className="space-y-2">
                      {/* Placeholder for weaknesses, assuming traits covers both for now or needs separate field */}
                      <p className="text-sm text-zinc-400 italic">Not specified.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Stats & Connections */}
            <div className="space-y-8">
              <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl shadow-zinc-900/20">
                <h3 className="text-xl font-display font-bold mb-6">Character Stats</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Intelligence', value: 92, color: 'bg-blue-500' },
                    { label: 'Empathy', value: 45, color: 'bg-purple-500' },
                    { label: 'Willpower', value: 88, color: 'bg-orange-500' },
                    { label: 'Social', value: 30, color: 'bg-green-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-zinc-400">{stat.label}</span>
                        <span className="text-white">{stat.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          className={cn("h-full rounded-full", stat.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-accent" /> Relationships
                </h3>
                <div className="space-y-4">
                  {activeChar.connections && activeChar.connections.length > 0 ? (
                    activeChar.connections.map((rel, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                          <Heart className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{rel.targetId}</p>
                          <p className="text-xs text-zinc-400">{rel.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400 italic">No connections defined.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Plot Beats */}
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-display font-bold flex items-center gap-3">
                <Layers className="w-5 h-5 text-purple-500" /> Connected Plot Beats
              </h3>
              <button onClick={() => alert("Plot beats view coming soon!")} className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plotBeats.map((beat) => (
                <div key={beat.id} onClick={() => alert(`Opening plot beat: ${beat.title}`)} className="p-6 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{beat.chapter}</span>
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded text-[10px] font-bold uppercase tracking-wider">{beat.status}</span>
                  </div>
                  <h4 className="font-bold text-zinc-900 group-hover:text-accent transition-colors">{beat.title}</h4>
                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2">Elias receives a package that changes everything...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
