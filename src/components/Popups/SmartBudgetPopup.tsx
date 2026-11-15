import React, { useState } from 'react';
import { 
  PieChart, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  X, 
  ArrowRight, 
  Sliders, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  ArrowRightLeft,
  ChevronRight,
  Info
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'rebalance'>('overview');
  const [simulatedExtraSpend, setSimulatedExtraSpend] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Food');

  if (!isOpen) return null;

  const baseSpent = budget.spent;
  const limit = budget.monthlyLimit || 1;
  const effectiveSpent = baseSpent + simulatedExtraSpend;
  const percentage = Math.min(100, Math.round((effectiveSpent / limit) * 100));
  const remaining = Math.max(0, limit - effectiveSpent);

  // SVG Progress Ring calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let alertBadge = null;
  if (percentage >= 100) {
    alertBadge = {
      level: 'critical',
      title: '100% Limit Reached!',
      desc: simulatedExtraSpend > 0 
        ? `With +${currency}${simulatedExtraSpend.toLocaleString()} simulated spend, your budget is completely exhausted!`
        : 'You have completely exhausted your budget for this month.',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
    };
  } else if (percentage >= 90) {
    alertBadge = {
      level: 'warning',
      title: '90% Budget Warning',
      desc: simulatedExtraSpend > 0
        ? `With +${currency}${simulatedExtraSpend.toLocaleString()} simulated spend, you reach the danger zone!`
        : 'Budget almost exhausted! Freeze discretionary purchases.',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
    };
  } else if (percentage >= 70) {
    alertBadge = {
      level: 'notice',
      title: '70% Spending Milestone',
      desc: 'You have crossed 70% of your budget. Slow down your daily pace.',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertTriangle,
    };
  }

  const allCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-7 max-h-[92vh] overflow-y-auto">
        
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shrink-0">
            <PieChart className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">Interactive Budget Health</h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                November 2026
              </span>
            </div>
            <p className="text-xs text-slate-500">Live dynamic analytics & real-time simulation</p>
          </div>
        </div>

        {/* Interactive View Tabs */}
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 rounded-xl py-2 text-center transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 rounded-xl py-2 text-center transition-all flex items-center justify-center gap-1 ${
              activeTab === 'simulator'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Spend Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rebalance')}
            className={`flex-1 rounded-xl py-2 text-center transition-all flex items-center justify-center gap-1 ${
              activeTab === 'rebalance'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="h-3 w-3" />
            <span>Rebalance</span>
          </button>
        </div>

        {/* Dynamic Alert Banner */}
        {alertBadge && (
          <div className={`mt-3.5 flex items-center gap-3 rounded-2xl border p-3 ${alertBadge.color} transition-all`}>
            <alertBadge.icon className="h-5 w-5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">{alertBadge.title}</p>
              <p className="text-slate-600">{alertBadge.desc}</p>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-4 space-y-4">
            {/* Progress Ring & Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 border border-slate-100">
              
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
                      className="transition-all duration-700 ease-out"
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
                  <p className="text-sm font-bold text-slate-800">{currency}{budget.monthlyLimit.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Spent</span>
                  <p className="text-sm font-bold text-rose-600">{currency}{effectiveSpent.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Remaining</span>
                  <p className="text-sm font-bold text-emerald-600">{currency}{remaining.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Savings</span>
                  <p className="text-sm font-bold text-blue-700">{currency}{totalSavings.toLocaleString()}</p>
                </div>
              </div>

            </div>

            {/* Interactive Category Breakdown Bars */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Category Breakdown (Click to inspect)</span>
                <span className="text-[11px] text-slate-400">Spent / Limit</span>
              </div>

              <div className="space-y-2">
                {allCategories.slice(0, 4).map(([cat, amt]) => {
                  const catLimit = budget.categoryLimits[cat] || 5000;
                  const catPct = Math.min(100, Math.round((amt / catLimit) * 100));
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left p-2 rounded-xl transition-all border ${
                        isSelected 
                          ? 'border-blue-400 bg-blue-50/70 shadow-xs' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                          {cat}
                        </span>
                        <span className="text-slate-600 font-mono">
                          {currency}{amt.toLocaleString()} <span className="text-slate-400 font-sans">/ {currency}{catLimit.toLocaleString()}</span> ({catPct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            catPct >= 90 ? 'bg-rose-500' : catPct >= 75 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${catPct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPEND SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">Simulate Expense Impact</span>
                {simulatedExtraSpend > 0 && (
                  <button
                    type="button"
                    onClick={() => setSimulatedExtraSpend(0)}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Test how additional purchases would affect your monthly budget health in real time:
              </p>

              {/* Quick Interactive Spend Chips */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => {
                  const isActive = simulatedExtraSpend === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSimulatedExtraSpend(amt)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all border ${
                        isActive
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      +{currency}{amt}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Range Slider */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Custom Spend Amount</span>
                  <span className="text-blue-700 font-bold">+{currency}{simulatedExtraSpend.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="250"
                  value={simulatedExtraSpend}
                  onChange={(e) => setSimulatedExtraSpend(parseInt(e.target.value) || 0)}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Simulation Result Preview */}
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Simulated Total</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{currency}{effectiveSpent.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">New Utilization</span>
                  <p className={`font-extrabold mt-0.5 ${percentage >= 90 ? 'text-rose-600' : 'text-blue-700'}`}>
                    {percentage}%
                  </p>
                </div>
                <div className="rounded-xl bg-white p-2 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">New Buffer</span>
                  <p className="font-extrabold text-emerald-600 mt-0.5">{currency}{remaining.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REBALANCE */}
        {activeTab === 'rebalance' && (
          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h4 className="font-bold text-indigo-950">AI Limit Rebalance Suggestion</h4>
              </div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Food has reached 85% of allowance, while Education has a surplus of {currency}3,500. Shifting {currency}2,000 from Education to Food avoids warning thresholds!
              </p>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3 border border-indigo-100">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold">From Education</span>
                  <p className="font-bold text-slate-800">- {currency}2,000</p>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-500" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold">To Food Allowance</span>
                  <p className="font-bold text-emerald-600">+ {currency}2,000</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Working Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToBudget();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            <span>View Full Budget Manager</span>
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
