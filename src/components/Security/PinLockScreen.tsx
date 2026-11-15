import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  Delete, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PinLockScreenProps {
  user: UserProfile;
  onUnlocked: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  user,
  onUnlocked,
  onUpdateUser,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [recoveryId, setRecoveryId] = useState<string>('');
  const [recoveryError, setRecoveryError] = useState<string>('');
  const [recoverySuccess, setRecoverySuccess] = useState<string>('');

  const pinTargetLength = user.pinLength || 4;

  // Handle lockout countdown
  useEffect(() => {
    if (user.lockUntil) {
      const remaining = Math.max(0, Math.ceil((user.lockUntil - Date.now()) / 1000));
      if (remaining > 0) {
        setLockoutSeconds(remaining);
        const timer = setInterval(() => {
          setLockoutSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              onUpdateUser({ ...user, lockUntil: null, failedPinAttempts: 0 });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [user.lockUntil]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const validateUnlockPin = (entered: string) => {
    if (entered === user.pin) {
      setIsSuccess(true);
      setErrorMessage('');
      onUpdateUser({ ...user, failedPinAttempts: 0, lockUntil: null });
      // Smooth fade-out before unmounting
      setTimeout(() => {
        onUnlocked();
      }, 700);
    } else {
      triggerShake();
      const newAttempts = (user.failedPinAttempts || 0) + 1;
      setPinInput('');

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 30 * 1000;
        onUpdateUser({
          ...user,
          failedPinAttempts: newAttempts,
          lockUntil: lockoutTime,
        });
        setLockoutSeconds(30);
        setErrorMessage('Too many failed attempts! Security lock engaged for 30s.');
      } else {
        onUpdateUser({ ...user, failedPinAttempts: newAttempts });
        const remaining = 5 - newAttempts;
        setErrorMessage(
          `Incorrect PIN. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining before lockout.`
        );
      }
    }
  };

  const handleKeyPress = (digit: string) => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setErrorMessage('');

    if (pinInput.length < pinTargetLength) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === pinTargetLength) {
        validateUnlockPin(next);
      }
    }
  };

  const handleBackspace = () => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setPinInput('');
    setErrorMessage('');
  };

  const handleForgotPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      recoveryId.trim().toUpperCase() === user.collegeId.toUpperCase() ||
      recoveryId.trim().toUpperCase() === 'POCKETZAPP2026'
    ) {
      onUpdateUser({
        ...user,
        pin: '1507',
        failedPinAttempts: 0,
        lockUntil: null,
        isPinSet: true,
      });
      setRecoverySuccess('PIN has been successfully reset! Enter your PIN on the keypad.');
      setRecoveryError('');
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoverySuccess('');
        setRecoveryId('');
      }, 1500);
    } else {
      setRecoveryError('Verification failed. Please check your College ID or Master Code.');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#070B14]/80 backdrop-blur-[14px] p-4 font-sans text-white transition-opacity duration-700 ${
        isSuccess ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Centred Floating Glassmorphism Security Card */}
      <div 
        className={`relative w-full max-w-sm rounded-[32px] border border-white/[0.12] bg-[#0E1526]/85 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-2xl transition-all duration-300 ${
          shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''
        } ${isSuccess ? 'ring-2 ring-emerald-400 border-emerald-400/60 shadow-[0_0_60px_rgba(16,185,129,0.35)]' : ''}`}
      >
        {/* Top Glowing Security Shield & Branding */}
        <div className="flex flex-col items-center text-center">
          
          {/* Animated Glowing Security Shield */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Outer pulsating wave */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500/30 to-cyan-400/30 blur-md animate-pulse" />
            <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 shadow-xl ${
              isSuccess 
                ? 'border-emerald-400/60 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30'
                : 'border-blue-400/40 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-blue-500/30'
            }`}>
              {isSuccess ? (
                <Check className="h-8 w-8 text-white animate-bounce" />
              ) : (
                <Shield className="h-8 w-8 text-white drop-shadow-md" />
              )}
            </div>
          </div>

          {/* PocketZapp AI Logo */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white">
              Pocket<span className="text-rose-500">Zapp</span>
            </span>
            <span className="rounded-full border border-blue-400/40 bg-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">
              AI
            </span>
          </div>

          {/* Heading: Welcome Back! */}
          <h1 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
            {isSuccess ? 'Access Granted!' : 'Welcome Back!'}
          </h1>

          {/* Personalized Greeting with user's name */}
          <p className="mt-0.5 text-xs font-semibold text-blue-300">
            {isSuccess ? 'Decrypting your dashboard...' : `Hello, ${user.name}`}
          </p>

          {/* Subtitle */}
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            "Your money deserves protection."
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutSeconds > 0 && (
          <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-3 text-center text-xs text-rose-300 animate-pulse">
            <AlertCircle className="mx-auto mb-1 h-5 w-5 text-rose-400" />
            <p className="font-bold">Security Lockout Active</p>
            <p className="mt-0.5 text-slate-300">
              Please wait <span className="font-mono font-black text-rose-400 text-sm">{lockoutSeconds}s</span> before retrying.
            </p>
          </div>
        )}

        {/* Four-digit PIN input with four glowing circular indicators */}
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3.5">
            {Array.from({ length: pinTargetLength }).map((_, idx) => {
              const isFilled = idx < pinInput.length;
              const digitChar = isFilled ? pinInput[idx] : '';
              
              return (
                <div
                  key={idx}
                  className={`relative flex h-13 w-13 items-center justify-center rounded-2xl border transition-all duration-300 ${
                    isSuccess
                      ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105'
                      : isFilled
                      ? 'border-cyan-400 bg-blue-500/25 text-white font-mono font-bold text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'border-white/10 bg-white/[0.04] text-transparent'
                  }`}
                >
                  {isFilled && (
                    <span className="animate-scaleIn">
                      {showPin ? digitChar : '●'}
                    </span>
                  )}
                  {!isFilled && (
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Show/Hide PIN Option */}
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/15 p-2.5 text-center text-xs font-semibold text-rose-300 shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* Premium 3D Numeric Keypad (0–9) */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={lockoutSeconds > 0 || isSuccess}
              onClick={() => handleKeyPress(digit)}
              className="group relative flex h-13 items-center justify-center rounded-2xl border border-white/[0.08] border-t-white/[0.18] bg-gradient-to-b from-white/[0.1] to-white/[0.03] text-xl font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-150 hover:border-cyan-400/50 hover:bg-white/[0.15] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95 active:translate-y-0.5 active:bg-blue-600/40 disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <span>{digit}</span>
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            disabled={lockoutSeconds > 0 || isSuccess}
            onClick={handleClear}
            className="flex h-13 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-xs font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-white/[0.08] hover:text-white active:scale-95 disabled:opacity-25"
          >
            Clear
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            disabled={lockoutSeconds > 0 || isSuccess}
            onClick={() => handleKeyPress('0')}
            className="group relative flex h-13 items-center justify-center rounded-2xl border border-white/[0.08] border-t-white/[0.18] bg-gradient-to-b from-white/[0.1] to-white/[0.03] text-xl font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-150 hover:border-cyan-400/50 hover:bg-white/[0.15] active:scale-95 active:translate-y-0.5 active:bg-blue-600/40 disabled:opacity-25"
          >
            <span>0</span>
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            disabled={lockoutSeconds > 0 || isSuccess}
            onClick={handleBackspace}
            className="flex h-13 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-slate-400 transition-all hover:bg-white/[0.08] hover:text-rose-400 active:scale-95 disabled:opacity-25"
            aria-label="Backspace"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {/* Forgot PIN Option */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-medium text-slate-400 hover:text-cyan-300 hover:underline transition-colors"
          >
            Forgot PIN?
          </button>
        </div>

        {/* Small Green Encrypted-Session Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/[0.08] pt-3 text-[11px] font-medium text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>256-Bit SSL Encrypted • Secured Session</span>
        </div>
      </div>

      {/* Forgot PIN Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#0F172A] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 text-cyan-400 border border-cyan-400/30">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Master PIN</h3>
                <p className="text-xs text-slate-400">Account Recovery Verification</p>
              </div>
            </div>

            <form onSubmit={handleForgotPinSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Enter College ID or Master Code:
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS-2024-8841 or POCKETZAPP2026"
                  value={recoveryId}
                  onChange={(e) => setRecoveryId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {recoveryError && (
                <p className="text-xs text-rose-400 font-medium">{recoveryError}</p>
              )}

              {recoverySuccess && (
                <p className="text-xs text-emerald-400 font-medium">{recoverySuccess}</p>
              )}

              <div className="rounded-xl bg-blue-950/40 border border-blue-800/40 p-2.5 text-[11px] text-blue-200">
                💡 <strong>Demo Recovery Hint:</strong> Use Student ID <code className="text-white font-mono">{user.collegeId}</code> or code <code className="text-white font-mono">POCKETZAPP2026</code>.
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setRecoveryError('');
                    setRecoverySuccess('');
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-2.5 text-xs font-semibold text-white hover:opacity-95 shadow-md shadow-blue-600/30"
                >
                  Verify & Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
