import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  PieChart, 
  PiggyBank, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  Sliders, 
  ChevronRight,
  AlertTriangle,
  FileText,
  Send,
  ArrowRight
} from 'lucide-react';
import { UserProfile, Transaction, Budget, SavingsGoal, RecentContact } from '../../types';
import { DigitalWalletCard } from './DigitalWalletCard';
import { ActionButtons } from './ActionButtons';
import { Page3DHero } from '../Visuals/Page3DHero';

interface HomeWalletViewProps {
  user: UserProfile;
  walletBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  budget: Budget;
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
  contacts?: RecentContact[];
  currency: string;
  onCheckBalance: () => void;
  onAddMoney: () => void;
  onTransferMoney: () => void;
  onTransferToContact?: (contact: RecentContact) => void;
  onCheckoutPay: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onNavigateTab: (tab: string) => void;
  onOpenBudgetModal: () => void;
}

export const HomeWalletView: React.FC<HomeWalletViewProps> = ({
  user,
  walletBalance,
  totalIncome,
  totalExpenses,
  totalSavings,
  budget,
  savingsGoals,
  transactions,
  contacts = [],
  currency,
  onCheckBalance,
  onAddMoney,
  onTransferMoney,
  onTransferToContact,
  onCheckoutPay,
  onSelectTransaction,
  onNavigateTab,
  onOpenBudgetModal,
}) => {
  const budgetRemaining = Math.max(0, budget.monthlyLimit - budget.spent);
  const budgetUtilization = Math.round((budget.spent / (budget.monthlyLimit || 1)) * 100);

  // SVG Progress Ring calculations for mini-widget
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, budgetUtilization) / 100) * circumference;

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* 3D Animated Hero Scene: Floating Cyber Wallet */}
      <Page3DHero
        pageId="wallet"
        title="PocketZapp AI Digital Wallet"
        subtitle="Your Money. Your Insights. Your Control. Instant simulated fund addition, peer transfers, and encrypted balance verification."
        badgeText="3D Holographic System Active"
        actionButtonText="Add Money to Wallet"
        onActionButtonClick={onAddMoney}
      />

      {/* 1. Large Premium 3D Animated Digital Wallet Card */}
      <section className="relative">
        <DigitalWalletCard
          user={user}
          walletBalance={walletBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalSavings={totalSavings}
          budgetRemaining={budgetRemaining}
          currency={currency}
        />
      </section>

      {/* 2. FOUR LARGE INTERACTIVE ACTION BUTTONS */}
      <section>
        <ActionButtons
          onCheckBalance={onCheckBalance}
          onAddMoney={onAddMoney}
          onTransferMoney={onTransferMoney}
          onCheckoutPay={onCheckoutPay}
        />
      </section>

      {/* 2B. TRANSFER MONEY TO CONTACT (No DP - Just Names: Udit, Anvay, Aarvi, Jerry) */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Transfer Money to Contact
                </h3>
                <span className="rounded-full bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Instant ₹
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tap any contact to initiate simulated peer transfer with zero fees
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTransferMoney}
            className="self-start sm:self-auto text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>Custom UPI / ID</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4 Contact Cards - No DP, Just Names: Udit, Anvay, Aarvi, Jerry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => onTransferToContact ? onTransferToContact(contact) : onTransferMoney()}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <span className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                {contact.name}
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-slate-400 font-mono truncate max-w-full">
                {contact.identifier}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span>Send {currency}</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Middle Grid: Monthly Budget Ring & Smart Financial Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Budget Ring Widget (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PieChart className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Budget Health</h3>
            </div>
            <button
              type="button"
              onClick={onOpenBudgetModal}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5"
            >
              <span>Inspect</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="my-5 flex items-center gap-5">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="h-22 w-22 -rotate-90 transform">
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke={budgetUtilization >= 90 ? '#EF4444' : budgetUtilization >= 70 ? '#F59E0B' : '#10B981'}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-black text-slate-900">{budgetUtilization}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Used</span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Spent this month</span>
                <p className="text-base font-black text-rose-600">{currency}{budget.spent.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Monthly allowance</span>
                <p className="text-xs font-bold text-slate-700">{currency}{budget.monthlyLimit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs flex items-center justify-between border border-slate-100">
            <span className="text-slate-500 font-medium">Safe remaining buffer:</span>
            <span className="font-extrabold text-emerald-700">{currency}{budgetRemaining.toFixed(2)}</span>
          </div>
        </div>

        {/* Smart Financial Insights Carousel/Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">PocketZapp Smart Insights</h3>
                <p className="text-[11px] text-slate-400">Algorithmic suggestions based on your transactions</p>
              </div>
            </div>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
              AI Powered
            </span>
          </div>

          <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-3.5 text-xs">
              <span className="font-bold text-blue-900 flex items-center gap-1">
                🍔 Dining Pattern Notice
              </span>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                Food makes up over 35% of your total spend this month. Prepping lunch for the next 3 days could save ~{currency}45.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-3.5 text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                🎯 Vault Velocity High
              </span>
              <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                "Goa College Roadtrip" is 80% funded! Deposit {currency}60 more to achieve 100% completion ahead of winter break.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Automatic continuous financial health monitoring</span>
            <button
              type="button"
              onClick={() => onNavigateTab('budget')}
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Open Full Budget →
            </button>
          </div>
        </div>

      </section>

      {/* 4. Bottom Grid: Recent Transactions & Savings Progress Mini-List */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <History className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              View All ({transactions.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 4).map((tx) => {
              const isPositive = tx.type === 'income' || tx.type === 'add_money';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center justify-between py-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isPositive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">
                        {tx.recipientOrMerchant} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-black ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isPositive ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                    </span>
                    <span className="block text-[9px] text-blue-600 font-semibold">View Slip</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings Progress Vaults (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <PiggyBank className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Active Savings Vaults</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('savings')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Manage Goals →
              </button>
            </div>

            <div className="space-y-3.5">
              {savingsGoals.slice(0, 3).map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{goal.name}</span>
                      <span className="font-bold text-blue-600">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/60">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                      <span>Saved: {currency}{goal.currentAmount.toFixed(2)}</span>
                      <span>Target: {currency}{goal.targetAmount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('savings')}
            className="mt-4 w-full rounded-xl bg-blue-50 hover:bg-blue-100 py-2.5 text-xs font-bold text-blue-700 transition-colors"
          >
            Deposit Money to Vaults
          </button>
        </div>

      </section>

    </div>
  );
};
