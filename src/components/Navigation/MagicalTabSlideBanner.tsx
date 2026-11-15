import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  Utensils,
  Coffee,
  BookOpen,
  Car,
  PieChart,
  ScanLine,
  ShieldCheck,
  Zap,
  TrendingUp,
  History,
  BarChart3,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, Transaction } from '../../types';

interface MagicalTabSlideBannerProps {
  activeTab: string;
  walletBalance: number;
  currency: string;
  savingsGoals: SavingsGoal[];
  onQuickDeposit?: (goalId: string, amount: number) => void;
  onQuickExpense?: (tx: Transaction) => void;
}

export const MagicalTabSlideBanner: React.FC<MagicalTabSlideBannerProps> = ({
  activeTab,
  walletBalance,
  currency,
  savingsGoals,
  onQuickDeposit,
  onQuickExpense,
}) => {
  const [animKey, setAnimKey] = useState<string>(activeTab);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Trigger smooth magical slide-in whenever activeTab changes
  useEffect(() => {
    setAnimKey(`${activeTab}_${Date.now()}`);
    setIsDismissed(false);
  }, [activeTab]);

  const iphoneGoal = savingsGoals.find((g) => g.name.includes('iPhone')) || savingsGoals[0];

  const handleDeposit = (amount: number) => {
    if (!iphoneGoal || !onQuickDeposit) return;
    if (amount > walletBalance) {
      alert(`Insufficient wallet balance (${currency}${walletBalance.toLocaleString()})`);
      return;
    }
    onQuickDeposit(iphoneGoal.id, amount);
    setToastMsg(`+${currency}${amount} added to ${iphoneGoal.name}! 🚀`);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.25 },
    });
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleExpense = (desc: string, category: any, amount: number) => {
    if (!onQuickExpense) return;
    if (amount > walletBalance) {
      alert(`Insufficient balance (${currency}${walletBalance.toLocaleString()})`);
      return;
    }
    const tx: Transaction = {
      id: `TXN-MAG-${Date.now().toString().slice(-6)}`,
      type: 'expense',
      amount,
      description: desc,
      category,
      recipientOrMerchant: `Campus: ${desc}`,
      paymentMethod: 'PocketZapp Instant 1-Tap',
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-MAG-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `1-Tap Campus situation log: ${desc}`,
    };
    onQuickExpense(tx);
    setToastMsg(`Logged ${currency}${amount} for ${desc}! 🥪`);
    confetti({
      particleCount: 45,
      spread: 45,
      origin: { y: 0.25 },
    });
    setTimeout(() => setToastMsg(''), 2500);
  };

  if (isDismissed) return null;

  return (
    <div
      key={animKey}
      className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-lg shadow-indigo-500/5 backdrop-blur-md transition-all animate-magicalSlide"
    >
      <div className="relative">
        
        {/* Background ambient decorative glow */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/10 via-blue-400/15 to-emerald-400/10 blur-2xl pointer-events-none" />

        {/* Floating feedback toast */}
        {toastMsg && (
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-emerald-500/20 animate-scaleIn">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{toastMsg}</span>
            </span>
          </div>
        )}

        {/* ==================== 1. SAVINGS TAB: WALLET WITH MONEY SLIDING ICONS ==================== */}
        {activeTab === 'savings' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* 3D Wallet with Money Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 animate-pulseGently">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
                      Wallet with Money
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                      Live
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Wallet Funds &rarr; iPhone 19 Pro Max Vault
                  </h3>
                </div>
              </div>

              {/* Quick 1-Tap Deposit Chips directly into iPhone 19 */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">1-Tap Feed:</span>
                {[500, 1000, 2000].map((amt, idx) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleDeposit(amt)}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-xs hover:shadow-md transition-all active:scale-95 animate-slideIcon"
                  >
                    <span>+{currency}{amt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliding Feature Icons Bar */}
            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {/* Sliding Icon 1: Live Wallet Balance */}
              <div
                style={{ animationDelay: '100ms' }}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 shrink-0 animate-slideIcon"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Coins className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Available in Wallet</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {currency}{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Sliding Icon 2: iPhone 19 Goal Target */}
              <div
                style={{ animationDelay: '200ms' }}
                className="flex items-center gap-2 rounded-2xl border border-blue-200/80 bg-blue-50/70 px-3.5 py-2 shrink-0 animate-slideIcon"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-500 block">Priority Goal</span>
                  <span className="font-extrabold text-blue-950 text-xs">
                    {iphoneGoal?.name || 'iPhone 19 Pro Max'}
                  </span>
                </div>
              </div>

              {/* Sliding Icon 3: Progress percentage */}
              <div
                style={{ animationDelay: '300ms' }}
                className="flex items-center gap-2 rounded-2xl border border-indigo-200/80 bg-indigo-50/70 px-3.5 py-2 shrink-0 animate-slideIcon"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block">Vault Completion</span>
                  <span className="font-extrabold text-indigo-950 text-xs">
                    {iphoneGoal ? `${Math.min(100, Math.round((iphoneGoal.currentAmount / iphoneGoal.targetAmount) * 100))}% Saved` : '78%'}
                  </span>
                </div>
              </div>

              {/* Sliding Icon 4: Auto Round-up */}
              <div
                style={{ animationDelay: '400ms' }}
                className="flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2 shrink-0 animate-slideIcon"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Micro-Savings</span>
                  <span className="font-extrabold text-amber-950 text-xs">Auto Round-ups Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. EXPENSES TAB: SITUATIONAL CAMPUS SLIDING ICONS ==================== */}
        {activeTab === 'expenses' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25 animate-pulseGently">
                  <Zap className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      Situational Campus Quick-Log
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-800">
                      1-Tap
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Quick-Log Daily College Spending Scenarios
                  </h3>
                </div>
              </div>
            </div>

            {/* Sliding Campus Situational Chips */}
            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              
              {/* Situation 1: Mess / Canteen */}
              <button
                type="button"
                onClick={() => handleExpense('Campus Canteen / Mess Lunch', 'Food', 120)}
                style={{ animationDelay: '100ms' }}
                className="flex items-center gap-2.5 rounded-2xl border border-amber-200/90 bg-amber-50/70 hover:bg-amber-100/80 px-3.5 py-2 shrink-0 transition-all active:scale-95 animate-slideIcon text-left group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs group-hover:scale-110 transition-transform">
                  <Utensils className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Hostel Mess</span>
                  <span className="font-extrabold text-slate-900 text-xs">{currency}120</span>
                </div>
              </button>

              {/* Situation 2: Tapri Chai */}
              <button
                type="button"
                onClick={() => handleExpense('Chai & Snacks at Campus Tapri', 'Food', 40)}
                style={{ animationDelay: '200ms' }}
                className="flex items-center gap-2.5 rounded-2xl border border-orange-200/90 bg-orange-50/70 hover:bg-orange-100/80 px-3.5 py-2 shrink-0 transition-all active:scale-95 animate-slideIcon text-left group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-xs group-hover:scale-110 transition-transform">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-700 block">Tapri Chai</span>
                  <span className="font-extrabold text-slate-900 text-xs">{currency}40</span>
                </div>
              </button>

              {/* Situation 3: Exam Xerox */}
              <button
                type="button"
                onClick={() => handleExpense('Exam Notes & Lab Xerox', 'Education', 65)}
                style={{ animationDelay: '300ms' }}
                className="flex items-center gap-2.5 rounded-2xl border border-blue-200/90 bg-blue-50/70 hover:bg-blue-100/80 px-3.5 py-2 shrink-0 transition-all active:scale-95 animate-slideIcon text-left group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">Exam Xerox</span>
                  <span className="font-extrabold text-slate-900 text-xs">{currency}65</span>
                </div>
              </button>

              {/* Situation 4: Campus Metro/Cab */}
              <button
                type="button"
                onClick={() => handleExpense('Metro / Auto Ride to Campus', 'Travel', 80)}
                style={{ animationDelay: '400ms' }}
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/80 px-3.5 py-2 shrink-0 transition-all active:scale-95 animate-slideIcon text-left group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Campus Ride</span>
                  <span className="font-extrabold text-slate-900 text-xs">{currency}80</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 3. BUDGET TAB: SLIDING PACE ICONS ==================== */}
        {activeTab === 'budget' && (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Smart Pace Guardian
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Daily Allowance & Category Health
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <div style={{ animationDelay: '100ms' }} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-emerald-800">Safe-to-Spend Today: {currency}420.00</span>
              </div>
              <div style={{ animationDelay: '200ms' }} className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-blue-800">Monthly Pace: 74% (On Track)</span>
              </div>
              <div style={{ animationDelay: '300ms' }} className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-violet-800">Protected Vault: iPhone 19 Pro Max</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. SCANNER TAB: SLIDING OCR ICONS ==================== */}
        {activeTab === 'scanner' && (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/25">
                  <ScanLine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Vision Active
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Instant Optical Receipt & GST Scanner
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <div style={{ animationDelay: '100ms' }} className="flex items-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-cyan-800">📸 Camera & File Upload Ready</span>
              </div>
              <div style={{ animationDelay: '200ms' }} className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-blue-800">🧾 Automatic Tax & Total Extraction</span>
              </div>
              <div style={{ animationDelay: '300ms' }} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-emerald-800">⚡ 1-Tap Auto-Logging to Wallet</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. WALLET TAB: SLIDING MONEY FLOW ICONS ==================== */}
        {activeTab === 'wallet' && (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/25">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Digital Wallet Hub
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Live Cash Balance & Fast UPI Access
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <div style={{ animationDelay: '100ms' }} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-emerald-800">Balance: {currency}{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ animationDelay: '200ms' }} className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-blue-800">Contact: Rishabh (rishabh@okhdfcbank)</span>
              </div>
              <div style={{ animationDelay: '300ms' }} className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-indigo-800">Security PIN: 1507 (Locked)</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. HISTORY TAB: SLIDING LEDGER ICONS ==================== */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-md">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Audit Trail Ledger
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Full Cryptographic Transaction History
                </h3>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <div style={{ animationDelay: '100ms' }} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-slate-800">📜 100% Verified Ledger</span>
              </div>
              <div style={{ animationDelay: '200ms' }} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-emerald-800">📥 Instant PDF Receipts Available</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. ANALYTICS TAB: SLIDING METRICS ICONS ==================== */}
        {activeTab === 'analytics' && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-700 text-white shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Financial Intelligence
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Income vs Expense Ratios & AI Insights
                </h3>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <div style={{ animationDelay: '100ms' }} className="flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-teal-800">📊 Savings Rate: 68%</span>
              </div>
              <div style={{ animationDelay: '200ms' }} className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-2 shrink-0 animate-slideIcon">
                <span className="font-extrabold text-blue-800">💡 AI Projection: Target met 12 days early</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
