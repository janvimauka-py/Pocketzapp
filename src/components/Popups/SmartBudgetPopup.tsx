import React from 'react';
import { PieChart, AlertTriangle, CheckCircle, TrendingUp, X, ArrowRight, Sliders, ShieldAlert } from 'lucide-react';
import { Budget } from '../../types';

interface SmartBudgetPopupProps {
  isOpen: boolean;
  budget: Budget;
  currency: string;
  totalSavings: number;
  categorySpending: Record<string, number>;
  onClose: () => void;
  onNavigateToBudget: () => void;
}

export const SmartBudgetPopup: React.FC<SmartBudgetPopupProps> = ({
  isOpen,
  budget,
  currency,
  totalSavings,
  categorySpending,
  onClose,
  onNavigateToBudget,
}) => {
  if (!isOpen) return null;

  const totalSpent = budget.spent;
  const limit = budget.monthlyLimit || 1;
  const percentage = Math.min(100, Math.round((totalSpent / limit) * 100));
  const remaining = Math.max(0, limit - totalSpent);

  // SVG Progress Ring calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let alertBadge = null;
  if (percentage >= 100) {
    alertBadge = {
      level: 'critical',
      title: '100% Limit Reached!',
      desc: 'You have completely exhausted your budget for this month.',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
    };
  } else if (percentage >= 90) {
    alertBadge = {
      level: 'warning',
      title: '90% Budget Warning',
      desc: 'Budget almost exhausted! Freeze discretionary purchases.',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
    };
  } else if (percentage >= 70) {
    alertBadge = {
      level: 'notice',
      title: '70% Spending Milestone',
      desc: 'You have crossed 70% of your budget. Slow down spending pace.',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertTriangle,
    };
  }

  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <PieChart className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Monthly Smart Budget Overview</h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                November 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">Real-time spending pace & category health</p>
          </div>
        </div>

        {/* Alert Notification banner if >= 70% */}
        {alertBadge && (
          <div className={`mt-4 flex items-center gap-3 rounded-2xl border p-3 ${alertBadge.color}`}>
            <alertBadge.icon className="h-5 w-5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">{alertBadge.title}</p>
              <p className="text-slate-600">{alertBadge.desc}</p>
            </div>
          </div>
        )}

        {/* Progress Ring & Core Metrics */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 border border-slate-100">
          
          {/* Circular Progress Ring */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="h-28 w-28 -rotate-90 transform">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={percentage >= 90 ? '#EF4444' : percentage >= 70 ? '#F59E0B' : '#10B981'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-slate-900">{percentage}%</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Utilized</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Monthly Budget</span>
              <p className="text-sm font-bold text-slate-800">{currency}{budget.monthlyLimit.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Spent</span>
              <p className="text-sm font-bold text-rose-600">{currency}{totalSpent.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Remaining</span>
              <p className="text-sm font-bold text-emerald-600">{currency}{remaining.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Savings</span>
              <p className="text-sm font-bold text-blue-700">{currency}{totalSavings.toFixed(2)}</p>
            </div>
          </div>

        </div>

        {/* Category Breakdown Bars */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Top Category Utilization</span>
            <span className="text-[11px] text-slate-400">Spent / Limit</span>
          </div>

          <div className="mt-2.5 space-y-2">
            {topCategories.map(([cat, amt]) => {
              const catLimit = budget.categoryLimits[cat] || 300;
              const catPct = Math.min(100, Math.round((amt / catLimit) * 100));
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="text-slate-500">
                      {currency}{amt.toFixed(2)} <span className="text-slate-400">/ {currency}{catLimit}</span> ({catPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        catPct >= 90 ? 'bg-rose-500' : catPct >= 75 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Working Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToBudget();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
          >
            <span>View Full Budget</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToBudget();
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Sliders className="h-4 w-4 text-slate-500" />
            <span>Manage Limits</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
