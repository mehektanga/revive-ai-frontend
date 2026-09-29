import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface KPICardsProps {
  data: {
    revenue_at_risk: number;
    recoverable_revenue: number;
    recovered_today: number;
    recovery_rate: number;
    active_incidents: number;
    current_success_rate: number;
    normal_success_rate: number;
  } | null;
}

export default function KPICards({ data }: KPICardsProps) {
  const rar = data ? data.revenue_at_risk : 0;
  const rec = data ? data.recoverable_revenue : 0;
  const today = data ? data.recovered_today : 0;
  const rate = data ? data.recovery_rate : 0;
  const inc = data ? data.active_incidents : 0;
  const currentSuccessRate = data ? data.current_success_rate * 100 : 91.4;

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Card 1: Revenue At Risk */}
      <div className={`glass-panel p-4 rounded-xl border relative overflow-hidden ${
        rar > 0 ? 'border-rose-500/30 bg-rose-950/10' : 'border-gray-800 bg-gray-900/30'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-rose-400">Revenue At Risk</span>
          <AlertCircle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{formatCurrency(rar)}</div>
        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          {rar > 0 ? (
            <span className="text-rose-400 font-semibold">Success rate: {currentSuccessRate.toFixed(1)}%</span>
          ) : (
            <span className="text-emerald-400 font-semibold">Baseline success rate: 91.4%</span>
          )}
        </p>
      </div>

      {/* Card 2: Recoverable Revenue */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-950/10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-blue-400">Recoverable Revenue</span>
          <ArrowUpRight className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{formatCurrency(rec)}</div>
        <p className="text-[11px] text-gray-400 mt-1">
          <span className="text-blue-400 font-semibold">39% recovery estimate</span> score
        </p>
      </div>

      {/* Card 3: Recovered Today */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-emerald-400">Recovered Today</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{formatCurrency(today)}</div>
        <p className="text-[11px] text-gray-400 mt-1">
          {today > 0 ? (
            <span className="text-emerald-400 font-semibold">Actual execution output</span>
          ) : (
            <span className="text-gray-400 font-semibold">0 retries executed yet</span>
          )}
        </p>
      </div>

      {/* Card 4: Recovery Rate */}
      <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-amber-400">Recovery Rate</span>
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{rate}%</div>
        <p className="text-[11px] text-gray-400 mt-1">
          <span className="text-amber-400 font-semibold">Within ₹2L risk limit</span>
        </p>
      </div>

      {/* Card 5: Active Incidents */}
      <div className={`glass-panel p-4 rounded-xl border ${
        inc > 0 ? 'border-rose-500/30 bg-rose-950/10' : 'border-emerald-500/20 bg-emerald-950/10'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold ${inc > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Active Incidents</span>
          <ShieldAlert className={`w-4 h-4 ${inc > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{inc}</div>
        <p className="text-[11px] text-gray-400 mt-1">
          {inc > 0 ? (
            <span className="text-rose-400 font-semibold">1 Critical (UPI Degradation)</span>
          ) : (
            <span className="text-emerald-400 font-semibold">No active degradation</span>
          )}
        </p>
      </div>
    </div>
  );
}
