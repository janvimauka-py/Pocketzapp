import React from 'react';
import { ShieldCheck, PlusCircle, Send, QrCode, ArrowUpRight, Sparkles } from 'lucide-react';

interface ActionButtonsProps {
  onCheckBalance: () => void;
  onAddMoney: () => void;
  onTransferMoney: () => void;
  onCheckoutPay: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCheckBalance,
  onAddMoney,
  onTransferMoney,
  onCheckoutPay,
}) => {
  return (
    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* 1. CHECK BALANCE */}
      <button
        type="button"
        onClick={onCheckBalance}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-6 text-left shadow-lg shadow-blue-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/15 hover:border-blue-200"
      >
        <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-xl transition-all group-hover:scale-150 group-hover:bg-blue-500/20" />
        
        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Protected 2FA
          </span>
          <h3 className="mt-1.5 text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
            CHECK BALANCE
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Verify OTP to inspect decrypted ledger
          </p>
        </div>
      </button>

      {/* 2. ADD MONEY */}
      <button
        type="button"
        onClick={onAddMoney}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-6 text-left shadow-lg shadow-rose-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/15 hover:border-rose-200"
      >
        <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-rose-500/10 blur-xl transition-all group-hover:scale-150 group-hover:bg-rose-500/20" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white shadow-md shadow-rose-500/30 transition-transform duration-300 group-hover:scale-110">
            <PlusCircle className="h-7 w-7" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
            Instant Top-up
          </span>
          <h3 className="mt-1.5 text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
            ADD MONEY
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Top-up via UPI, Card or Net Banking
          </p>
        </div>
      </button>

      {/* 3. TRANSFER MONEY */}
      <button
        type="button"
        onClick={onTransferMoney}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-6 text-left shadow-lg shadow-indigo-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-600/15 hover:border-indigo-200"
      >
        <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-xl transition-all group-hover:scale-150 group-hover:bg-indigo-500/20" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
            <Send className="h-7 w-7" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            Peer-to-Peer
          </span>
          <h3 className="mt-1.5 text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
            TRANSFER MONEY
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Send to friends or college contacts
          </p>
        </div>
      </button>

      {/* 4. CHECKOUT / PAY */}
      <button
        type="button"
        onClick={onCheckoutPay}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-6 text-left shadow-lg shadow-emerald-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/15 hover:border-emerald-200"
      >
        <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-xl transition-all group-hover:scale-150 group-hover:bg-emerald-500/20" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
            <QrCode className="h-7 w-7" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Merchant / Store
          </span>
          <h3 className="mt-1.5 text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
            CHECKOUT / PAY
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            1-Click checkout & store payments
          </p>
        </div>
      </button>

    </div>
  );
};
