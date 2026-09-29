import React, { useEffect, useState } from 'react';
import { Sliders, ShieldCheck, CheckCircle2, AlertTriangle, Save } from 'lucide-react';

import { api } from '@/lib/api';

export default function SettingsView() {
  const [maxExposure, setMaxExposure] = useState(200000);
  const [autoApprove, setAutoApprove] = useState(100000);
  const [failThreshold, setFailThreshold] = useState(0.35);
  const [maxTxs, setMaxTxs] = useState(500);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPolicy = async () => {
    try {
      const data = await api.getRiskPolicy();
      if (data) {
        setMaxExposure(data.max_monetary_exposure || 200000);
        setAutoApprove(data.require_human_approval_above_exposure || 100000);
        setFailThreshold(data.max_failure_rate_threshold || 0.35);
        setMaxTxs(data.max_transaction_count || 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await api.updateRiskPolicy({
        max_monetary_exposure: Number(maxExposure),
        require_human_approval_above_exposure: Number(autoApprove),
        max_failure_rate_threshold: Number(failThreshold),
        max_transaction_count: Number(maxTxs)
      });
      setSuccessMsg('Merchant risk policy limits successfully saved to database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center text-xs text-blue-400">
        Loading Merchant Risk Policy...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Merchant Risk Policy Controls</span>
          </h2>
          <p className="text-xs text-gray-400">Configure hard financial boundaries and automatic stopping rules for Risk Governor</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving to Database...' : 'SAVE RISK POLICY LIMITS'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Monetary Safeguard Limits</span>
          </h3>

          <div>
            <label className="text-xs text-gray-400">Max Campaign Monetary Exposure (INR)</label>
            <input
              type="number"
              value={maxExposure}
              onChange={(e) => setMaxExposure(Number(e.target.value))}
              className="w-full mt-1.5 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">Campaigns exceeding this limit will be BLOCKED by Risk Governor.</p>
          </div>

          <div>
            <label className="text-xs text-gray-400">Auto-Approve Threshold (INR)</label>
            <input
              type="number"
              value={autoApprove}
              onChange={(e) => setAutoApprove(Number(e.target.value))}
              className="w-full mt-1.5 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">Exposure above this requires explicit merchant approval.</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Safety Stopping Rules</span>
          </h3>

          <div>
            <label className="text-xs text-gray-400">Max Failure Rate Stopping Threshold (Decimal: 0.35 = 35%)</label>
            <input
              type="number"
              step="0.05"
              value={failThreshold}
              onChange={(e) => setFailThreshold(Number(e.target.value))}
              className="w-full mt-1.5 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-rose-400 font-bold focus:outline-none focus:border-rose-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">System automatically halts retry execution if failure rate hits this limit.</p>
          </div>

          <div>
            <label className="text-xs text-gray-400">Max Transaction Retry Count per Campaign</label>
            <input
              type="number"
              value={maxTxs}
              onChange={(e) => setMaxTxs(Number(e.target.value))}
              className="w-full mt-1.5 bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">Maximum number of target transactions allowed in a single recovery campaign.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
