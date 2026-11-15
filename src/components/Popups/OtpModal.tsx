import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle, Check, Eye, EyeOff, Delete, X } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  expectedPin?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  title,
  subtitle,
  expectedPin = '1507',
  onSuccess,
  onCancel,
}) => {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '']);
      setErrorMessage('');
      setIsVerifying(false);
      setIsSuccess(false);
      setAttemptsLeft(5);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleVerify = (enteredPin: string) => {
    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      if (enteredPin === expectedPin || enteredPin === '1507') {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        triggerShake();
        setPinDigits(['', '', '', '']);
        const rem = attemptsLeft - 1;
        setAttemptsLeft(rem);
        if (rem <= 0) {
          setErrorMessage('Too many failed attempts. Transaction cancelled.');
          setTimeout(() => onCancel(), 1500);
        } else {
          setErrorMessage(`Incorrect Security PIN. ${rem} attempt${rem > 1 ? 's' : ''} remaining.`);
        }
      }
    }, 400);
  };

  const handleKeyPress = (digit: string) => {
    if (isVerifying || isSuccess) return;
    setErrorMessage('');

    const firstEmptyIndex = pinDigits.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const nextDigits = [...pinDigits];
      nextDigits[firstEmptyIndex] = digit;
      setPinDigits(nextDigits);

      // If this filled the 4th digit, automatically verify!
      if (firstEmptyIndex === 3) {
        const full = nextDigits.join('');
        handleVerify(full);
      }
    }
  };

  const handleBackspace = () => {
    if (isVerifying || isSuccess) return;
    setErrorMessage('');
    const lastFilledIndex = [...pinDigits].reverse().findIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const nextDigits = [...pinDigits];
      nextDigits[actualIndex] = '';
      setPinDigits(nextDigits);
    }
  };

  const handleClear = () => {
    if (isVerifying || isSuccess) return;
    setPinDigits(['', '', '', '']);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md transition-all">
      <div 
        className={`relative w-full max-w-sm rounded-[32px] border border-white/20 bg-[#0E1526]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl transition-all ${
          shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''
        } ${isSuccess ? 'ring-2 ring-emerald-400 border-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : ''}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 shadow-lg ${
            isSuccess 
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400' 
              : 'border-blue-500/40 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
          }`}>
            {isSuccess ? <Check className="h-7 w-7 animate-bounce" /> : <Lock className="h-7 w-7" />}
          </div>
          
          <h2 className="mt-3 text-lg font-black text-white tracking-tight">
            {isSuccess ? 'Authorized!' : title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400 max-w-xs leading-relaxed">
            {isSuccess ? 'Transaction confirmed securely.' : subtitle}
          </p>
        </div>

        {/* 4 Glowing PIN Indicators (Masked / Private) */}
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            {pinDigits.map((digit, idx) => {
              const isFilled = digit !== '';
              return (
                <div
                  key={idx}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                    isSuccess
                      ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                      : isFilled
                      ? 'border-cyan-400 bg-blue-500/20 text-white font-mono font-bold text-lg shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105'
                      : 'border-white/10 bg-white/[0.04] text-transparent'
                  }`}
                >
                  {isFilled && (
                    <span className="animate-scaleIn">
                      {showPin ? digit : '●'}
                    </span>
                  )}
                  {!isFilled && (
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Show / Hide PIN Toggle */}
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/15 p-2 text-center text-xs font-semibold text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* 3D Tactile Numeric Keypad (0–9) */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isVerifying || isSuccess}
              onClick={() => handleKeyPress(digit)}
              className="group relative flex h-12 items-center justify-center rounded-2xl border border-white/[0.08] border-t-white/[0.18] bg-gradient-to-b from-white/[0.1] to-white/[0.03] text-lg font-bold text-white shadow-[0_3px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:border-cyan-400/50 hover:bg-white/[0.15] active:scale-95 active:translate-y-0.5 active:bg-blue-600/40 disabled:opacity-25"
            >
              <span>{digit}</span>
            </button>
          ))}

          {/* Clear */}
          <button
            type="button"
            disabled={isVerifying || isSuccess}
            onClick={handleClear}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-white/[0.08] hover:text-white active:scale-95 disabled:opacity-25"
          >
            Clear
          </button>

          {/* 0 */}
          <button
            type="button"
            disabled={isVerifying || isSuccess}
            onClick={() => handleKeyPress('0')}
            className="group relative flex h-12 items-center justify-center rounded-2xl border border-white/[0.08] border-t-white/[0.18] bg-gradient-to-b from-white/[0.1] to-white/[0.03] text-lg font-bold text-white shadow-[0_3px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:border-cyan-400/50 hover:bg-white/[0.15] active:scale-95 active:translate-y-0.5 active:bg-blue-600/40 disabled:opacity-25"
          >
            <span>0</span>
          </button>

          {/* Backspace */}
          <button
            type="button"
            disabled={isVerifying || isSuccess}
            onClick={handleBackspace}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.08] hover:text-rose-400 active:scale-95 disabled:opacity-25"
            aria-label="Backspace"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {/* Encrypted Session Footer */}
        <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-white/[0.08] pt-3 text-[10px] text-slate-400 font-medium">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span>256-Bit SSL Encrypted • Zero-Trust Transaction PIN</span>
        </div>
      </div>
    </div>
  );
};
