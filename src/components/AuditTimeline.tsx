import React from 'react';
import { History, ShieldCheck, User, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AuditTimelineProps {
  logs: any[];
}

export default function AuditTimeline({ logs }: AuditTimelineProps) {
  const displayLogs = logs || [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <span>Immutable System Audit Trail</span>
          </h2>
          <p className="text-xs text-gray-400">Complete chronological record of all agent & merchant decisions</p>
        </div>
      </div>

      {displayLogs.length === 0 ? (
        <div className="p-8 text-center space-y-2">
          <p className="text-xs text-gray-400">No system audit log events recorded yet.</p>
          <p className="text-xs text-blue-400 font-semibold">Run the Payment Event Simulator or click 🚀 RUN HACKATHON DEMO to generate events.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-800 ml-4 pl-6 space-y-6">
        {displayLogs.map((log) => {
          let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
          if (log.actor === 'RISK_GOVERNOR' || log.actor === 'MERCHANT') {
            badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          }
          if (log.risk_decision === 'BLOCKED' || log.event.includes('HALTED')) {
            badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
          }

          return (
            <div key={log.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-900 border-2 border-blue-400 group-hover:scale-125 transition"></div>

              <div className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/80 transition">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${badgeColor}`}>
                      {log.actor}
                    </span>
                    <span className="text-xs font-bold text-white">{log.event}</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-1">{log.reason || log.action}</p>

                {(log.amount > 0 || log.transaction_count > 0) && (
                  <div className="mt-2 pt-2 border-t border-gray-800/60 flex items-center gap-4 text-[11px] font-mono text-gray-400">
                    {log.amount > 0 && <span>Amount: ₹{log.amount?.toLocaleString()}</span>}
                    {log.transaction_count > 0 && <span>Transactions: {log.transaction_count}</span>}
                    {log.risk_decision && (
                      <span className={`font-bold ${log.risk_decision === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Decision: {log.risk_decision}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
