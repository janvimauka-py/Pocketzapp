import React from 'react';
import { 
  Wallet, 
  PiggyBank, 
  Receipt, 
  PieChart, 
  History, 
  BarChart3, 
  Settings, 
  Sparkles, 
  RotateCcw, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { UserProfile } from '../../types';

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  walletBalance: number;
  currency: string;
  onOpenAI: () => void;
  onOpenAddMoney: () => void;
  onResetDemo: () => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  walletBalance,
  currency,
  onOpenAI,
  onOpenAddMoney,
  onResetDemo,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'wallet', label: 'Digital Wallet', desc: 'Overview & Balance', icon: Wallet, badge: 'Home' },
    { id: 'savings', label: 'Savings Goals', desc: 'Vaults & Milestones', icon: PiggyBank, badge: 'Vaults' },
    { id: 'expenses', label: 'Expense Manager', desc: 'Inflow & Outflow', icon: Receipt },
    { id: 'budget', label: 'Smart Budget', desc: 'Category Limits & Pace', icon: PieChart },
    { id: 'history', label: 'Transaction History', desc: 'Audit Trail & Receipts', icon: History },
    { id: 'analytics', label: 'Analytics & Reports', desc: 'Charts & Ratios', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Security', desc: 'PIN & Preferences', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5 select-none">
      
      {/* Top: Logo Branding */}
      <div>
        <div 
          onClick={() => handleNavClick('wallet')}
          className="flex cursor-pointer items-center gap-3 pb-5 border-b border-white/10 transition-transform active:scale-95"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 text-white shadow-lg shadow-indigo-600/30">
            <span className="font-black text-lg tracking-tighter">PZ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Pocket<span className="text-rose-400">Zapp</span>
              </span>
              <span className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 py-0.2 text-[9px] font-extrabold text-white tracking-widest uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Your Money. Your Insights.
            </p>
          </div>
        </div>

        {/* Live Wallet Balance Mini-Card */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-blue-950/80 p-3.5 border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-indigo-300 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Available Wallet</span>
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
              Active
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-xl font-black text-white">
              {currency}{walletBalance.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={onOpenAddMoney}
              className="flex items-center gap-1 rounded-lg bg-rose-500 hover:bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="mt-5 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'bg-white/5 text-slate-400 group-hover:text-blue-400 group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left truncate">
                    <p className={`font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Assistant Quick Pill */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onOpenAI}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-blue-900/60 p-3 border border-purple-500/30 text-xs font-bold text-white hover:border-purple-400 transition-all shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-white text-xs">Ask PocketZapp AI</p>
                <p className="text-[10px] text-purple-200 font-normal">Real-Time Insights</p>
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-purple-200">
              Open ✦
            </span>
          </button>
        </div>
      </div>

      {/* Bottom: Demo Reset & Profile */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={onResetDemo}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 py-2 text-xs font-semibold text-amber-300 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Demo Data</span>
        </button>

        {/* User Profile Card */}
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5 border border-white/10">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
            />
            <div className="truncate text-left text-xs">
              <p className="font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user.collegeId}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Lock Application"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden xl:flex fixed inset-y-0 left-0 z-30 w-72 flex-col bg-gradient-to-b from-slate-950 via-[#0B0F19] to-slate-950 border-r border-white/10 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide out overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative flex w-80 max-w-[85%] flex-col bg-gradient-to-b from-slate-950 via-[#0B0F19] to-slate-950 border-r border-white/10 shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
