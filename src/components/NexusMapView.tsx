import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Search, 
  Filter, 
  Maximize2, 
  Plus, 
  ChevronRight, 
  User, 
  Heart, 
  Zap, 
  Shield, 
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  role: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
  type: string;
}

export const NexusMapView = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const nodesRef = useRef<d3.Selection<SVGGElement | d3.BaseType, Node, SVGGElement, unknown> | null>(null);
  const linksRef = useRef<d3.Selection<SVGLineElement | d3.BaseType, Link, SVGGElement, unknown> | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const data: { nodes: Node[], links: Link[] } = {
    nodes: [
      { id: 'Elias Vance', name: 'Elias Vance', role: 'Protagonist', group: 1 },
      { id: 'Sarah Vance', name: 'Sarah Vance', role: 'Daughter', group: 1 },
      { id: 'Arthur Thorne', name: 'Arthur Thorne', role: 'Antagonist', group: 2 },
      { id: 'Detective Miller', name: 'Detective Miller', role: 'Ally', group: 3 },
      { id: 'The Silent Echo', name: 'The Silent Echo', role: 'Organization', group: 2 },
      { id: 'Marcus Reed', name: 'Marcus Reed', role: 'Mentor', group: 3 },
      { id: 'Elena Rossi', name: 'Elena Rossi', role: 'Love Interest', group: 1 },
    ],
    links: [
      { source: 'Elias Vance', target: 'Sarah Vance', value: 5, type: 'Family' },
      { source: 'Elias Vance', target: 'Arthur Thorne', value: 2, type: 'Enemy' },
      { source: 'Elias Vance', target: 'Detective Miller', value: 3, type: 'Ally' },
      { source: 'Arthur Thorne', target: 'The Silent Echo', value: 5, type: 'Leader' },
      { source: 'Marcus Reed', target: 'Elias Vance', value: 4, type: 'Mentor' },
      { source: 'Elena Rossi', target: 'Elias Vance', value: 5, type: 'Love' },
      { source: 'Sarah Vance', target: 'Elena Rossi', value: 2, type: 'Friend' },
    ]
  };

  const filteredNodes = data.nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const g = svg.append('g');
    gRef.current = g;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force('link', d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = g.append('g')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2);

    linksRef.current = link;

    const node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (event, d) => {
        setSelectedNode(d);
        setIsInspectorOpen(true);
      });

    nodesRef.current = node;

    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => d.group === 1 ? '#3b82f6' : d.group === 2 ? '#ef4444' : '#10b981')
      .attr('class', 'cursor-pointer hover:scale-110 transition-transform');

    node.append('text')
      .text(d => d.name)
      .attr('x', 30)
      .attr('y', 5)
      .attr('stroke', 'none')
      .attr('fill', '#1a1a1a')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x!)
        .attr('y1', (d: any) => d.source.y!)
        .attr('x2', (d: any) => d.target.x!)
        .attr('y2', (d: any) => d.target.y!);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, []);

  useEffect(() => {
    if (!nodesRef.current || !linksRef.current || !svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const nodes = nodesRef.current;
    const links = linksRef.current;

    if (selectedNode) {
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add(selectedNode.id);

      links.each((d: any) => {
        if (d.source.id === selectedNode.id) connectedNodeIds.add(d.target.id);
        if (d.target.id === selectedNode.id) connectedNodeIds.add(d.source.id);
      });

      nodes.transition().duration(300).style('opacity', (d: any) => connectedNodeIds.has(d.id) ? 1 : 0.2);
      
      links.transition().duration(300).style('opacity', (d: any) => 
        (d.source.id === selectedNode.id || d.target.id === selectedNode.id) ? 1 : 0.1
      );

      const width = 800;
      const height = 600;
      const scale = 1.5;
      const x = width / 2 - (selectedNode as any).x * scale;
      const y = height / 2 - (selectedNode as any).y * scale;

      svg.transition().duration(750).call(
        zoomRef.current.transform, 
        d3.zoomIdentity.translate(x, y).scale(scale)
      );

    } else {
      nodes.transition().duration(300).style('opacity', 1);
      links.transition().duration(300).style('opacity', 0.6);
      
      svg.transition().duration(750).call(
        zoomRef.current.transform, 
        d3.zoomIdentity
      );
    }
  }, [selectedNode]);

  return (
    <div className="h-full flex flex-col bg-zinc-50 relative overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-2 shadow-sm flex items-center gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Find character..." 
                className="bg-transparent border-none outline-none text-sm w-40"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50">
                {filteredNodes.length > 0 ? (
                  filteredNodes.map(node => (
                    <button
                      key={node.id}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                      onClick={() => {
                        setSelectedNode(node);
                        setIsInspectorOpen(true);
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                    >
                      {node.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-zinc-500">No results found</div>
                )}
              </div>
            )}
          </div>
          <button onClick={() => alert("Filter options coming soon!")} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors"><Filter className="w-4 h-4 text-zinc-500" /></button>
          <button 
            className="p-2 hover:bg-zinc-50 rounded-xl transition-colors"
            onClick={() => {
              setSelectedNode(null);
              setIsInspectorOpen(false);
            }}
          >
            <Maximize2 className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Legend</h4>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Family / Allies</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Enemies / Antagonists</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Neutral / Support</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Character Inspector */}
      <AnimatePresence>
        {isInspectorOpen && selectedNode && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 w-[400px] h-full bg-white border-l border-zinc-200 shadow-2xl z-20 flex flex-col"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold">Character Profile</h3>
              <button 
                onClick={() => setIsInspectorOpen(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center mb-4 overflow-hidden">
                  <User className="w-12 h-12 text-zinc-300" />
                </div>
                <h2 className="text-2xl font-display font-bold text-ink">{selectedNode.name}</h2>
                <p className="text-accent font-medium">{selectedNode.role}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Biography</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  A former intelligence officer turned private investigator, haunted by the disappearance of his daughter. Known for his analytical mind and uncompromising moral compass.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Core Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {['Analytical', 'Protective', 'Stoic', 'Relentless'].map(trait => (
                    <span key={trait} className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-medium text-zinc-600">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Key Relationships</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Vance', relation: 'Daughter', type: 'Family', icon: Heart, color: 'text-red-500' },
                    { name: 'Arthur Thorne', relation: 'Arch-Nemesis', type: 'Enemy', icon: AlertCircle, color: 'text-orange-500' },
                    { name: 'Detective Miller', relation: 'Old Friend', type: 'Ally', icon: Shield, color: 'text-blue-500' },
                  ].map((rel, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group hover:border-zinc-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <rel.icon className={cn("w-4 h-4", rel.color)} />
                        <div>
                          <p className="text-sm font-semibold">{rel.name}</p>
                          <p className="text-xs text-zinc-400">{rel.relation}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100">
              <button onClick={() => alert("Add plot connection coming soon!")} className="w-full bg-ink text-white py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Plot Connection
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
