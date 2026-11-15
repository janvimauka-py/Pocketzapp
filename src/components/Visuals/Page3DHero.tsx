import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Page3DHeroProps {
  pageId: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

export const Page3DHero: React.FC<Page3DHeroProps> = ({
  pageId,
  title,
  subtitle,
  badgeText = 'Interactive 3D View',
  actionButtonText,
  onActionButtonClick,
}) => {
  // Bespoke 3D Animated Illustrations for each page in INR (₹)
  const render3DGraphic = () => {
    switch (pageId) {
      case 'savings':
        // 3D Purse with golden Rupee (₹) coins falling and collecting in purse with sparkle effects!
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            {/* Glowing Backdrop Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-purple-600/25 to-rose-500/20 blur-3xl animate-pulse" />

            {/* Falling Animated Rupee Coins (₹) */}
            <div className="absolute -top-4 left-10 flex flex-col items-center animate-bounce [animation-duration:2.2s]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-amber-950 font-black text-sm shadow-xl shadow-amber-500/60 border-2 border-amber-200 rotate-12">
                ₹
              </div>
            </div>

            <div className="absolute top-2 right-12 flex flex-col items-center animate-bounce [animation-duration:1.8s] [animation-delay:0.4s]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-amber-500 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/50 border border-amber-100 -rotate-12">
                ₹
              </div>
            </div>

            <div className="absolute top-12 left-6 flex flex-col items-center animate-bounce [animation-duration:2.6s] [animation-delay:0.8s]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 font-black text-[11px] shadow-md border border-yellow-100 rotate-6">
                ₹
              </div>
            </div>

            {/* 3D Velvet Money Purse / Vault Bag */}
            <div className="relative z-10 flex flex-col items-center group">
              {/* Golden Clasp */}
              <div className="flex items-center gap-1.5 -mb-1.5 z-20">
                <div className="h-3.5 w-6 rounded-t-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-500 border border-amber-400 shadow-md" />
                <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-500 border-2 border-amber-600/40 shadow-inner flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-amber-700" />
                </div>
                <div className="h-3.5 w-6 rounded-t-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-500 border border-amber-400 shadow-md" />
              </div>

              {/* Main 3D Purse Body */}
              <div className="relative h-32 w-38 sm:h-36 sm:w-44 rounded-b-[2.75rem] rounded-t-2xl bg-gradient-to-b from-indigo-800 via-purple-900 to-slate-950 border-2 border-purple-400/50 shadow-2xl shadow-purple-950/90 p-3.5 overflow-hidden flex flex-col items-center justify-between">
                
                {/* Purse Velvet Texture Lines */}
                <div className="absolute inset-0 bg-radial from-purple-500/30 via-transparent to-black/70 pointer-events-none" />
                <div className="absolute -left-6 top-4 h-28 w-8 rounded-full bg-white/10 blur-xs rotate-12" />
                <div className="absolute -right-6 top-4 h-28 w-8 rounded-full bg-white/10 blur-xs -rotate-12" />

                {/* Golden Rupee Emblem on Purse */}
                <div className="z-10 mt-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 text-amber-950 font-black text-lg shadow-lg shadow-amber-500/40 border border-amber-200">
                  ₹
                </div>

                {/* Stacks of collected coins badge */}
                <div className="z-10 flex items-center gap-1.5 bg-amber-500/25 border border-amber-400/40 px-3.5 py-1 rounded-full backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-black tracking-wider text-amber-200 uppercase">
                    Collecting ₹ Vault
                  </span>
                </div>
              </div>

              {/* Floating Sparkles */}
              <div className="absolute -right-3 top-8 text-amber-300 text-lg animate-spin [animation-duration:8s]">
                ✦
              </div>
              <div className="absolute -left-3 bottom-6 text-yellow-300 text-base animate-pulse">
                ★
              </div>
            </div>
          </div>
        );

      case 'expenses':
        // 3D Animated Cash Register & Floating Receipt with INR
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 via-purple-600/25 to-blue-600/20 blur-3xl animate-pulse" />

            {/* 3D Floating Receipt */}
            <div className="absolute -top-4 right-2 z-20 w-26 rounded-xl bg-white p-2.5 shadow-2xl border border-slate-200 -rotate-12 animate-float">
              <div className="h-2 w-12 rounded-full bg-slate-300" />
              <div className="mt-1.5 space-y-1">
                <div className="h-1.5 w-18 rounded-full bg-slate-100" />
                <div className="h-1.5 w-14 rounded-full bg-slate-100" />
                <div className="h-2 w-12 rounded-full bg-rose-400" />
              </div>
              <div className="mt-2 border-t border-dashed border-slate-200 pt-1 flex justify-between text-[8px] font-bold">
                <span className="text-slate-400">TOTAL</span>
                <span className="text-emerald-600 font-mono">₹4,200</span>
              </div>
            </div>

            {/* 3D Register Machine */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Display Screen */}
              <div className="h-11 w-28 rounded-t-xl bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold shadow-md">
                ₹38,200
              </div>

              {/* Register Body */}
              <div className="h-26 w-36 rounded-2xl bg-gradient-to-b from-indigo-800 to-slate-950 border-2 border-indigo-400/40 shadow-2xl p-2.5 flex flex-col justify-between">
                {/* Keypad Grid */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-black/40">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-2.5 rounded-sm bg-white/20" />
                  ))}
                </div>

                {/* Cash Drawer Lip */}
                <div className="h-6 w-full rounded-lg bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shadow-inner tracking-wider">
                  ₹ EXPENSE DESK
                </div>
              </div>
            </div>
          </div>
        );

      case 'budget':
        // 3D Precision Target with Glowing Shields & Progress Orbit
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-600/25 to-blue-600/20 blur-3xl animate-pulse" />

            {/* Outer Holographic Rings */}
            <div className="absolute h-44 w-44 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin [animation-duration:20s]" />
            <div className="absolute h-34 w-34 rounded-full border-2 border-indigo-400/40 animate-spin [animation-duration:15s] [animation-direction:reverse]" />

            {/* Central 3D Bullseye Shield */}
            <div className="relative z-10 flex h-30 w-30 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-700 via-purple-700 to-cyan-500 p-1 shadow-2xl border-2 border-cyan-300/60 rotate-45 group">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950/90 -rotate-45">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-cyan-300 tracking-tight">76%</span>
                  <span className="text-[9px] font-extrabold text-blue-200 uppercase tracking-widest">
                    ₹50K LIMIT
                  </span>
                </div>
              </div>
            </div>

            {/* Golden Arrow Dart */}
            <div className="absolute -top-2 -right-1 z-20 flex items-center rotate-45 animate-bounce [animation-duration:2s]">
              <div className="h-2.5 w-10 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 shadow-md" />
              <div className="h-4 w-4 rotate-45 bg-rose-500 shadow-md" />
            </div>
          </div>
        );

      case 'scanner':
        // 3D Cyber Scanner with Laser Scanning Light Beam
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-600/25 to-purple-600/20 blur-3xl animate-pulse" />

            {/* 3D Paper Bill on Platform */}
            <div className="relative z-10 w-30 rounded-2xl bg-gradient-to-b from-white to-slate-100 p-3 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="h-2 w-12 bg-slate-800 rounded font-bold text-[8px] text-slate-800">
                  RECEIPT
                </span>
                <span className="h-2 w-5 bg-emerald-500 rounded" />
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-18 bg-slate-300 rounded" />
                <div className="h-1.5 w-22 bg-slate-200 rounded" />
                <div className="h-1.5 w-14 bg-slate-300 rounded" />
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-mono text-[9px] font-bold text-slate-800">₹3,450</span>
                <div className="h-3 w-9 bg-indigo-600 rounded font-mono text-[8px] font-bold text-white flex items-center justify-center shadow-xs">
                  OCR
                </div>
              </div>

              {/* Laser Scanning Line Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_#06b6d4] animate-bounce [animation-duration:2.2s]" />
            </div>

            {/* Glowing Corner Bracket Scanners */}
            <div className="absolute h-40 w-40 border-2 border-cyan-400/40 rounded-3xl pointer-events-none" />
          </div>
        );

      case 'history':
        // 3D Ledger Vault Book with Timestamp Tokens
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 via-blue-600/25 to-teal-500/20 blur-3xl animate-pulse" />

            {/* 3D Ledger Book / Vault */}
            <div className="relative z-10 flex h-34 w-30 flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-950 border-2 border-indigo-400/40 p-3.5 shadow-2xl shadow-indigo-950/90 -rotate-6">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center text-xs text-white font-black">
                  ₹
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-white/20 rounded" />
                <div className="h-1.5 w-4/5 bg-white/15 rounded" />
                <div className="h-1.5 w-3/5 bg-white/10 rounded" />
              </div>

              <div className="rounded-lg bg-blue-500/20 border border-blue-400/30 p-1 text-center">
                <span className="font-mono text-[9px] font-bold text-blue-200">
                  ₹ AUDIT TRAIL
                </span>
              </div>
            </div>

            {/* Flying Transaction Shield Badge */}
            <div className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 rotate-12 animate-float">
              ₹
            </div>
          </div>
        );

      case 'analytics':
        // 3D Rising Holographic Growth Bars with Orbiting Nodes
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/30 via-indigo-600/25 to-rose-500/20 blur-3xl animate-pulse" />

            {/* 3D Bar Chart Steps */}
            <div className="relative z-10 flex items-end gap-3 h-34 p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-2xl">
              <div className="w-5 h-14 rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400 shadow-lg shadow-blue-500/30" />
              <div className="w-5 h-20 rounded-t-lg bg-gradient-to-t from-indigo-700 to-indigo-400 shadow-lg shadow-indigo-500/30" />
              <div className="w-5 h-26 rounded-t-lg bg-gradient-to-t from-purple-700 to-purple-400 shadow-lg shadow-purple-500/30" />
              <div className="w-5 h-30 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-300 shadow-lg shadow-emerald-500/40 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
              </div>
            </div>

            {/* Trend Arrow */}
            <div className="absolute -top-3 right-4 z-20 flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
              <span>+₹18.4K Growth</span>
            </div>
          </div>
        );

      default:
        // Default 3D Holographic Wallet
        return (
          <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 via-purple-600/25 to-rose-500/20 blur-3xl animate-pulse" />

            <div className="relative z-10 flex h-30 w-40 flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-950 border-2 border-indigo-400/40 p-4 shadow-2xl shadow-indigo-950/90 -rotate-3 animate-float">
              <div className="flex items-center justify-between">
                <div className="flex h-5 w-8 rounded bg-amber-400 shadow-xs" />
                <span className="text-[10px] font-bold tracking-widest text-indigo-200">PZ RUPEE</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-black text-white">•••• 8841</span>
              </div>
            </div>

            <div className="absolute top-2 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 text-amber-950 font-black text-sm shadow-xl border border-white/40 rotate-12 animate-bounce">
              ₹
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B0F19] via-[#111C38] to-[#0D1527] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Text & Badges */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-200 border border-white/15 backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            {title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>

          {actionButtonText && onActionButtonClick && (
            <div className="mt-5 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={onActionButtonClick}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <span>{actionButtonText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: 3D Interactive Scene Render */}
        <div className="shrink-0">
          {render3DGraphic()}
        </div>

      </div>
    </div>
  );
};
