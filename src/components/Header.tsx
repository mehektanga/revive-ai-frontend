import React from 'react';
import { Play, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  onRunDemo: () => void;
  onOpenQuery: () => void;
}

export default function Header({ onRunDemo, onOpenQuery }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Agent Status: ACTIVE</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Activity className="w-3.5 h-3.5" />
          <span>Environment: RAZORPAY TEST MODE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenQuery}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Ask ReviveAI...</span>
        </button>

        <button
          onClick={onRunDemo}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition transform active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>🚀 RUN HACKATHON DEMO</span>
        </button>
      </div>
    </header>
  );
}
