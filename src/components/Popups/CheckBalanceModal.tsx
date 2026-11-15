import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, X, Wallet, ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import { OtpModal } from './OtpModal';
import { Transaction } from '../../types';

interface CheckBalanceModalProps {
  isOpen: boolean;
  walletBalance: number;
  currency: string;
  totalSavings: number;
  recentTransactions: Transaction[];
  onClose: () => void;
}

export const CheckBalanceModal: React.FC<CheckBalanceModalProps> = ({
  isOpen,
  walletBalance,
  currency,
  totalSavings,
  recentTransactions,
  onClose,
}) => {
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(true);
  const [hideAmount, setHideAmount] = useState<boolean>(false);

  if (!isOpen) return null;

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
    onClose();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-8">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Protected Balance Details</h2>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> OTP Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">Live decrypted digital ledger balance</p>
              </div>
            </div>

            {/* Main Balance Banner */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Primary Available Balance
                </span>
                <button
                  type="button"
                  onClick={() => setHideAmount(!hideAmount)}
                  className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-blue-100 hover:bg-white/20 transition-all"
                >
                  {hideAmount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{hideAmount ? 'Show' : 'Hide'}</span>
                </button>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight">
                  {hideAmount ? '••••••••' : `${currency}${walletBalance.toFixed(2)}`}
                </span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                  Demo Active
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-blue-200">
                <span>Account: <strong className="text-white font-mono">PZ-9941-8841</strong></span>
                <span>Tier: <strong className="text-white">Student Premium</strong></span>
              </div>
            </div>

            {/* Detailed Balance Breakdown Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                <span className="text-[11px] font-medium text-slate-500">Total In Goal Savings</span>
                <p className="mt-1 text-base font-bold text-emerald-700">
                  {currency}{totalSavings.toFixed(2)}
                </p>
                <span className="text-[10px] text-slate-400">Locked in 4 active goals</span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                <span className="text-[11px] font-medium text-slate-500">Pending Clearances</span>
                <p className="mt-1 text-base font-bold text-slate-700">
                  {currency}0.00
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">All settled instantly</span>
              </div>
            </div>

            {/* Recent Mini Activity */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Ledger Activity
              </h4>
              <div className="mt-2.5 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60 p-2">
                {recentTransactions.slice(0, 3).map((tx) => {
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

            {/* Working Close button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20"
              >
                Close Protected Balance
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
