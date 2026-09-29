import React from 'react';
import { 
  LayoutDashboard, 
  TrendingDown, 
  AlertTriangle, 
  RefreshCw, 
  PlayCircle, 
  Receipt, 
  History, 
  BarChart3, 
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeIncidentsCount?: number;
}

export default function Sidebar({ activeTab, setActiveTab, activeIncidentsCount = 0 }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'risk', label: 'Revenue Risk', icon: TrendingDown },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      icon: AlertTriangle, 
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount} CRITICAL` : 'HEALTHY',
      badgeColor: activeIncidentsCount > 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    { id: 'recovery', label: 'Recovery Control', icon: RefreshCw },
    { id: 'simulator', label: 'Simulator', icon: PlayCircle },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'analytics', label: 'ML Evaluation', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Policy', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0B0F19] flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide">Revive<span className="text-blue-500">AI</span></h1>
            <p className="text-[11px] text-gray-400 font-medium">Revenue Recovery Control</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Merchant Profile */}
      <div className="p-4 border-t border-gray-800 bg-[#0D1320]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-400">
            DS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">DemoStore India</p>
            <p className="text-[10px] text-gray-400 truncate">ID: merchant_demostore</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
