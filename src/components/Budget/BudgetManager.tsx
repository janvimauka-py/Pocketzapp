import React, { useState } from 'react';
import { 
  PieChart, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  History, 
  Edit3, 
  X, 
  Save 
} from 'lucide-react';
import { Budget } from '../../types';
import { Page3DHero } from '../Visuals/Page3DHero';

interface BudgetManagerProps {
  budget: Budget;
  currency: string;
  categorySpending: Record<string, number>;
  onUpdateBudget: (budget: Budget) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budget,
  currency,
  categorySpending,
  onUpdateBudget,
}) => {
  const [isEditingLimit, setIsEditingLimit] = useState<boolean>(false);
  const [monthlyLimitInput, setMonthlyLimitInput] = useState<string>(budget.monthlyLimit.toString());
  const [categoryLimitsState, setCategoryLimitsState] = useState<Record<string, number>>(budget.categoryLimits);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  const totalSpent = budget.spent;
  const currentLimit = budget.monthlyLimit || 1;
  const utilization = Math.round((totalSpent / currentLimit) * 100);
  const remaining = Math.max(0, currentLimit - totalSpent);

  const categories = ['Food', 'Shopping', 'Travel', 'Education', 'Entertainment', 'Health', 'Other'];

  const handleSaveMonthlyLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monthlyLimitInput);
    if (isNaN(num) || num <= 0) return;

    const updated = { ...budget, monthlyLimit: num };
    onUpdateBudget(updated);
    setIsEditingLimit(false);
    triggerSuccess('Monthly budget limit updated!');
  };

  const handleSaveCategoryLimits = () => {
    const updated = { ...budget, categoryLimits: categoryLimitsState };
    onUpdateBudget(updated);
    setShowCategoryModal(false);
    triggerSuccess('Category budget limits updated!');
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const previousMonths = [
    { month: 'October 2026', limit: 50000, spent: 46200, saved: 3800, status: 'Under Budget', color: 'text-emerald-600' },
    { month: 'September 2026', limit: 48000, spent: 47600, saved: 400, status: 'Under Budget', color: 'text-emerald-600' },
    { month: 'August 2026', limit: 45000, spent: 47200, saved: 0, status: 'Over Budget (+₹2,200)', color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Precision Target & Glowing Shield */}
      <Page3DHero
        pageId="budget"
        title="Smart Monthly Budget & Limits"
        subtitle="Dynamic budget utilization monitoring with proactive 70%, 90%, and 100% threshold safety alerts."
        badgeText="3D Precision Orbit Active"
        actionButtonText="Adjust Monthly Limit"
        onActionButtonClick={() => setIsEditingLimit(true)}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Smart Budget Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Set spending thresholds, track category limits, and prevent overspending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingLimit(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Monthly Budget</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Sliders className="h-4 w-4 text-slate-500" />
            <span>Category Limits</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Budget Health Banner */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30">
                November 2026 Cycle
              </span>
              {utilization >= 100 ? (
                <span className="flex items-center gap-1 rounded-full bg-rose-500/30 border border-rose-400/50 px-2.5 py-1 text-xs font-bold text-rose-300">
                  <ShieldAlert className="h-3.5 w-3.5" /> 100% Exceeded
                </span>
              ) : utilization >= 90 ? (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/30 border border-amber-400/50 px-2.5 py-1 text-xs font-bold text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" /> 90% Warning
                </span>
              ) : utilization >= 70 ? (
                <span className="flex items-center gap-1 rounded-full bg-blue-400/30 border border-blue-300/50 px-2.5 py-1 text-xs font-bold text-blue-200">
                  <AlertTriangle className="h-3.5 w-3.5" /> 70% Alert
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/30 border border-emerald-400/50 px-2.5 py-1 text-xs font-bold text-emerald-300">
                  Healthy Zone
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Total Spent</span>
                <p className="text-3xl sm:text-4xl font-black text-white">
                  {currency}{totalSpent.toFixed(2)}
                </p>
              </div>
              <span className="text-2xl text-blue-400/50 font-light hidden sm:inline">/</span>
              <div>
                <span className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Monthly Limit</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-100">
                  {currency}{budget.monthlyLimit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/10 shrink-0 text-center sm:text-left">
            <span className="text-xs text-blue-200 font-medium">Safe Remaining Balance</span>
            <p className="text-3xl font-black text-emerald-300 mt-1">
              {currency}{remaining.toFixed(2)}
            </p>
            <p className="text-[11px] text-blue-200 mt-1">
              Safe Daily Spend: <strong>{currency}{(remaining / 15).toFixed(2)}/day</strong>
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold text-blue-200 mb-2">
            <span>Overall Budget Consumption</span>
            <span className="font-extrabold text-white text-sm">{utilization}%</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/15 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                utilization >= 100
                  ? 'bg-rose-500'
                  : utilization >= 90
                  ? 'bg-amber-400'
                  : utilization >= 70
                  ? 'bg-blue-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category-wise Limits & Live Spending */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Category Budget Utilization</h3>
            <p className="text-xs text-slate-500">Live monitoring against allocated limits</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Adjust Limits
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {categories.map((cat) => {
            const spent = categorySpending[cat] || 0;
            const limit = budget.categoryLimits[cat] || 300;
            const pct = Math.min(100, Math.round((spent / limit) * 100));
            const isExceeded = spent >= limit;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{cat}</span>
                    {isExceeded && (
                      <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-bold text-rose-600">
                        Exceeded
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{currency}{spent.toFixed(2)}</span>
                    <span className="text-slate-400"> / {currency}{limit.toFixed(2)} ({pct}%)</span>
                  </div>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Months Comparison & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Previous Months Table */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Previous Months Comparison</h3>
              <p className="text-xs text-slate-400">Quarterly budget adherence history</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {previousMonths.map((m) => (
              <div key={m.month} className="flex items-center justify-between py-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800">{m.month}</p>
                  <p className="text-slate-400">Limit: {currency}{m.limit}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{currency}{m.spent}</p>
                  <span className={`text-[11px] font-semibold ${m.color}`}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AI Budget Optimization</h3>
              <p className="text-xs text-slate-400">Proactive actions to stay within limit</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
              <p className="font-bold text-blue-900">🍜 Food & Dining Alert</p>
              <p className="mt-1 text-slate-600">
                You've used over 85% of your food allowance. Swapping two dining-out meals for campus mess dinners this week will keep you within budget.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
              <p className="font-bold text-emerald-900">💡 Buffer Rebalancing</p>
              <p className="mt-1 text-slate-600">
                You currently have surplus in Health and Education. Consider shifting ₹2,500 of unused limit to Food to avoid warning flags.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Edit Monthly Limit */}
      {isEditingLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsEditingLimit(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Set Monthly Budget Limit</h3>
            <p className="text-xs text-slate-400">Total allowance for November 2026</p>

            <form onSubmit={handleSaveMonthlyLimit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Budget Limit ({currency})</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={monthlyLimitInput}
                  onChange={(e) => setMonthlyLimitInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-2xl font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLimit(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Category Limits */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Set Category Limits</h3>
            <p className="text-xs text-slate-400">Customize caps for each spending category</p>

            <div className="mt-4 space-y-3">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-slate-800 w-28">{cat}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold">{currency}</span>
                    <input
                      type="number"
                      min="10"
                      value={categoryLimitsState[cat] || 300}
                      onChange={(e) =>
                        setCategoryLimitsState({
                          ...categoryLimitsState,
                          [cat]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategoryLimits}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
              >
                Save Limits
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
