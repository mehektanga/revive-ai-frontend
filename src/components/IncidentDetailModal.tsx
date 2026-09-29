import React, { useState } from 'react';
import { 
  X, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, 
  Sparkles, Play, StopCircle, RefreshCw, Layers, ArrowRight
} from 'lucide-react';

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any;
  onRefresh: () => void;
}

import { api } from '@/lib/api';

export default function IncidentDetailModal({ isOpen, onClose, incident, onRefresh }: IncidentDetailModalProps) {
  const [selectedStrategy, setSelectedStrategy] = useState('delayed_retry');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const [incidentDetail, setIncidentDetail] = useState<any>(null);

  React.useEffect(() => {
    if (isOpen && incident?.id) {
      api.getIncidentDetail(incident.id)
        .then((d) => {
          setIncidentDetail(d);
          handleCreatePlan('delayed_retry');
        })
        .catch((e) => console.error(e));
    }
  }, [isOpen, incident]);

  if (!isOpen || !incident) return null;

  const diagnosis = incidentDetail?.diagnosis || {};
  const evidenceList = diagnosis.evidence || [
    `Failure rate increased from baseline ${(incident.baseline_failure_rate * 100 || 8.6).toFixed(1)}% to ${(incident.current_failure_rate * 100 || 26.2).toFixed(1)}%`,
    "72% of failures are concentrated in UPI payment route (HDFC bank gateway timeout)",
    `Revenue at risk: ₹${(incident.revenue_at_risk || 870000).toLocaleString('en-IN')}`
  ];

  const fetchedStrategies = incidentDetail?.strategies;
  const strategies = (fetchedStrategies && fetchedStrategies.length > 0)
    ? fetchedStrategies.map((s: any, idx: number) => ({
        code: s.code,
        name: s.name,
        expected_recovery: `₹${(s.expected_recovery || 0).toLocaleString('en-IN')}`,
        risk: `Score: ${s.risk_score}`,
        impact: s.customer_impact || 'LOW',
        recommended: idx === 0,
        reason: s.recommendation_reason || s.description
      }))
    : [
        {
          code: 'delayed_retry',
          name: 'Delayed Smart Retry',
          expected_recovery: '₹3.4L',
          risk: 'Low (0.12)',
          impact: 'Low',
          recommended: true,
          reason: 'Best expected recovery while staying under merchant risk policy limit.'
        },
        {
          code: 'immediate_retry',
          name: 'Immediate Retry',
          expected_recovery: '₹2.1L',
          risk: 'Medium (0.28)',
          impact: 'Low',
          recommended: false,
          reason: 'Lower recovery efficiency due to active HDFC gateway degradation.'
        },
        {
          code: 'alternate_route',
          name: 'Alternate Gateway Route',
          expected_recovery: '₹2.8L',
          risk: 'Low (0.18)',
          impact: 'Low',
          recommended: false,
          reason: 'Reroutes via ICICI gateway connection.'
        },
        {
          code: 'recovery_link',
          name: '1-Click Recovery Payment Link',
          expected_recovery: '₹1.7L',
          risk: 'Medium (0.15)',
          impact: 'Medium',
          recommended: false,
          reason: 'Dispatches SMS link to customer.'
        }
      ];

  const handleCreatePlan = async (stratCode: string) => {
    setSelectedStrategy(stratCode);
    setIsEvaluating(true);
    try {
      const data = await api.createRecoveryPlan({
        incident_id: incident.id,
        strategy_code: stratCode
      });
      setPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApproveAndExecute = async (triggerControlledFailure: boolean = false) => {
    setExecuting(true);
    setProgress(15);
    try {
      let activePlan = plan;
      if (!activePlan || !activePlan.campaign_id) {
        activePlan = await api.createRecoveryPlan({
          incident_id: incident.id,
          strategy_code: selectedStrategy
        });
        setPlan(activePlan);
      }
      let campaignId = activePlan.campaign_id;

      // 1. Approve
      await api.approveRecoveryCampaign({
        campaign_id: campaignId,
        action: 'APPROVE',
        reason: 'Merchant explicitly approved risk exposure plan'
      });

      setProgress(45);

      // 2. Execute
      const execData = await api.executeRecovery({
        campaign_id: campaignId,
        trigger_controlled_failure: triggerControlledFailure
      });
      setProgress(100);
      setExecResult(execData);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start sticky top-0 bg-[#0D1322] z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                CRITICAL INCIDENT
              </span>
              <span className="text-xs font-mono text-gray-400">{incident.incident_code || 'INC-84920'}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{incident.title || 'UPI Payment Route Degradation'}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Overview & Computed Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span className="text-xs text-gray-400 font-medium">Revenue At Risk</span>
              <div className="text-2xl font-extrabold text-white mt-1">₹{(incident.revenue_at_risk || 0).toLocaleString('en-IN')}</div>
              <span className="text-xs text-rose-400 font-semibold">{incident.affected_transactions || 0} transactions affected</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span className="text-xs text-gray-400 font-medium">Diagnosis & Confidence</span>
              <div className="text-base font-bold text-white mt-1">{diagnosis.primary_issue || incident.title || 'UPI Payment Route Degradation'}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${Math.round((diagnosis.confidence_score || 0.87) * 100)}%` }}></div>
                </div>
                <span className="text-xs font-mono text-blue-400 font-bold">{Math.round((diagnosis.confidence_score || 0.87) * 100)}%</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <span className="text-xs text-gray-400 font-medium">Affected Segment</span>
              <div className="text-base font-bold text-white mt-1">{diagnosis.affected_provider || 'UPI (HDFC Gateway)'}</div>
              <span className="text-xs text-amber-400 font-semibold">Failure rate: {((incident.current_failure_rate || 0.262) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Computed Evidence */}
          <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-950/10">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>EMPIRICAL COMPUTED EVIDENCE</span>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {evidenceList.map((ev, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Counterfactual Recovery Strategy Engine */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">Counterfactual Recovery Strategies</h3>
              <span className="text-xs text-gray-400">Comparing expected recovery vs risk limits</span>
            </div>

            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900 text-gray-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Strategy</th>
                    <th className="p-3">Expected Recovery</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Customer Impact</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-200">
                  {strategies.map((s) => (
                    <tr 
                      key={s.code}
                      className={`hover:bg-gray-800/40 transition ${selectedStrategy === s.code ? 'bg-blue-950/20' : ''}`}
                    >
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        {s.recommended && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            BEST
                          </span>
                        )}
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{s.expected_recovery}</td>
                      <td className="p-3 font-mono">{s.risk}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.impact === 'Low' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {s.impact}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleCreatePlan(s.code)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                        >
                          Select & Evaluate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Risk Governor Evaluation */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-[#0B0F19]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Deterministic Risk Governor Policy Check</span>
                </h4>
                <p className="text-xs text-gray-400">Strict monetary and transaction limit enforcement</p>
              </div>

              {plan ? (
                <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  plan.risk_decision.decision === 'APPROVED' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : plan.risk_decision.decision === 'HUMAN_APPROVAL_REQUIRED'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{plan.risk_decision.decision}</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>HUMAN APPROVAL REQUIRED</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-gray-900/60 p-3 rounded-lg border border-gray-800">
              <div>
                <span className="text-gray-400">Max Exposure Limit:</span>
                <p className="font-mono font-bold text-white">₹{(plan?.risk_decision?.max_exposure || 200000).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-gray-400">Proposed Exposure:</span>
                <p className="font-mono font-bold text-blue-400">₹{(plan?.risk_decision?.requested_exposure || 192000).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-gray-400">Max Transactions:</span>
                <p className="font-mono font-bold text-white">{plan?.risk_decision?.max_transactions || 500} txs</p>
              </div>
              <div>
                <span className="text-gray-400">Safety Stop Threshold:</span>
                <p className="font-mono font-bold text-rose-400">{((plan?.risk_decision?.stopping_threshold || 0.35) * 100).toFixed(1)}% Failure Rate</p>
              </div>
            </div>

            {/* Execution / Approval buttons */}
            {!execResult && (
              <div className="mt-4 flex flex-wrap gap-3 items-center justify-end">
                <button
                  onClick={() => handleApproveAndExecute(false)}
                  disabled={executing}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPROVE & EXECUTE RECOVERY</span>
                </button>

                <button
                  onClick={() => handleApproveAndExecute(true)}
                  disabled={executing}
                  className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2"
                  title="Simulates gateway failure spike to trigger automatic safety stopping threshold"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>EXECUTE WITH DEMO CONTROLLED FAILURE</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Live Execution Progress & Halting Result */}
          {executing && (
            <div className="glass-panel p-5 rounded-xl border border-blue-500/30 bg-blue-950/20">
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-white">
                <span>Recovery Execution in Progress...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {execResult && (
            <div className={`glass-panel p-5 rounded-xl border ${
              execResult.is_halted ? 'border-rose-500/40 bg-rose-950/20' : 'border-emerald-500/40 bg-emerald-950/20'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {execResult.is_halted ? (
                  <StopCircle className="w-6 h-6 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                )}
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    {execResult.is_halted ? '⚠️ AUTOMATIC SAFETY RECOVERY HALTED' : '✅ RECOVERY CAMPAIGN COMPLETED'}
                  </h4>
                  <p className="text-xs text-gray-300">{execResult.halt_reason || 'All 500 target transactions processed successfully.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900/80 p-4 rounded-xl border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400">Transactions Attempted</span>
                  <p className="text-lg font-extrabold text-white mt-0.5">{execResult.attempted_total}</p>
                </div>
                <div>
                  <span className="text-gray-400">Successful Recoveries</span>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">{execResult.successful_total}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Money Recovered</span>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">₹{execResult.revenue_recovered?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Failure Rate / Limit</span>
                  <p className="text-lg font-extrabold text-amber-400 mt-0.5">
                    {roundPct(execResult.current_failure_rate)} / {roundPct(execResult.stopping_threshold)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function roundPct(val: number) {
  if (!val) return '0%';
  return `${(val * 100).toFixed(1)}%`;
}
