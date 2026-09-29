import React, { useState } from 'react';
import { Sparkles, Send, X, Terminal, Database } from 'lucide-react';

import { api } from '@/lib/api';

interface CommandCenterBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandCenterBar({ isOpen, onClose }: CommandCenterBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  if (!isOpen) return null;

  const exampleQueries = [
    "Why did revenue drop today?",
    "How much money is at risk?",
    "Which payment method is failing?",
    "Show me recoverable revenue.",
    "Why did you stop the recovery?"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const data = await api.queryAgent({ query: q });
      setResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D1322] border border-blue-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#0B0F19]">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>ReviveAI Natural Language Command Center</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask ReviveAI anything about payment health, revenue risk, or campaigns..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </div>

          {/* Quick chip queries */}
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((eq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(eq);
                  handleSend(eq);
                }}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition"
              >
                "{eq}"
              </button>
            ))}
          </div>

          {/* Response Box */}
          {loading && (
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-xs text-blue-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Querying database via SQL tool agent...</span>
            </div>
          )}

          {response && (
            <div className="p-5 rounded-xl bg-gray-900 border border-blue-500/30 text-xs space-y-3">
              <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Tool Executed: {response.sql_tool_used}</span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed">{response.answer}</p>
              {response.data && (
                <pre className="bg-black/50 p-3 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto border border-gray-800">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
