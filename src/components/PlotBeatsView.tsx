import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  MapPin, 
  Users, 
  Clock, 
  AlignLeft,
  GripVertical,
  Edit3,
  Trash2,
  X,
  Bold,
  Italic,
  Heading3,
  List,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '../lib/utils';
import { PlotBeat } from '../types';

// Mock data
const initialBeats: PlotBeat[] = [
  { id: '1', title: 'The Mysterious Package', summary: 'Elias receives a package containing Sarah\'s locket.', characters: ['Elias Vance'], location: 'Elias\'s Office', act: 'Act I', dependencies: [] },
  { id: '2', title: 'Meeting at the Old Pier', summary: 'Elias meets Detective Miller to discuss the new evidence.', characters: ['Elias Vance', 'Detective Miller'], location: 'Old Pier', act: 'Act I', dependencies: ['1'] },
  { id: '3', title: 'The Silent Echo', summary: 'Elias discovers the existence of the underground group.', characters: ['Elias Vance', 'Arthur Thorne'], location: 'Abandoned Library', act: 'Act II', dependencies: ['2'] },
  { id: '4', title: 'Flashback: The Night', summary: 'A flashback to the night Sarah disappeared.', characters: ['Elias Vance', 'Sarah Vance'], location: 'Vance Residence', act: 'Act II', dependencies: [] },
  { id: '5', title: 'The Confrontation', summary: 'Elias confronts Arthur Thorne.', characters: ['Elias Vance', 'Arthur Thorne'], location: 'Thorne\'s Estate', act: 'Act III', dependencies: ['3', '4'] },
];

const acts = ['Act I', 'Act II', 'Act III'];

// We will fetch these from the other views or a shared state in a real app.
// For now, we'll simulate fetching them by defining them here based on the other views' data.
const availableCharacters = [
  'Elias Vance',
  'Sarah Vance',
  'Arthur Thorne',
  'Detective Miller',
  'Marcus Reed',
  'Elena Rossi',
  'The Silent Echo'
];

const availableLocations = [
  'New Haven',
  'Old Pier',
  'Abandoned Library',
  'Vance Residence',
  'Thorne\'s Estate',
  'Elias\'s Office'
];

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-ink font-serif',
      },
    },
  });

  // Update editor content when value changes externally (e.g., when switching beats)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200 w-fit">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-1.5 rounded-md text-sm font-bold transition-colors", editor.isActive('bold') ? 'bg-white shadow-sm text-ink' : 'text-zinc-500 hover:bg-zinc-200')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-1.5 rounded-md text-sm italic font-serif transition-colors", editor.isActive('italic') ? 'bg-white shadow-sm text-ink' : 'text-zinc-500 hover:bg-zinc-200')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn("p-1.5 rounded-md text-sm font-bold transition-colors", editor.isActive('heading', { level: 3 }) ? 'bg-white shadow-sm text-ink' : 'text-zinc-500 hover:bg-zinc-200')}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-1.5 rounded-md text-sm transition-colors", editor.isActive('bulletList') ? 'bg-white shadow-sm text-ink' : 'text-zinc-500 hover:bg-zinc-200')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const AutocompleteInput = ({ 
  value, 
  onChange, 
  suggestions, 
  placeholder, 
  icon: Icon,
  multiple = false
}: { 
  value: string | string[], 
  onChange: (val: any) => void, 
  suggestions: string[], 
  placeholder: string,
  icon: any,
  multiple?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(multiple ? '' : (value as string));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync internal input value with external value for single select
  useEffect(() => {
    if (!multiple) {
      setInputValue(value as string);
    }
  }, [value, multiple]);

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase()) && 
    (!multiple || !(value as string[]).includes(s))
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <Icon className="w-4 h-4 absolute left-3 top-3 text-zinc-400 z-10" />
      {multiple ? (
        <div className="w-full min-h-[46px] pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus-within:ring-2 focus-within:ring-accent/20 transition-all flex flex-wrap gap-2 items-center">
          {(value as string[]).map(item => (
            <span key={item} className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs font-medium">
              {item}
              <button onClick={() => onChange((value as string[]).filter(v => v !== item))} className="text-zinc-400 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 bg-transparent border-none outline-none min-w-[100px]"
            placeholder={(value as string[]).length === 0 ? placeholder : ''}
          />
        </div>
      ) : (
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          placeholder={placeholder}
        />
      )}

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-48 overflow-y-auto"
          >
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  if (multiple) {
                    onChange([...(value as string[]), suggestion]);
                    setInputValue('');
                  } else {
                    setInputValue(suggestion);
                    onChange(suggestion);
                  }
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 text-zinc-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PlotBeatsView = () => {
  const [beats, setBeats] = useState<any[]>(initialBeats);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [beatRects, setBeatRects] = useState<Record<string, {x: number, y: number, width: number, height: number}>>({});
  
  const [linkingStart, setLinkingStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
  const [hoveredBeat, setHoveredBeat] = useState<string | null>(null);

  const updateRects = useCallback(() => {
    if (!boardRef.current) return;
    const board = boardRef.current;
    const newRects: Record<string, {x: number, y: number, width: number, height: number}> = {};
    
    Object.entries(beatRefs.current).forEach(([id, el]) => {
      if (el) {
        let x = 0;
        let y = 0;
        let current: HTMLElement | null = el;
        while (current && current !== board) {
          x += current.offsetLeft;
          y += current.offsetTop;
          current = current.offsetParent as HTMLElement;
        }
        newRects[id] = { x, y, width: el.offsetWidth, height: el.offsetHeight };
      }
    });
    setBeatRects(newRects);
  }, []);

  useEffect(() => {
    updateRects();
    const observer = new ResizeObserver(() => {
      updateRects();
    });
    if (boardRef.current) observer.observe(boardRef.current);
    Object.values(beatRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [beats, updateRects]);

  useEffect(() => {
    if (!linkingStart) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - boardRect.left + boardRef.current.scrollLeft,
        y: e.clientY - boardRect.top + boardRef.current.scrollTop
      });
    };
    
    const handleMouseUp = () => {
      setTimeout(() => {
        setLinkingStart(null);
        setMousePos(null);
      }, 50);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [linkingStart]);

  const handleAddBeat = (act: string) => {
    const newBeat = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Plot Beat',
      summary: 'Describe what happens in this beat...',
      characters: [],
      location: 'Unknown',
      act
    };
    setBeats([...beats, newBeat]);
    setIsEditing(newBeat.id);
    setEditForm(newBeat);
  };

  const handleSaveBeat = () => {
    setBeats(beats.map(b => b.id === editForm.id ? editForm : b));
    setIsEditing(null);
  };

  const handleDeleteBeat = (id: string) => {
    setBeats(beats.filter(b => b.id !== id));
    setIsEditing(null);
  };

  const filteredBeats = beats.filter(beat => 
    beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beat.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#fcfcfc] overflow-hidden">
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -12;
          }
        }
        .animate-dash-flow {
          animation: dash-flow 0.6s linear infinite;
        }
      `}</style>
      {/* Header */}
      <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Plot Beats</h1>
          <p className="text-sm text-zinc-500">Organize and structure your narrative arc.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search beats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-accent/20 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => handleAddBeat('Act I')}
            className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Beat
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-8 relative">
        <div className="flex gap-8 h-full min-w-max relative" ref={boardRef}>
          
          {/* SVG Overlay for Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {beats.flatMap(beat => 
              (beat.dependencies || []).map((depId: string) => {
                const sourceRect = beatRects[depId];
                const targetRect = beatRects[beat.id];
                if (!sourceRect || !targetRect) return null;
                
                const x1 = sourceRect.x + sourceRect.width;
                const y1 = sourceRect.y + sourceRect.height / 2;
                const x2 = targetRect.x;
                const y2 = targetRect.y + targetRect.height / 2;
                
                const dx = Math.abs(x2 - x1) * 0.5;
                const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                
                const isHovered = hoveredBeat === depId || hoveredBeat === beat.id;
                const isFaded = hoveredBeat && !isHovered;
                const strokeColor = isHovered ? '#6366f1' : '#d4d4d8';
                
                return (
                  <g key={`${depId}-${beat.id}`}>
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke={strokeColor} 
                      strokeWidth={isHovered ? "3" : "2"} 
                      strokeDasharray="6 6"
                      className={cn("transition-all duration-300", isHovered && "animate-dash-flow")}
                      style={{ opacity: isFaded ? 0.3 : 1 }}
                    />
                    <polygon 
                      points={`${x2-8},${y2-5} ${x2},${y2} ${x2-8},${y2+5}`} 
                      fill={strokeColor} 
                      className="transition-all duration-300"
                      style={{ opacity: isFaded ? 0.3 : 1 }}
                    />
                  </g>
                );
              })
            )}
            
            {linkingStart && mousePos && beatRects[linkingStart] && (
              <path 
                d={`M ${beatRects[linkingStart].x + beatRects[linkingStart].width} ${beatRects[linkingStart].y + beatRects[linkingStart].height / 2} C ${beatRects[linkingStart].x + beatRects[linkingStart].width + Math.abs(mousePos.x - (beatRects[linkingStart].x + beatRects[linkingStart].width)) * 0.5} ${beatRects[linkingStart].y + beatRects[linkingStart].height / 2}, ${mousePos.x - Math.abs(mousePos.x - (beatRects[linkingStart].x + beatRects[linkingStart].width)) * 0.5} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {acts.map(act => (
            <div key={act} className="w-96 flex flex-col h-full bg-zinc-50/50 rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-ink">{act}</h3>
                <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-xs font-bold">
                  {filteredBeats.filter(b => b.act === act).length} Beats
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {filteredBeats.filter(b => b.act === act).map(beat => {
                    const isHoveredBeat = hoveredBeat === beat.id;
                    const isDependency = hoveredBeat && beats.find(b => b.id === hoveredBeat)?.dependencies?.includes(beat.id);
                    const isDependent = hoveredBeat && beat.dependencies?.includes(hoveredBeat);
                    const isFaded = hoveredBeat && !isHoveredBeat && !isDependency && !isDependent;

                    return (
                    <motion.div
                      key={beat.id}
                      layout
                      ref={(el: HTMLDivElement | null) => { beatRefs.current[beat.id] = el; }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onMouseEnter={() => setHoveredBeat(beat.id)}
                      onMouseLeave={() => setHoveredBeat(null)}
                      className={cn(
                        "bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative z-10 duration-300",
                        linkingStart === beat.id ? "ring-2 ring-accent border-transparent" : "border-zinc-200",
                        isHoveredBeat && !linkingStart ? "ring-2 ring-indigo-500 border-transparent shadow-lg scale-[1.02]" : "",
                        isDependency ? "ring-2 ring-orange-400 border-transparent shadow-md" : "",
                        isDependent ? "ring-2 ring-purple-400 border-transparent shadow-md" : "",
                        isFaded ? "opacity-40 grayscale-[0.5]" : "opacity-100"
                      )}
                      onMouseUp={() => {
                        if (linkingStart && linkingStart !== beat.id) {
                          const updatedBeats = beats.map(b => {
                            if (b.id === beat.id) {
                              const deps = b.dependencies || [];
                              if (!deps.includes(linkingStart)) {
                                return { ...b, dependencies: [...deps, linkingStart] };
                              }
                            }
                            return b;
                          });
                          setBeats(updatedBeats);
                          setLinkingStart(null);
                          setMousePos(null);
                        }
                      }}
                    >
                      {/* Linking Handle */}
                      <div 
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-200 rounded-full cursor-crosshair flex items-center justify-center hover:border-accent hover:text-accent z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setLinkingStart(beat.id);
                        }}
                        title="Drag to link to another beat"
                      >
                        <div className="w-2 h-2 bg-zinc-300 rounded-full hover:bg-accent transition-colors" />
                      </div>

                      {/* Left Link Target Area (visual feedback) */}
                      {linkingStart && linkingStart !== beat.id && (
                        <div className="absolute -left-1 top-0 bottom-0 w-2 bg-accent/20 rounded-l-xl" />
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                          <h4 className="font-bold text-ink leading-tight">{beat.title}</h4>
                        </div>
                        <button 
                          onClick={() => {
                            setIsEditing(beat.id);
                            setEditForm(beat);
                          }}
                          className="p-1 hover:bg-zinc-100 rounded text-zinc-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-zinc-600 mb-4 line-clamp-3 font-serif">
                        {beat.summary}
                      </p>
                      
                      <div className="space-y-2 pt-4 border-t border-zinc-100">
                        {beat.location && (
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            <span className="truncate">{beat.location}</span>
                          </div>
                        )}
                        {beat.characters && beat.characters.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span className="truncate">{beat.characters.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </AnimatePresence>
                
                <button 
                  onClick={() => handleAddBeat(act)}
                  className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 font-bold text-sm hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Beat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <h2 className="text-xl font-display font-bold text-ink">Edit Plot Beat</h2>
                <button 
                  onClick={() => setIsEditing(null)}
                  className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Title</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-ink font-medium focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Act</label>
                  <select 
                    value={editForm.act}
                    onChange={(e) => setEditForm({...editForm, act: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-ink font-medium focus:ring-2 focus:ring-accent/20 outline-none transition-all appearance-none"
                  >
                    {acts.map(act => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Summary</label>
                  <RichTextEditor 
                    value={editForm.summary}
                    onChange={(val) => setEditForm({...editForm, summary: val})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</label>
                    <AutocompleteInput 
                      value={editForm.location}
                      onChange={(val) => setEditForm({...editForm, location: val})}
                      suggestions={availableLocations}
                      placeholder="e.g. The Old Pier"
                      icon={MapPin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Characters</label>
                    <AutocompleteInput 
                      value={editForm.characters}
                      onChange={(val) => setEditForm({...editForm, characters: val})}
                      suggestions={availableCharacters}
                      placeholder="Add character..."
                      icon={Users}
                      multiple={true}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dependencies</label>
                  <AutocompleteInput 
                    value={(editForm.dependencies || []).map((id: string) => beats.find(b => b.id === id)?.title).filter(Boolean)}
                    onChange={(titles: string[]) => {
                      const newDeps = titles.map(title => beats.find(b => b.title === title)?.id).filter(Boolean);
                      setEditForm({...editForm, dependencies: newDeps});
                    }}
                    suggestions={beats.filter(b => b.id !== editForm.id).map(b => b.title)}
                    placeholder="Add dependency..."
                    icon={LinkIcon}
                    multiple={true}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <button 
                  onClick={() => handleDeleteBeat(editForm.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Beat
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsEditing(null)}
                    className="px-6 py-2 text-zinc-600 hover:bg-zinc-200 rounded-xl font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveBeat}
                    className="px-6 py-2 bg-ink text-white hover:bg-zinc-800 rounded-xl font-bold text-sm transition-colors shadow-md shadow-ink/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
