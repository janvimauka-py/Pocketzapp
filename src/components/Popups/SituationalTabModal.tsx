import React, { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  Receipt,
  PieChart,
  ScanLine,
  BarChart3,
  Sparkles,
  ArrowRight,
  X,
  Coins,
  CheckCircle2,
  TrendingUp,
  Coffee,
  Utensils,
  BookOpen,
  Car,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, Transaction } from '../../types';

interface SituationalTabModalProps {
  isOpen: boolean;
  tabId: string;
  walletBalance: number;
  currency: string;
  savingsGoals: SavingsGoal[];
  onClose: () => void;
  onQuickDeposit?: (goalId: string, amount: number) => void;
  onQuickExpense?: (tx: Transaction) => void;
}

export const SituationalTabModal: React.FC<SituationalTabModalProps> = ({
  isOpen,
  tabId,
  walletBalance,
  currency,
  savingsGoals,
  onClose,
  onQuickDeposit,
  onQuickExpense,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    savingsGoals.find((g) => g.name.includes('iPhone'))?.id || savingsGoals[0]?.id || ''
  );
  const [depositSuccess, setDepositSuccess] = useState<string>('');
  const [expenseSuccess, setExpenseSuccess] = useState<string>('');

  if (!isOpen) return null;

  // Handle Quick Deposit into Savings from the Wallet pop-up
  const handleQuickDeposit = (amount: number) => {
    if (amount > walletBalance) {
      alert(`Insufficient wallet balance (${currency}${walletBalance.toLocaleString()})`);
      return;
    }
    const targetGoal = savingsGoals.find((g) => g.id === selectedGoalId) || savingsGoals[0];
    if (onQuickDeposit && targetGoal) {
      onQuickDeposit(targetGoal.id, amount);
      setDepositSuccess(`Transferred ${currency}${amount.toLocaleString()} from Wallet to ${targetGoal.name}!`);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setDepositSuccess('');
        onClose();
      }, 1400);
    }
  };

  // Handle Quick Campus Expense logging from the Situational pop-up
  const handleQuickCampusExpense = (desc: string, category: any, amount: number) => {
    if (amount > walletBalance) {
      alert(`Insufficient wallet balance (${currency}${walletBalance.toLocaleString()})`);
      return;
    }
    if (onQuickExpense) {
      const tx: Transaction = {
        id: `TXN-SIT-${Date.now().toString().slice(-6)}`,
        type: 'expense',
        amount,
        description: desc,
        category,
        recipientOrMerchant: `Campus: ${desc}`,
        paymentMethod: 'PocketZapp Instant Situational',
        status: 'completed',
        date: new Date().toISOString(),
        referenceId: `REF-SIT-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: `Quick 1-tap campus situation log: ${desc}`,
      };
      onQuickExpense(tx);
      setExpenseSuccess(`Logged ${currency}${amount} for "${desc}"!`);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
      setTimeout(() => {
        setExpenseSuccess('');
        onClose();
      }, 1200);
    }
  };

  // 1. SITUATION: SAVINGS (Wallet with Money screen)
  const renderSavingsSituation = () => {
    const iphoneGoal = savingsGoals.find((g) => g.name.includes('iPhone')) || savingsGoals[0];

    return (
      <div className="space-y-5">
        {/* Animated Wallet with Money Header Illustration */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-900 p-6 text-white shadow-xl">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-cyan-400/20 blur-xl" />

          {/* Floating animated money and wallet visual */}
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                <Coins className="h-3.5 w-3.5 text-amber-300 animate-bounce" />
                Wallet with Money
              </span>
              <h3 className="text-xl font-black text-white">Your Money Ready to Save</h3>
              <p className="text-xs text-emerald-100/90 max-w-xs">
                Seamlessly feed money from your live wallet directly into your savings vaults!
              </p>
            </div>

            {/* Visual 3D Wallet Icon with Money Flow */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl">
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-900 font-black text-xs shadow-lg animate-pulse">
                💵
              </div>
              <Wallet className="h-10 w-10 text-emerald-200" />
            </div>
          </div>

          {/* Available Wallet Balance Highlight */}
          <div className="mt-5 rounded-2xl bg-black/25 backdrop-blur-md p-4 border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                Current Wallet Balance
              </span>
              <p className="text-2xl font-black text-white">
                {currency}{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="h-3 w-3" /> Available
              </span>
            </div>
          </div>
        </div>

        {depositSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{depositSuccess}</span>
          </div>
        )}

        {/* Quick Deposit into iPhone 19 Vault */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Target: {iphoneGoal ? iphoneGoal.name : 'Primary Vault'}
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-blue-600">
              {iphoneGoal ? `${Math.min(100, Math.round((iphoneGoal.currentAmount / iphoneGoal.targetAmount) * 100))}% Saved` : ''}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Transfer money from your wallet with 1 tap:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickDeposit(amt)}
                className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-white p-3 font-bold text-emerald-700 shadow-xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95"
              >
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Feed</span>
                <span className="text-base font-black">+{currency}{amt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
        >
          <span>Continue to Savings Goals</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // 2. SITUATION: EXPENSES (Campus situational quick logger)
  const renderExpensesSituation = () => {
    const campusSituations = [
      { name: 'Hostel Mess / Canteen Lunch', category: 'Food', amount: 120, icon: Utensils, color: 'text-amber-500 bg-amber-50' },
      { name: 'Chai & Snacks at Campus Tapri', category: 'Food', amount: 40, icon: Coffee, color: 'text-orange-500 bg-orange-50' },
      { name: 'Exam Notes & Project Xerox', category: 'Education', amount: 65, icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
      { name: 'Auto / Metro Ride to College', category: 'Travel', amount: 80, icon: Car, color: 'text-emerald-500 bg-emerald-50' },
    ];

    return (
      <div className="space-y-5">
        {/* Campus Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-6 text-white shadow-xl">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                Situational Quick-Log
              </span>
              <h3 className="text-xl font-black text-white">Campus Expense Situations</h3>
              <p className="text-xs text-indigo-200 max-w-xs">
                Log common campus spending scenarios in 1-tap without manual typing!
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-3xl">
              🎓
            </div>
          </div>
        </div>

        {expenseSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{expenseSuccess}</span>
          </div>
        )}

        {/* Situational Quick 1-Tap Buttons */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-slate-700">Select Current Campus Situation:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {campusSituations.map((sit) => {
              const IconComp = sit.icon;
              return (
                <button
                  key={sit.name}
                  type="button"
                  onClick={() => handleQuickCampusExpense(sit.name, sit.category, sit.amount)}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-xs hover:border-blue-400 hover:shadow-md transition-all active:scale-98 group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${sit.color} group-hover:scale-110 transition-transform`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{sit.name}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{sit.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 px-2.5 py-1 rounded-lg transition-colors">
                    {currency}{sit.amount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-slate-800 transition-all"
        >
          <span>Open Full Expense Manager</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // 3. SITUATION: BUDGET (Smart Budget Pace)
  const renderBudgetSituation = () => (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-900 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
              <PieChart className="h-3.5 w-3.5 text-violet-300" />
              Budget Health
            </span>
            <h3 className="mt-2 text-xl font-black text-white">Daily Spending Pace</h3>
            <p className="text-xs text-violet-200">Keep spending in check to protect your iPhone 19 goal!</p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
        <div className="flex justify-between items-center font-bold text-slate-800">
          <span>Safe-to-Spend Today:</span>
          <span className="text-emerald-600 text-sm">{currency}420.00</span>
        </div>
        <p className="text-slate-500 text-[11px]">
          Based on your monthly budget limits, staying below ₹420 today keeps you on pace.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all"
      >
        <span>Go to Budget Manager</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  // 4. SITUATION: RECEIPT SCANNER (AI Vision)
  const renderScannerSituation = () => (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
              <ScanLine className="h-3.5 w-3.5 text-cyan-200" />
              AI Optical Scanner
            </span>
            <h3 className="mt-2 text-xl font-black text-white">Instant Receipt Reader</h3>
            <p className="text-xs text-cyan-100">Upload or snap any paper bill, canteen token or grocery receipt.</p>
          </div>
          <div className="text-3xl">📷</div>
        </div>
      </div>

      <p className="text-xs text-slate-600">
        AI will automatically extract the store name, itemized products, GST tax, and total amount.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-cyan-700 transition-all"
      >
        <span>Launch Optical Scanner</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {tabId === 'savings' && renderSavingsSituation()}
        {tabId === 'expenses' && renderExpensesSituation()}
        {tabId === 'budget' && renderBudgetSituation()}
        {tabId === 'scanner' && renderScannerSituation()}
        {!['savings', 'expenses', 'budget', 'scanner'].includes(tabId) && renderSavingsSituation()}
      </div>
    </div>
  );
};
