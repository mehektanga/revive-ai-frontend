import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, ShieldAlert, ArrowUpRight, RefreshCw, WifiOff } from 'lucide-react';

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
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function KPICards({ data, loading, error, onRetry }: KPICardsProps) {
  if (error && !data) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-rose-950/20 mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <WifiOff className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">Backend Connection Error</h4>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        )}
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-900/30 animate-pulse space-y-2">
            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            <div className="h-7 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const rar = data ? data.revenue_at_risk || 0 : 0;
  const rec = data ? data.recoverable_revenue || 0 : 0;
  const today = data ? data.recovered_today || 0 : 0;
  const rate = data ? data.recovery_rate || 0 : 0;
  const inc = data ? data.active_incidents || 0 : 0;

  const rawSuccessRate = data ? data.current_success_rate : 0.914;
  const currentSuccessRate = rawSuccessRate <= 1 ? rawSuccessRate * 100 : rawSuccessRate;

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return '₹0.00';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)}Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatFullCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Card 1: Revenue At Risk */}
      <div 
        className={`glass-panel p-4 rounded-xl border relative overflow-hidden transition ${
          rar > 0 ? 'border-rose-500/30 bg-rose-950/10' : 'border-gray-800 bg-gray-900/30'
        }`}
        title={`Exact Revenue At Risk: ${formatFullCurrency(rar)}`}
      >
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
      <div 
        className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-950/10"
        title={`Exact Recoverable Revenue: ${formatFullCurrency(rec)}`}
      >
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
      <div 
        className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10"
        title={`Exact Recovered Today: ${formatFullCurrency(today)}`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-emerald-400">Recovered Today</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{formatCurrency(today)}</div>
        <p className="text-[11px] text-gray-400 mt-1">
          {today > 0 ? (
            <span className="text-emerald-400 font-semibold">Actual execution output</span>
          ) : (
            <span className="text-gray-400 font-semibold">0 retries executed today</span>
          )}
        </p>
      </div>

      {/* Card 4: Recovery Rate */}
      <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-amber-400">Recovery Rate</span>
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight">{rate.toFixed(1)}%</div>
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
            <span className="text-rose-400 font-semibold">{inc} Active Incident{inc > 1 ? 's' : ''}</span>
          ) : (
            <span className="text-emerald-400 font-semibold">No active degradation</span>
          )}
        </p>
      </div>
    </div>
  );
}
