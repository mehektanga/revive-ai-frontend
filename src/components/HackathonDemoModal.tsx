import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Sparkles, Layers } from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function HackathonDemoModal({ isOpen, onClose, onRefresh }: HackathonDemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);

  if (!isOpen) return null;

  const steps = [
    { title: "Normal System State", desc: "Payment success rate at 91.4%. Revenue at risk: ₹0." },
    { title: "Trigger Event Simulation", desc: "Injecting scenario: UPI_DEGRADATION (HDFC bank gateway timeout)." },
    { title: "Revenue Monitor Detects Anomaly", desc: "Success rate drops 91.4% → 73.8%. Revenue at risk: ₹8.7L across 3,842 txs." },
    { title: "Root Cause Diagnosis", desc: "Structured diagnosis: UPI route degradation (Confidence: 87%)." },
    { title: "Counterfactual Strategy Engine", desc: "Evaluating Delayed Smart Retry (Expected Recovery: ₹3.4L)." },
    { title: "Risk Governor Evaluation", desc: "Merchant policy exposure limit ₹2L. Proposed exposure: ₹1.92L. Decision: APPROVED." },
    { title: "Human Approval Workflow", desc: "Merchant approves execution bounds." },
    { title: "Execute Recovery in Sandbox", desc: "Batch retry executing on 500 target transactions." },
    { title: "Controlled Failure Injection", desc: "Simulated gateway throttle occurs during retry execution." },
    { title: "Safety Threshold Stopping Rule", desc: "Failure rate reaches 35.0% threshold. System automatically halts!" },
    { title: "Final Recovery Measurement", desc: "₹1,84,500 recovered across 117 transactions. 0 extra transactions exposed." },
    { title: "Audit Trail Logging", desc: "Complete immutable audit trail entries saved to database." }
  ];

  const handleStartDemo = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setCurrentStep(i);
    }

    try {
      const res = await fetch('/api/demo/run', { method: 'POST' });
      const data = await res.json();
      setDemoResults(data);
      setCurrentStep(11);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B0F19] border border-blue-500/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-950/40 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">🚀 ReviveAI Hackathon Live Demo Story</h2>
              <p className="text-xs text-gray-400">Automated end-to-end 14-step scenario</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {steps.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-950/10 text-emerald-300'
                      : isCurrent
                      ? 'border-blue-500 bg-blue-950/40 text-blue-200 animate-pulse'
                      : 'border-gray-800 bg-gray-900/30 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-800 text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{step.title}</span>
                  </div>
                  <p className="text-[10px] line-clamp-2">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Execution Result Box */}
          {demoResults && (
            <div className="glass-panel p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Demo Story Completed Successfully!</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-gray-900/90 p-4 rounded-xl border border-gray-800">
                <div>
                  <span className="text-gray-400">Trigger Scenario</span>
                  <p className="font-bold text-amber-400 mt-0.5">{demoResults.step_2_scenario}</p>
                </div>
                <div>
                  <span className="text-gray-400">Diagnosis Confidence</span>
                  <p className="font-bold text-blue-400 mt-0.5">87%</p>
                </div>
                <div>
                  <span className="text-gray-400">Risk Governor Limit</span>
                  <p className="font-bold text-white mt-0.5">APPROVED (Exposure ≤ ₹2L)</p>
                </div>
                <div>
                  <span className="text-gray-400">Automatic Halt Status</span>
                  <p className="font-bold text-rose-400 mt-0.5">HALTED AT 35% FAIL THRESHOLD</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Total Money Recovered</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{demoResults.step_12_recovered_amount}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Halt Reason</span>
                  <p className="font-mono text-[11px] text-gray-300 mt-0.5">{demoResults.step_11_halt_reason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleStartDemo}
              disabled={isRunning}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Running Demo Story...' : 'START DEMO ORCHESTRATION'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
