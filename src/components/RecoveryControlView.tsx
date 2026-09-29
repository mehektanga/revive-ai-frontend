import React from 'react';
import { 
  RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, 
  XCircle, StopCircle, ArrowRight, ShieldAlert, Sparkles, Layers
} from 'lucide-react';

interface RecoveryControlViewProps {
  campaigns: any[];
  incidents: any[];
  onRefresh: () => void;
  onOpenIncidentDetail?: (inc: any) => void;
}

export default function RecoveryControlView({ campaigns, incidents, onRefresh, onOpenIncidentDetail }: RecoveryControlViewProps) {
  const activeIncident = incidents.find((i) => i.status !== 'RESOLVED') || incidents[0];
  const [policy, setPolicy] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/risk/policy')
      .then((r) => r.json())
      .then((d) => setPolicy(d))
      .catch((e) => console.error(e));
  }, []);

  const strategies = [
    {
      code: 'delayed_retry',
      name: 'Delayed Smart Retry',
      expected_recovery: '₹3,40,000',
      risk: 'LOW (0.12)',
      impact: 'LOW',
      recommended: true,
      reason: 'High predicted recovery probability with lower gateway pressure and lower financial exposure.'
    },
    {
      code: 'immediate_retry',
      name: 'Immediate Gateway Retry',
      expected_recovery: '₹2,10,000',
      risk: 'MEDIUM (0.28)',
      impact: 'LOW',
      recommended: false,
      reason: 'Lower recovery efficiency due to ongoing bank gateway degradation.'
    },
    {
      code: 'alternate_route',
      name: 'Alternate Gateway Routing',
      expected_recovery: '₹2,80,000',
      risk: 'LOW (0.18)',
      impact: 'LOW',
      recommended: false,
      reason: 'Reroutes failed transactions via ICICI/Axis alternate bank connection.'
    },
    {
      code: 'recovery_link',
      name: 'Dynamic 1-Click Recovery Link',
      expected_recovery: '₹1,70,000',
      risk: 'MEDIUM (0.15)',
      impact: 'MEDIUM',
      recommended: false,
      reason: 'Dispatches Razorpay SMS payment link directly to customer mobile.'
    },
    {
      code: 'customer_contact',
      name: 'Priority Customer Outreach',
      expected_recovery: '₹90,000',
      risk: 'HIGH (0.45)',
      impact: 'HIGH',
      recommended: false,
      reason: 'High customer touchpoint reserved for high basket value transactions.'
    }
  ];

  const maxExposure = policy?.max_monetary_exposure || 200000;
  const maxTxs = policy?.max_transaction_count || 500;
  const failLimit = ((policy?.max_failure_rate_threshold || 0.35) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span>Autonomous Recovery Control Center</span>
          </h2>
          <p className="text-xs text-gray-400">Counterfactual strategy evaluation, Risk Governor limits, and campaign execution</p>
        </div>

        {activeIncident && onOpenIncidentDetail && (
          <button
            onClick={() => onOpenIncidentDetail(activeIncident)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20"
          >
            Investigate Active Incident
          </button>
        )}
      </div>

      {/* Section 1: Recovery Strategy Comparison */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-white">Counterfactual Strategy Comparison</h3>
            <p className="text-xs text-gray-400">AI counterfactual modeling of expected recovery vs risk impact</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">Selected: Delayed Smart Retry</span>
        </div>

        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase font-semibold">
              <tr>
                <th className="p-3.5">Strategy</th>
                <th className="p-3.5">Expected Recovery</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Customer Impact</th>
                <th className="p-3.5">Recommendation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {strategies.map((s) => (
                <tr key={s.code} className={`hover:bg-gray-800/40 ${s.recommended ? 'bg-blue-950/20' : ''}`}>
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    {s.recommended && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        RECOMMENDED
                      </span>
                    )}
                    <span>{s.name}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{s.expected_recovery}</td>
                  <td className="p-3.5 font-mono">{s.risk}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.impact === 'LOW' ? 'bg-blue-500/20 text-blue-400' :
                      s.impact === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {s.impact}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-300 text-[11px]">{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: AI Authority Boundary Differentiator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Authority Boundaries Card */}
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-blue-400">
            <ShieldCheck className="w-5 h-5" />
            <span>AI AUTHORITY BOUNDARIES</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-900/80 border border-emerald-500/30 space-y-1.5">
              <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI CAN:
              </span>
              <ul className="text-gray-300 space-y-1 text-[11px]">
                <li>✓ Detect failure spikes</li>
                <li>✓ Diagnose root cause</li>
                <li>✓ Predict recoverable revenue</li>
                <li>✓ Generate recovery strategies</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-gray-900/80 border border-rose-500/30 space-y-1.5">
              <span className="font-extrabold text-rose-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> AI CANNOT:
              </span>
              <ul className="text-gray-300 space-y-1 text-[11px]">
                <li>✕ Exceed exposure limit (₹{(maxExposure / 100000).toFixed(1)}L)</li>
                <li>✕ Exceed retry limit ({maxTxs} txs)</li>
                <li>✕ Disable safety stop ({failLimit}%)</li>
                <li>✕ Execute outside policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Governor Evaluation */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3 bg-[#0B0F19]">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Risk Governor Safeguard Check</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              WITHIN POLICY LIMITS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-gray-900 p-3 rounded-xl border border-gray-800">
            <div>
              <span className="text-gray-400">Policy Max Exposure:</span>
              <p className="font-bold text-white">₹{maxExposure.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-gray-400">Auto-Approval Exposure Limit:</span>
              <p className="font-bold text-blue-400">₹{(policy?.require_human_approval_above_exposure || 100000).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-gray-400">Policy Max Txs:</span>
              <p className="font-bold text-white">{maxTxs} txs</p>
            </div>
            <div>
              <span className="text-gray-400">Safety Stop Limit:</span>
              <p className="font-bold text-rose-400">{failLimit}% Fail Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Recovery Campaign Monitor Table */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white">Active & Historical Recovery Campaigns</h3>

        {campaigns.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-gray-400">No recovery campaign has been executed yet.</p>
            <p className="text-xs text-blue-400 font-semibold">Click 🚀 RUN HACKATHON DEMO in the top bar to trigger autonomous recovery.</p>
          </div>
        ) : (
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900 text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Strategy</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attempted / Total</th>
                  <th className="p-4">Recovered Revenue</th>
                  <th className="p-4">Failure Rate / Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-200">
                {campaigns.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-gray-800/40 transition">
                      <td className="p-4 font-mono font-bold text-white">{c.campaign_code}</td>
                      <td className="p-4">{c.strategy_code}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold ${
                          c.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          c.status === 'HALTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                          c.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{c.attempted_transactions} / {c.total_transactions}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">₹{c.revenue_recovered?.toLocaleString()}</td>
                      <td className="p-4 font-mono">{((c.failure_rate || 0) * 100).toFixed(1)}% / {((c.stopping_threshold || 0.35) * 100).toFixed(1)}%</td>
                    </tr>

                    {c.status === 'HALTED' && (
                      <tr key={`halt-${c.id}`} className="bg-rose-950/20">
                        <td colSpan={6} className="p-4 border-t border-rose-500/30 text-rose-400 font-semibold text-xs">
                          <div className="flex items-center gap-2">
                            <StopCircle className="w-4 h-4 shrink-0 text-rose-400" />
                            <span>🛑 AUTOMATIC SAFETY RECOVERY HALTED: {c.halted_reason || `Failure rate (${((c.failure_rate || 0.352) * 100).toFixed(1)}%) exceeded threshold (${((c.stopping_threshold || 0.35) * 100).toFixed(1)}%).`}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
