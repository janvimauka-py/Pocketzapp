import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles, Wifi, ArrowUpRight, ArrowDownLeft, PiggyBank, PieChart } from 'lucide-react';
import { UserProfile } from '../../types';

interface DigitalWalletCardProps {
  user: UserProfile;
  walletBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  budgetRemaining: number;
  currency: string;
}

export const DigitalWalletCard: React.FC<DigitalWalletCardProps> = ({
  user,
  walletBalance,
  totalIncome,
  totalExpenses,
  totalSavings,
  budgetRemaining,
  currency,
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setTilt({
      x: -(y / card.height) * 12,
      y: (x / card.width) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#3B0764] p-7 sm:p-9 text-white shadow-2xl shadow-indigo-950/60 border border-white/20 select-none group"
    >
      {/* Background Decorative 3D Light Shimmer */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-rose-500/25 blur-3xl transition-transform duration-700 group-hover:scale-110" />
      
      {/* Dynamic diagonal shine overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card Header: Brand, Chip, Contactless */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
            <span className="font-black text-lg tracking-tighter text-white">
              P<span className="text-rose-400">Z</span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Pocket<span className="text-rose-400">Zapp</span>
              </span>
              <span className="rounded-full bg-rose-500/20 border border-rose-400/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300">
                AI Smart Wallet
              </span>
            </div>
            <p className="text-[11px] text-blue-200">Platinum Demo Edition</p>
          </div>
        </div>

        {/* EMV Chip & Contactless Wave */}
        <div className="flex items-center gap-3">
          <Wifi className="h-5 w-5 text-blue-200/80 rotate-90" />
          <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 p-0.5 shadow-md">
            <div className="h-full w-full rounded border border-amber-600/30 grid grid-cols-2 gap-0.5 p-0.5 opacity-80">
              <div className="border-r border-b border-amber-700/30" />
              <div className="border-b border-amber-700/30" />
              <div className="border-r border-amber-700/30" />
              <div />
            </div>
          </div>
        </div>
      </div>

      {/* Central Available Balance Display */}
      <div className="relative mt-8 sm:mt-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/90 flex items-center gap-1.5">
            <span>Available Wallet Balance</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 text-xs text-white backdrop-blur-md transition-all active:scale-95"
          >
            {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showBalance ? 'Hide' : 'Reveal'}</span>
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {showBalance ? `${currency}${walletBalance.toFixed(2)}` : '••••••••'}
          </h2>
          <span className="rounded-xl bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active Demo
          </span>
        </div>

        {/* Card Number Mask & Holder */}
        <div className="mt-4 flex items-center justify-between font-mono text-xs text-blue-200/80">
          <span className="tracking-widest">•••• •••• •••• 8841</span>
          <span className="tracking-wider uppercase font-sans font-semibold text-white/90 text-[11px]">
            {user.name}
          </span>
        </div>
      </div>

      {/* 4 Bottom Key Metrics Strip */}
      <div className="relative mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 border-t border-white/15 pt-5">
        
        {/* Income / Inflow */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-1.5 text-blue-200 text-[11px] font-medium">
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-300" />
            <span>Total Inflow</span>
          </div>
          <p className="mt-1 text-sm font-bold text-white">
            {showBalance ? `+${currency}${totalIncome.toFixed(2)}` : '••••'}
          </p>
        </div>

        {/* Expenses / Outflow */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-1.5 text-blue-200 text-[11px] font-medium">
            <ArrowUpRight className="h-3.5 w-3.5 text-rose-300" />
            <span>Total Outflow</span>
          </div>
          <p className="mt-1 text-sm font-bold text-white">
            {showBalance ? `-${currency}${totalExpenses.toFixed(2)}` : '••••'}
          </p>
        </div>

        {/* Total Savings */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-1.5 text-blue-200 text-[11px] font-medium">
            <PiggyBank className="h-3.5 w-3.5 text-amber-300" />
            <span>Total Savings</span>
          </div>
          <p className="mt-1 text-sm font-bold text-white">
            {showBalance ? `${currency}${totalSavings.toFixed(2)}` : '••••'}
          </p>
        </div>

        {/* Budget Remaining */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-1.5 text-blue-200 text-[11px] font-medium">
            <PieChart className="h-3.5 w-3.5 text-blue-300" />
            <span>Budget Left</span>
          </div>
          <p className="mt-1 text-sm font-bold text-white">
            {showBalance ? `${currency}${budgetRemaining.toFixed(2)}` : '••••'}
          </p>
        </div>

      </div>

    </div>
  );
};
