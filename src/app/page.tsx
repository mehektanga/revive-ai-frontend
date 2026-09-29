'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KPICards from '@/components/KPICards';
import Charts from '@/components/Charts';
import SimulatorControls from '@/components/SimulatorControls';
import IncidentDetailModal from '@/components/IncidentDetailModal';
import HackathonDemoModal from '@/components/HackathonDemoModal';
import CommandCenterBar from '@/components/CommandCenterBar';
import AuditTimeline from '@/components/AuditTimeline';
import AnalyticsView from '@/components/AnalyticsView';
import RevenueRiskView from '@/components/RevenueRiskView';
import RecoveryControlView from '@/components/RecoveryControlView';
import TransactionsView from '@/components/TransactionsView';
import SettingsView from '@/components/SettingsView';

import { 
  AlertTriangle, RefreshCw, ChevronRight, ArrowUpRight, 
  ShieldCheck, CheckCircle2, Sliders, Receipt
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [riskPolicy, setRiskPolicy] = useState<any>(null);

  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      const [dbRes, chartRes, incRes, campRes, auditRes, txRes, polRes] = await Promise.all([
        fetch('/api/dashboard').then((r) => r.json()),
        fetch('/api/dashboard/charts').then((r) => r.json()),
        fetch('/api/incidents').then((r) => r.json()),
        fetch('/api/recovery/campaigns').then((r) => r.json()),
        fetch('/api/audit').then((r) => r.json()),
        fetch('/api/transactions?limit=25').then((r) => r.json()),
        fetch('/api/risk/policy').then((r) => r.json())
      ]);

      setDashboardData(dbRes);
      setChartData(chartRes);
      setIncidents(incRes || []);
      setCampaigns(campRes || []);
      setAuditLogs(auditRes || []);
      setTransactions(txRes.transactions || []);
      setRiskPolicy(polRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, []);

  const openIncidentDetail = (inc: any) => {
    setSelectedIncident(inc);
    setIsIncidentModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#080C14] text-gray-100 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeIncidentsCount={incidents.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onRunDemo={() => setIsDemoModalOpen(true)}
          onOpenQuery={() => setIsQueryModalOpen(true)}
        />

        <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <KPICards data={dashboardData} />
              <SimulatorControls onRefresh={refreshData} isCompact={true} />
              <Charts chartData={chartData} />

              {/* Incidents & Active Campaigns Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Incidents Card */}
                <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Active Incidents ({incidents.length})</span>
                    </h3>
                    <button 
                      onClick={() => setActiveTab('incidents')}
                      className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {incidents.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No active incidents detected. Payment success rate is operating at baseline (~91.4%).
                      </div>
                    ) : (
                      incidents.slice(0, 3).map((inc) => (
                        <div 
                          key={inc.id}
                          onClick={() => openIncidentDetail(inc)}
                          className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 hover:bg-rose-950/20 cursor-pointer transition flex justify-between items-center"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                {inc.status}
                              </span>
                              <span className="text-xs font-mono text-gray-400">{inc.incident_code}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1">{inc.title}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Revenue at risk: <span className="font-bold text-rose-400">₹{inc.revenue_at_risk?.toLocaleString()}</span> • {inc.affected_transactions} txs
                            </p>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                            Investigate
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recovery Campaigns Card */}
                <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>Recovery Campaigns ({campaigns.length})</span>
                    </h3>
                    <button 
                      onClick={() => setActiveTab('recovery')}
                      className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Control Center</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {campaigns.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No recovery campaigns created yet. Click <span className="text-blue-400 font-bold">🚀 RUN HACKATHON DEMO</span> to trigger recovery.
                      </div>
                    ) : (
                      campaigns.slice(0, 3).map((camp) => (
                        <div key={camp.id} className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white font-mono">{camp.campaign_code}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              camp.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                              camp.status === 'HALTED' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {camp.status}
                            </span>
                          </div>

                          <div className="flex justify-between text-gray-400">
                            <span>Attempted: {camp.attempted_transactions}/{camp.total_transactions}</span>
                            <span className="font-bold text-emerald-400">Recovered: ₹{camp.revenue_recovered?.toLocaleString()}</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full transition-all"
                              style={{ width: `${Math.min(100, ((camp.attempted_transactions || 0) / Math.max(1, camp.total_transactions || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Revenue Risk Tab */}
          {activeTab === 'risk' && <RevenueRiskView />}

          {/* Incidents Tab */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                <h2 className="text-lg font-extrabold text-white">Incident Control Center</h2>
                <p className="text-xs text-gray-400">Detected payment degradation incidents requiring investigation</p>
              </div>

              <div className="space-y-3">
                {incidents.length === 0 ? (
                  <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center space-y-3">
                    <p className="text-xs text-gray-400">No active incidents detected in the payment stream.</p>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs"
                    >
                      Open Simulator to Inject Scenario
                    </button>
                  </div>
                ) : (
                  incidents.map((inc) => (
                    <div key={inc.id} className="glass-panel p-5 rounded-xl border border-gray-800 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {inc.status}
                          </span>
                          <span className="text-xs font-mono text-gray-400">{inc.incident_code}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{inc.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Revenue At Risk: <span className="font-bold text-rose-400">₹{inc.revenue_at_risk?.toLocaleString()}</span> | 
                          Affected Transactions: {inc.affected_transactions} | 
                          Failure Rate: {(inc.current_failure_rate * 100).toFixed(1)}%
                        </p>
                      </div>

                      <button 
                        onClick={() => openIncidentDetail(inc)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Investigate & Execute
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Recovery Control Center Tab */}
          {activeTab === 'recovery' && (
            <RecoveryControlView 
              campaigns={campaigns} 
              incidents={incidents} 
              onRefresh={refreshData}
              onOpenIncidentDetail={openIncidentDetail}
            />
          )}

          {/* Simulator Tab */}
          {activeTab === 'simulator' && (
            <SimulatorControls onRefresh={refreshData} isCompact={false} />
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && <TransactionsView />}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && <AuditTimeline logs={auditLogs} />}

          {/* Analytics / ML Evaluation Tab */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <IncidentDetailModal 
        isOpen={isIncidentModalOpen} 
        onClose={() => setIsIncidentModalOpen(false)} 
        incident={selectedIncident}
        onRefresh={refreshData}
      />

      <HackathonDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)}
        onRefresh={refreshData}
      />

      <CommandCenterBar 
        isOpen={isQueryModalOpen} 
        onClose={() => setIsQueryModalOpen(false)} 
      />
    </div>
  );
}

function maxOne(val: number) {
  return !val || val <= 0 ? 1 : val;
}
