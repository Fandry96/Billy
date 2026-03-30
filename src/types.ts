export type View = 'bible' | 'map' | 'profile' | 'kdp' | 'analytics' | 'editor' | 'plot';

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  traits: string[];
  connections: Connection[];
}

export interface Connection {
  targetId: string;
  type: string;
  strength: number;
}

export interface Manuscript {
  id: string;
  title: string;
  status: 'draft' | 'editing' | 'published';
  wordCount: number;
  targetCount: number;
}

export interface PlotBeat {
  id: string;
  title: string;
  summary: string;
  characters: string[];
  location: string;
  act?: string;
  dependencies?: string[];
}
