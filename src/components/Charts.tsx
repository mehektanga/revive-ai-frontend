import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface ChartsProps {
  chartData: {
    hourly_trend: any[];
    method_breakdown: any[];
    funnel: any[];
  } | null;
}

export default function Charts({ chartData }: ChartsProps) {
  const hourlyData = chartData?.hourly_trend || [];
  const methodData = chartData?.method_breakdown || [];

  const COLORS = ['#F43F5E', '#3B82F6', '#F59E0B', '#10B981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Chart 1: Revenue at Risk & Success Rate Trend */}
      <div className="glass-panel p-5 rounded-xl lg:col-span-2 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-sm text-white">Payment Success Rate & Revenue Spike Trend</h3>
            <p className="text-xs text-gray-400">12-hour sliding window monitoring</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Success Rate %
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Revenue Risk (₹)
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="hour" stroke="#6B7280" fontSize={11} />
              <YAxis yAxisId="left" stroke="#6B7280" fontSize={11} domain={[50, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="success_rate" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" name="Success Rate %" />
              <Area yAxisId="right" type="monotone" dataKey="revenue_at_risk" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Revenue Risk (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Failure Rate by Payment Method */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800">
        <div className="mb-4">
          <h3 className="font-bold text-sm text-white">Failure Rate by Method</h3>
          <p className="text-xs text-gray-400">Concentration analysis</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={methodData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="method" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="failure_rate" radius={[4, 4, 0, 0]}>
                {methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#F43F5E' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
