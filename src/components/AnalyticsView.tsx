import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Award, 
  Flame, 
  Calendar, 
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const writingData = [
  { day: 'Mon', words: 1200, target: 1000 },
  { day: 'Tue', words: 1500, target: 1000 },
  { day: 'Wed', words: 800, target: 1000 },
  { day: 'Thu', words: 2100, target: 1000 },
  { day: 'Fri', words: 1100, target: 1000 },
  { day: 'Sat', words: 2500, target: 1000 },
  { day: 'Sun', words: 1800, target: 1000 },
];

const salesData = [
  { month: 'Jan', revenue: 450 },
  { month: 'Feb', revenue: 820 },
  { month: 'Mar', revenue: 1100 },
  { month: 'Apr', revenue: 950 },
  { month: 'May', revenue: 1400 },
  { month: 'Jun', revenue: 1850 },
];

export const AnalyticsView = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-ink">Performance Dashboard</h1>
          <p className="text-zinc-500 mt-2">Track writing velocity, streaks, and series revenue.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert("Date range picker coming soon!")} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-600 px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Writing Streak', value: '14 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', trend: '+2', trendIcon: TrendingUp },
          { label: 'Avg. Daily Words', value: '1,571', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+12%', trendIcon: TrendingUp },
          { label: 'Monthly Revenue', value: '$1,850', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', trend: '+24%', trendIcon: TrendingUp },
          { label: 'Series Milestone', value: '82%', icon: Target, color: 'text-purple-500', bg: 'bg-purple-50', trend: 'Next: 250k', trendIcon: ChevronRight },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => alert(`View details for ${stat.label} coming soon!`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className={cn("flex items-center gap-1 text-xs font-bold", stat.color)}>
                <stat.trendIcon className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-ink mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Writing Velocity */}
        <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Writing Velocity</h3>
              <p className="text-sm text-zinc-400">Daily word count vs. target</p>
            </div>
            <button onClick={() => alert("More options coming soon!")} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={writingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="words" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl shadow-zinc-900/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-bold">Series Revenue</h3>
              <p className="text-sm text-zinc-400">Monthly growth across all titles</p>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm font-medium">Amazon KDP</span>
              </div>
              <span className="font-mono font-bold">$1,420.00</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium">IngramSpark</span>
              </div>
              <span className="font-mono font-bold">$430.50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-display font-bold mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'The 100k Club', desc: 'Reached 100,000 words in a single series.', date: 'Mar 12, 2026', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { title: 'Consistency King', desc: 'Maintained a 14-day writing streak.', date: 'Mar 28, 2026', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
            { title: 'Bestseller Rank', desc: 'Reached Top 100 in Mystery & Thriller.', date: 'Feb 15, 2026', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
          ].map((ach, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors cursor-default">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", ach.bg)}>
                <ach.icon className={cn("w-6 h-6", ach.color)} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">{ach.title}</h4>
                <p className="text-xs text-zinc-500 mt-1">{ach.desc}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 mt-2">{ach.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
