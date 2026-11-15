import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calculator, 
  Trophy, 
  Laptop, 
  Plane, 
  Shield, 
  Gamepad2, 
  Target, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, Transaction } from '../../types';
import { Page3DHero } from '../Visuals/Page3DHero';

interface SavingsManagerProps {
  savingsGoals: SavingsGoal[];
  walletBalance: number;
  currency: string;
  onUpdateGoals: (goals: SavingsGoal[]) => void;
  onWalletTransaction: (tx: Transaction) => void;
}

export const SavingsManager: React.FC<SavingsManagerProps> = ({
  savingsGoals,
  walletBalance,
  currency,
  onUpdateGoals,
  onWalletTransaction,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [transferAmount, setTransferAmount] = useState<string>('1000');
  const [transferError, setTransferError] = useState<string>('');

  // New goal form state
  const [newGoalName, setNewGoalName] = useState<string>('');
  const [newGoalTarget, setNewGoalTarget] = useState<string>('');
  const [newGoalInitial, setNewGoalInitial] = useState<string>('0');
  const [newGoalDate, setNewGoalDate] = useState<string>('2027-04-30');
  const [newGoalCategory, setNewGoalCategory] = useState<string>('Education');
  const [newGoalIcon, setNewGoalIcon] = useState<string>('Laptop');

  // Calculator state
  const [calcTarget, setCalcTarget] = useState<string>('50000');
  const [calcMonths, setCalcMonths] = useState<string>('6');

  // Total saved
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = Math.round((totalSaved / (totalTarget || 1)) * 100);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return Laptop;
      case 'Plane': return Plane;
      case 'Shield': return Shield;
      case 'Gamepad2': return Gamepad2;
      default: return Target;
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoalTarget);
    const initial = parseFloat(newGoalInitial) || 0;

    if (isNaN(target) || target <= 0) return;
    if (initial > walletBalance) {
      alert(`Initial deposit exceeds available wallet balance (${currency}${walletBalance.toFixed(2)})`);
      return;
    }

    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      name: newGoalName,
      targetAmount: target,
      currentAmount: initial,
      targetDate: newGoalDate,
      category: newGoalCategory,
      icon: newGoalIcon,
      color: 'from-blue-600 to-indigo-600',
      createdAt: new Date().toISOString(),
    };

    if (initial > 0) {
      onWalletTransaction({
        id: `TXN-SAV-${Date.now().toString().slice(-6)}`,
        type: 'expense',
        amount: initial,
        description: `Deposit to Goal: ${newGoalName}`,
        category: 'Other',
        recipientOrMerchant: `Goal: ${newGoalName}`,
        paymentMethod: 'PocketZapp Goal Allocation',
        status: 'completed',
        date: new Date().toISOString(),
        referenceId: `REF-SAV-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: `Initial savings allocation for ${newGoalName}`,
      });
    }

    onUpdateGoals([...savingsGoals, newGoal]);
    setShowCreateModal(false);
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalInitial('0');

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this savings goal? Any saved amount will be refunded to your wallet.')) {
      const goal = savingsGoals.find((g) => g.id === goalId);
      if (goal && goal.currentAmount > 0) {
        onWalletTransaction({
          id: `TXN-REF-${Date.now().toString().slice(-6)}`,
          type: 'income',
          amount: goal.currentAmount,
          description: `Refund from Deleted Goal: ${goal.name}`,
          category: 'Deposit',
          recipientOrMerchant: 'PocketZapp Savings Refund',
          paymentMethod: 'Goal Refund',
          status: 'completed',
          date: new Date().toISOString(),
          referenceId: `REF-REF-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
      onUpdateGoals(savingsGoals.filter((g) => g.id !== goalId));
    }
  };

  const handleOpenTransfer = (goal: SavingsGoal, type: 'deposit' | 'withdraw') => {
    setSelectedGoal(goal);
    setTransferType(type);
    setTransferAmount('50');
    setTransferError('');
    setShowTransferModal(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransferError('Please enter a valid amount.');
      return;
    }

    if (transferType === 'deposit') {
      if (amt > walletBalance) {
        setTransferError(`Insufficient wallet balance (${currency}${walletBalance.toFixed(2)} available).`);
        return;
      }

      const updatedCurrent = selectedGoal.currentAmount + amt;
      const updatedGoals = savingsGoals.map((g) =>
        g.id === selectedGoal.id ? { ...g, currentAmount: updatedCurrent } : g
      );
      onUpdateGoals(updatedGoals);

      onWalletTransaction({
        id: `TXN-SAV-${Date.now().toString().slice(-6)}`,
        type: 'expense',
        amount: amt,
        description: `Contribution to ${selectedGoal.name}`,
        category: 'Other',
        recipientOrMerchant: `Goal: ${selectedGoal.name}`,
        paymentMethod: 'Wallet Allocation',
        status: 'completed',
        date: new Date().toISOString(),
        referenceId: `REF-SAV-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Check if goal reached 100%
      if (updatedCurrent >= selectedGoal.targetAmount) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } else {
      // Withdraw
      if (amt > selectedGoal.currentAmount) {
        setTransferError(`Cannot withdraw more than current saved amount (${currency}${selectedGoal.currentAmount.toFixed(2)}).`);
        return;
      }

      const updatedCurrent = selectedGoal.currentAmount - amt;
      const updatedGoals = savingsGoals.map((g) =>
        g.id === selectedGoal.id ? { ...g, currentAmount: updatedCurrent } : g
      );
      onUpdateGoals(updatedGoals);

      onWalletTransaction({
        id: `TXN-WIT-${Date.now().toString().slice(-6)}`,
        type: 'income',
        amount: amt,
        description: `Withdrawal from Goal: ${selectedGoal.name}`,
        category: 'Deposit',
        recipientOrMerchant: `Goal: ${selectedGoal.name}`,
        paymentMethod: 'Goal Withdrawal',
        status: 'completed',
        date: new Date().toISOString(),
        referenceId: `REF-WIT-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }

    setShowTransferModal(false);
  };

  // Calculator monthly need
  const calcNeedPerMonth = Math.max(0, (parseFloat(calcTarget) || 0) / (parseFloat(calcMonths) || 1));

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Money Collecting in Purse */}
      <Page3DHero
        pageId="savings"
        title="Smart Savings Vaults & Milestones"
        subtitle="Automate micro-savings and watch your purse fill with simulated rewards and interest accruals."
        badgeText="3D Money Vault Active"
        actionButtonText="Create New Goal"
        onActionButtonClick={() => setShowCreateModal(true)}
      />

      {/* Global Progress Bar Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-md border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700">
            Total Saved Across Vaults: <strong className="text-emerald-600 text-sm">{currency}{totalSaved.toFixed(2)}</strong> / {currency}{totalTarget.toFixed(2)}
          </span>
          <span className="font-extrabold text-blue-600">{overallProgress}% Achieved</span>
        </div>
        <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, overallProgress)}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savingsGoals.map((goal) => {
          const Icon = getIconComponent(goal.icon);
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = pct >= 100;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-200/50 transition-all hover:shadow-xl hover:border-blue-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{goal.name}</h3>
                        {isDone && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Completed!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Amount and percentage */}
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      {currency}{goal.currentAmount.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      / {currency}{goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <span className={`text-sm font-extrabold ${isDone ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDone
                        ? 'bg-emerald-500'
                        : pct >= 75
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2 text-right">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isDone ? 'Goal fully achieved!' : `${currency}${remaining.toFixed(2)} remaining`}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add Money to Goal / Withdraw */}
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleOpenTransfer(goal, 'deposit')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 py-2.5 text-xs font-bold text-blue-700 transition-colors"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5 text-blue-600" />
                  <span>Deposit Funds</span>
                </button>
                <button
                  type="button"
                  disabled={goal.currentAmount <= 0}
                  onClick={() => handleOpenTransfer(goal, 'withdraw')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-600 disabled:opacity-40 transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Calculator & AI Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Interactive Savings Calculator */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Interactive Savings Planner</h3>
              <p className="text-xs text-slate-400">Calculate how much you need to save per month</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Target Amount ({currency})</label>
              <input
                type="number"
                value={calcTarget}
                onChange={(e) => setCalcTarget(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Timeframe (Months)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={calcMonths}
                onChange={(e) => setCalcMonths(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Recommended Monthly Contribution
              </span>
              <p className="text-2xl font-black text-blue-950">
                {currency}{calcNeedPerMonth.toFixed(2)} <span className="text-xs font-medium text-blue-600">/ month</span>
              </p>
            </div>
            <div className="text-right text-xs text-blue-700">
              <span>approx. <strong>{currency}{(calcNeedPerMonth / 4).toFixed(2)}</strong> / week</span>
            </div>
          </div>
        </div>

        {/* AI Savings Suggestions */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">PocketZapp AI Savings Insights</h3>
              <p className="text-xs text-slate-400">Personalized smart strategies for college students</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="font-semibold text-slate-800">🎯 Accelerated Laptop Goal</p>
              <p className="mt-0.5 text-slate-500">
                You are only ${550} away from your MacBook Pro goal. Saving just $25 extra each weekend will finish the goal a month ahead of schedule!
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="font-semibold text-slate-800">⚡ Auto Round-up Simulation</p>
              <p className="mt-0.5 text-slate-500">
                Every time you checkout with PocketZapp, round up to the nearest dollar and deposit the change into your Emergency Reserve.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Create Goal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Create New Savings Goal</h3>
            <p className="text-xs text-slate-400">Set your ambition and start saving today</p>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Scooter or Camera"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Target Amount ({currency})</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="800"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Initial Deposit ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newGoalInitial}
                    onChange={(e) => setNewGoalInitial(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Icon</label>
                  <select
                    value={newGoalIcon}
                    onChange={(e) => setNewGoalIcon(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Laptop">Laptop / Tech</option>
                    <option value="Plane">Travel / Trip</option>
                    <option value="Shield">Emergency / Health</option>
                    <option value="Gamepad2">Gaming / Fun</option>
                    <option value="Target">General Goal</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Funds (Deposit / Withdraw) */}
      {showTransferModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              {transferType === 'deposit' ? 'Deposit to Goal' : 'Withdraw from Goal'}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedGoal.name} (Current: {currency}{selectedGoal.currentAmount.toFixed(2)})
            </p>

            <form onSubmit={handleExecuteTransfer} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Amount ({currency})</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xl font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {transferType === 'deposit' && (
                <div className="flex gap-2">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTransferAmount(amt.toString())}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      +{currency}{amt}
                    </button>
                  ))}
                </div>
              )}

              {transferError && (
                <p className="text-xs text-rose-500 font-semibold">{transferError}</p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Confirm {transferType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
