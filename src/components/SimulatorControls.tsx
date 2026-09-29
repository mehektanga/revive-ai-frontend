import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, AlertTriangle, Layers, Radio } from 'lucide-react';

interface SimulatorControlsProps {
  onRefresh: () => void;
  isCompact?: boolean;
}

export default function SimulatorControls({ onRefresh, isCompact = false }: SimulatorControlsProps) {
  const [scenario, setScenario] = useState('UPI_DEGRADATION');
  const [isRunning, setIsRunning] = useState(false);
  const [streamEvents, setStreamEvents] = useState<any[]>([]);

  const scenarioMeta: Record<string, any> = {
    UPI_DEGRADATION: {
      title: 'UPI Degradation (HDFC Gateway Timeout)',
      method: 'UPI',
      provider: 'HDFC',
      pattern: 'HDFC node timeout on UPI transactions (Spike to ~35% failure rate)',
      impact: 'High (~₹8.7L Revenue At Risk)'
    },
    CARD_FAILURE_SPIKE: {
      title: 'Card Failure Spike (3DS OTP Error)',
      method: 'CARD',
      provider: 'RAZORPAY_GATEWAY',
      pattern: '3DS authentication timeout on Visa/Mastercard payments',
      impact: 'Medium (~₹4.5L Revenue At Risk)'
    },
    CHECKOUT_ABANDONMENT: {
      title: 'Checkout Abandonment (Mobile)',
      method: 'UPI / CARD',
      provider: 'ALL',
      pattern: 'Android checkout session drops during payment redirection',
      impact: 'Medium (~₹3.2L Revenue At Risk)'
    },
    SUBSCRIPTION_FAILURE: {
      title: 'Subscription Mandate Failures',
      method: 'NETBANKING / UPI MANDATE',
      provider: 'SBI / ICICI',
      pattern: 'Auto-debit recurring subscription mandate rejections',
      impact: 'High (~₹5.1L Revenue At Risk)'
    },
    PROVIDER_OUTAGE: {
      title: 'Provider Outage (HDFC Node)',
      method: 'ALL',
      provider: 'HDFC',
      pattern: 'Complete HDFC core banking gateway network outage',
      impact: 'Critical (~₹12.0L Revenue At Risk)'
    },
    NORMAL: {
      title: 'Normal Traffic (Baseline 91.4%)',
      method: 'ALL',
      provider: 'ALL',
      pattern: 'Healthy baseline payment success rate across all channels',
      impact: 'Zero Risk (Healthy System)'
    }
  };

  const fetchStream = async () => {
    try {
      const res = await fetch('/api/simulator/stream');
      const data = await res.json();
      setStreamEvents(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setIsRunning(true);
    try {
      await fetch('/api/simulator/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, tpm: 60 })
      });
      fetchStream();
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    setIsRunning(false);
    try {
      await fetch('/api/simulator/stop', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    try {
      await fetch('/api/simulator/reset', { method: 'POST' });
      fetchStream();
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const meta = scenarioMeta[scenario] || scenarioMeta.UPI_DEGRADATION;

  if (isCompact) {
    return (
      <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Payment Event Simulator</h3>
            <p className="text-xs text-gray-400">Inject synthetic payment scenarios into live monitor</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="UPI_DEGRADATION">UPI Degradation (HDFC Timeout)</option>
            <option value="CARD_FAILURE_SPIKE">Card Failure Spike (3DS OTP Error)</option>
            <option value="CHECKOUT_ABANDONMENT">Checkout Abandonment (Mobile)</option>
            <option value="SUBSCRIPTION_FAILURE">Subscription Mandate Failures</option>
            <option value="PROVIDER_OUTAGE">Provider Outage (HDFC Node)</option>
            <option value="NORMAL">Normal Traffic (Baseline 91.4%)</option>
          </select>

          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Simulation</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    );
  }

  // Full Control Panel View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <span>Interactive Payment Event Simulator Panel</span>
          </h2>
          <p className="text-xs text-gray-400">Inject real-time payment degradation scenarios across all system control views</p>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START SIMULATION</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE SIMULATION</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-extrabold text-xs border border-gray-700 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET DATASET</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Metadata Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <label className="text-xs font-bold text-gray-300">Select Simulation Scenario</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-xs font-bold rounded-xl p-3 focus:outline-none focus:border-blue-500"
          >
            <option value="UPI_DEGRADATION">UPI Degradation — HDFC Timeout</option>
            <option value="CARD_FAILURE_SPIKE">Card Failure Spike — 3DS OTP Error</option>
            <option value="CHECKOUT_ABANDONMENT">Checkout Abandonment — Mobile</option>
            <option value="SUBSCRIPTION_FAILURE">Subscription Mandate Failures</option>
            <option value="PROVIDER_OUTAGE">Provider Outage — HDFC Core Node</option>
            <option value="NORMAL">Normal Traffic — Healthy Baseline</option>
          </select>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs space-y-1 text-blue-300">
            <span className="font-bold block">Notice:</span>
            <p className="text-[11px] text-gray-300">
              Injecting a scenario generates payment failure events that dynamically update Overview, Incidents, Recovery Control, Transactions, and Audit Trail.
            </p>
          </div>
        </div>

        {/* Scenario Details */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 md:col-span-2 space-y-3">
          <h3 className="text-sm font-extrabold text-white">{meta.title}</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Affected Payment Method:</span>
              <p className="font-bold text-white mt-0.5">{meta.method}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Primary Bank / Gateway:</span>
              <p className="font-bold text-white mt-0.5">{meta.provider}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Expected Failure Pattern:</span>
              <p className="font-bold text-rose-400 mt-0.5">{meta.pattern}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
              <span className="text-gray-400">Expected Revenue Impact:</span>
              <p className="font-bold text-amber-400 mt-0.5">{meta.impact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Stream Ticker */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Live Payment Event Stream Ticker</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">Auto-refreshing every 4s</span>
        </div>

        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-900 text-gray-400 uppercase">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Method</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Error Code</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {streamEvents.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-800/40">
                  <td className="p-3 text-gray-400">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3 font-bold text-white">{tx.transaction_id}</td>
                  <td className="p-3">{tx.payment_method}</td>
                  <td className="p-3 text-gray-400">{tx.payment_provider}</td>
                  <td className="p-3 text-rose-400">{tx.failure_code || '-'}</td>
                  <td className="p-3 font-bold text-gray-100">₹{tx.amount?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
