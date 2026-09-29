import React, { useEffect, useState } from 'react';
import { TrendingDown, ShieldAlert, ArrowUpRight, AlertCircle, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RevenueRiskView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/risk/analytics')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center text-xs text-blue-400">
        Loading Revenue Risk Analytics...
      </div>
    );
  }

  const summary = data?.summary || {
    total_revenue_at_risk: 0,
    failed_transaction_value: 0,
    abandoned_checkout_value: 0,
    subscription_failure_value: 0,
    expected_recoverable: 0
  };

  const byMethod = data?.by_method || [];
  const byCode = data?.by_failure_code || [];

  const formatCurrency = (val: number) => `₹${val?.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-rose-400" />
          <span>Revenue Risk Analytics Control Tower</span>
        </h2>
        <p className="text-xs text-gray-400">Multi-dimensional analysis calculated directly from database transaction records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-xs text-gray-400 font-medium">Total Revenue At Risk</span>
          <div className="text-2xl font-extrabold text-white mt-1">{formatCurrency(summary.total_revenue_at_risk)}</div>
          <span className="text-[11px] text-rose-400">Calculated from failed & abandoned events</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-blue-500/20 bg-blue-950/10">
          <span className="text-xs text-gray-400 font-medium">Failed Transaction Value</span>
          <div className="text-2xl font-extrabold text-white mt-1">{formatCurrency(summary.failed_transaction_value)}</div>
          <span className="text-[11px] text-blue-400">Direct gateway rejections</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <span className="text-xs text-gray-400 font-medium">Abandoned Checkout Value</span>
          <div className="text-2xl font-extrabold text-white mt-1">{formatCurrency(summary.abandoned_checkout_value)}</div>
          <span className="text-[11px] text-amber-400">Mobile payment sessions dropped</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-xs text-gray-400 font-medium">Expected Recoverable Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{formatCurrency(summary.expected_recoverable)}</div>
          <span className="text-[11px] text-emerald-400">Estimated recovery probability output</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: By Payment Method */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="font-bold text-sm text-white mb-1">Revenue Risk by Payment Method</h3>
          <p className="text-xs text-gray-400 mb-4">Concentration by payment channel (INR)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMethod} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="method" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
                <Bar dataKey="amount" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: By Failure Code */}
        <div className="glass-panel p-5 rounded-xl border border-gray-800">
          <h3 className="font-bold text-sm text-white mb-1">Revenue Risk by Failure Code</h3>
          <p className="text-xs text-gray-400 mb-4">Root cause error code distribution (INR)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCode} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={11} />
                <YAxis type="category" dataKey="failure_code" stroke="#6B7280" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
