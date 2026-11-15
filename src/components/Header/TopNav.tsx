import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  Sparkles, 
  RotateCcw, 
  Menu, 
  Check, 
  ShieldCheck,
  PieChart 
} from 'lucide-react';
import { UserProfile, AppNotification } from '../../types';

interface TopNavProps {
  user: UserProfile;
  activeTab: string;
  onOpenMobileMenu: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenAI: () => void;
  onOpenBudgetModal?: () => void;
  onResetDemo: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  activeTab,
  onOpenMobileMenu,
  notifications,
  onOpenNotifications,
  onOpenSettings,
  onOpenAI,
  onOpenBudgetModal,
  onResetDemo,
  onUpdateUser,
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'wallet': return 'Digital Wallet & Overview';
      case 'savings': return 'Savings Goals & Vaults';
      case 'expenses': return 'Expense & Income Manager';
      case 'budget': return 'Smart Monthly Budget';
      case 'scanner': return 'AI Receipt Vision Scanner';
      case 'history': return 'Transaction Audit History';
      case 'analytics': return 'Analytics & Growth Reports';
      case 'settings': return 'System Settings & Security';
      default: return 'Digital Wallet';
    }
  };

  const currencies = [
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Menu Toggle & Active Page Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 xl:hidden shadow-xs hover:bg-slate-50"
            aria-label="Open Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                {getPageTitle(activeTab)}
              </h2>
              <span className="hidden sm:inline-block rounded-full bg-blue-50 border border-blue-200/60 px-2 py-0.2 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              PocketZapp AI • Personal Finance & Digital Wallet Assistant
            </p>
          </div>
        </div>

        {/* Right: Demo Badge, Currency, AI Button, Notifications, Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Demo Mode Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-amber-900 text-[11px]">DEMO MODE</span>
            <button
              type="button"
              onClick={onResetDemo}
              title="Reset sample data"
              className="ml-1 flex items-center gap-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          {/* Interactive Budget Health Popup Trigger */}
          {onOpenBudgetModal && (
            <button
              type="button"
              onClick={onOpenBudgetModal}
              title="Open Interactive Budget Health Overview"
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50/70 hover:bg-blue-100/70 px-2.5 py-1.5 text-xs font-bold text-blue-800 transition-all shadow-xs"
            >
              <PieChart className="h-3.5 w-3.5 text-blue-600" />
              <span>Budget Health</span>
            </button>
          )}

          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <span>{user.currency || '₹'}</span>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-32 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                {currencies.map((c) => (
                  <button
                    key={c.symbol}
                    type="button"
                    onClick={() => {
                      onUpdateUser({ ...user, currency: c.symbol });
                      setShowCurrencyDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                      user.currency === c.symbol
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.label}</span>
                    {user.currency === c.symbol && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={onOpenAI}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all hover:opacity-95 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Icon */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 transition-all"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
