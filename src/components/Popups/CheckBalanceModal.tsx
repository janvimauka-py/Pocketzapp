import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  X, 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  RotateCcw, 
  PlusCircle, 
  Send, 
  Sparkles,
  Layers
} from 'lucide-react';
import { OtpModal } from './OtpModal';
import { Transaction } from '../../types';

interface CheckBalanceModalProps {
  isOpen: boolean;
  walletBalance: number;
  currency: string;
  totalSavings: number;
  recentTransactions: Transaction[];
  onClose: () => void;
  onAddMoneyClick?: () => void;
  onTransferClick?: () => void;
}

export const CheckBalanceModal: React.FC<CheckBalanceModalProps> = ({
  isOpen,
  walletBalance,
  currency,
  totalSavings,
  recentTransactions,
  onClose,
  onAddMoneyClick,
  onTransferClick,
}) => {
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(true);
  const [hideAmount, setHideAmount] = useState<boolean>(false);
  const [simulatedAdjustment, setSimulatedAdjustment] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'balance' | 'vaults' | 'ledger'>('balance');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDisplayBalance = Math.max(0, walletBalance + simulatedAdjustment);

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    setIsOtpVerified(true);
  };

  const handleCancelOtp = () => {
    setShowOtpModal(false);
    onClose();
  };

  const handleCloseAll = () => {
    setIsOtpVerified(false);
    setShowOtpModal(true);
    setSimulatedAdjustment(0);
    onClose();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <>
      {showOtpModal && !isOtpVerified && (
        <OtpModal
          isOpen={showOtpModal}
          title="Security Check: View Protected Balance"
          subtitle="Two-Factor Authentication required to decrypt wallet balance"
          onSuccess={handleOtpSuccess}
          onCancel={handleCancelOtp}
        />
      )}

      {isOtpVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-8 max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseAll}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 shrink-0">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Protected Balance Details</h2>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> OTP Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">Live decrypted digital ledger balance</p>
              </div>
            </div>

            {/* Interactive View Tabs */}
            <div className="mt-4 flex rounded-2xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('balance')}
                className={`flex-1 rounded-xl py-2 text-center transition-all ${
                  activeTab === 'balance'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Available Cash
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vaults')}
                className={`flex-1 rounded-xl py-2 text-center transition-all ${
                  activeTab === 'vaults'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Locked Vaults
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`flex-1 rounded-xl py-2 text-center transition-all ${
                  activeTab === 'ledger'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mini Activity
              </button>
            </div>

            {/* TAB 1: AVAILABLE CASH */}
            {activeTab === 'balance' && (
              <div className="mt-4 space-y-4">
                {/* Main Balance Banner */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-xl shadow-blue-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Primary Available Balance
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRefresh}
                        title="Refresh balance"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-100 hover:bg-white/20 transition-all"
                      >
                        <RotateCcw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setHideAmount(!hideAmount)}
                        className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-blue-100 hover:bg-white/20 transition-all"
                      >
                        {hideAmount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{hideAmount ? 'Show' : 'Hide'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">
                      {hideAmount ? '••••••••' : `${currency}${currentDisplayBalance.toFixed(2)}`}
                    </span>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                      Demo Active
                    </span>
                  </div>

                  {simulatedAdjustment !== 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-amber-200">
                      <span>Live Simulation Adjustment: {simulatedAdjustment > 0 ? `+${currency}${simulatedAdjustment}` : `-${currency}${Math.abs(simulatedAdjustment)}`}</span>
                      <button
                        type="button"
                        onClick={() => setSimulatedAdjustment(0)}
                        className="font-bold underline hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-blue-200">
                    <span>Account: <strong className="text-white font-mono">PZ-9941-8841</strong></span>
                    <span>Tier: <strong className="text-white">Student Premium</strong></span>
                  </div>
                </div>

                {/* Interactive Simulation Controls */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      Interactive Balance Simulator
                    </span>
                    <span className="text-[10px] text-slate-400">Tap to test live state</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulatedAdjustment((prev) => prev + 2000)}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all"
                    >
                      +{currency}2,000 Top-up
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedAdjustment((prev) => prev - 500)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-all"
                    >
                      -{currency}500 Snack
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedAdjustment(0)}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Reset State
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOCKED VAULTS */}
            {activeTab === 'vaults' && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">Total In Goal Savings</span>
                    <span className="text-base font-extrabold text-emerald-700">{currency}{totalSavings.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Your savings are ring-fenced and locked in your active goals so you never accidentally overspend.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Total Net Worth</span>
                    <p className="font-extrabold text-slate-900 mt-1">{currency}{(walletBalance + totalSavings).toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Unencumbered Cash</span>
                    <p className="font-extrabold text-blue-700 mt-1">{currency}{walletBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEDGER ACTIVITY */}
            {activeTab === 'ledger' && (
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Ledger Activity
                </h4>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60 p-2">
                  {recentTransactions.slice(0, 4).map((tx) => {
                    const isPositive = tx.type === 'income' || tx.type === 'add_money';
                    return (
                      <div key={tx.id} className="flex items-center justify-between py-2 px-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                              isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isPositive ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{tx.description}</p>
                            <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isPositive ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Interactive Actions Row */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              {onAddMoneyClick && (
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    onAddMoneyClick();
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Money Now</span>
                </button>
              )}
              {onTransferClick && (
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    onTransferClick();
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Send className="h-4 w-4 text-indigo-600" />
                  <span>Transfer to Contact</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseAll}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
