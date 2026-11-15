import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';
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
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [recoveryId, setRecoveryId] = useState<string>('');
  const [recoveryError, setRecoveryError] = useState<string>('');

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

  const handleKeyPress = (digit: string) => {
    if (lockoutSeconds > 0) return;
    setErrorMessage('');

    if (!user.isPinSet || isConfirming) {
      if (isConfirming) {
        if (confirmPinInput.length < pinTargetLength) {
          const next = confirmPinInput + digit;
          setConfirmPinInput(next);
          if (next.length === pinTargetLength) {
            validateSetupPin(pinInput, next);
          }
        }
      } else {
        if (pinInput.length < pinTargetLength) {
          const next = pinInput + digit;
          setPinInput(next);
          if (next.length === pinTargetLength) {
            setIsConfirming(true);
          }
        }
      }
    } else {
      // Normal Unlock Mode
      if (pinInput.length < pinTargetLength) {
        const next = pinInput + digit;
        setPinInput(next);
        if (next.length === pinTargetLength) {
          validateUnlockPin(next);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (lockoutSeconds > 0) return;
    if (isConfirming) {
      setConfirmPinInput((prev) => prev.slice(0, -1));
    } else {
      setPinInput((prev) => prev.slice(0, -1));
    }
    setErrorMessage('');
  };

  const handleClear = () => {
    if (lockoutSeconds > 0) return;
    setPinInput('');
    setConfirmPinInput('');
    setIsConfirming(false);
    setErrorMessage('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const validateUnlockPin = (entered: string) => {
    if (entered === user.pin) {
      onUpdateUser({ ...user, failedPinAttempts: 0, lockUntil: null });
      onUnlocked();
    } else {
      triggerShake();
      const newAttempts = (user.failedPinAttempts || 0) + 1;
      setPinInput('');

      if (newAttempts >= 3) {
        const lockoutTime = Date.now() + 30 * 1000;
        onUpdateUser({
          ...user,
          failedPinAttempts: newAttempts,
          lockUntil: lockoutTime,
        });
        setLockoutSeconds(30);
        setErrorMessage('Too many failed attempts! App locked for 30 seconds.');
      } else {
        onUpdateUser({ ...user, failedPinAttempts: newAttempts });
        setErrorMessage(
          `Incorrect PIN. ${3 - newAttempts} attempt${3 - newAttempts > 1 ? 's' : ''} remaining before lockout.`
        );
      }
    }
  };

  const validateSetupPin = (first: string, second: string) => {
    if (first === second) {
      onUpdateUser({
        ...user,
        pin: first,
        isPinSet: true,
        failedPinAttempts: 0,
        lockUntil: null,
      });
      onUnlocked();
    } else {
      triggerShake();
      setErrorMessage("PINs do not match. Please start over.");
      setPinInput('');
      setConfirmPinInput('');
      setIsConfirming(false);
    }
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
      setShowForgotModal(false);
      setRecoveryId('');
      setRecoveryError('');
      setErrorMessage('PIN successfully reset. Please enter your PIN to unlock.');
    } else {
      setRecoveryError('Invalid College ID or Recovery Code. Try "CS-2024-8841" or "POCKETZAPP2026".');
    }
  };

  const currentDisplayLength = isConfirming ? confirmPinInput.length : pinInput.length;
  const currentPinString = isConfirming ? confirmPinInput : pinInput;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4 font-sans text-white">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-rose-500/15 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        
        {/* App Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Pocket<span className="text-rose-500">Zapp</span> <span className="text-xs uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-400/30 ml-1">AI</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {lockoutSeconds > 0
              ? 'Security Lockout Activated'
              : !user.isPinSet
              ? 'Create your Master Security PIN'
              : isConfirming
              ? 'Confirm your Master PIN'
              : `Welcome back, ${user.name.split(' ')[0]}`}
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutSeconds > 0 ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs text-rose-300">
            <AlertCircle className="mx-auto mb-1 h-5 w-5 text-rose-400 animate-pulse" />
            <p className="font-semibold">Security Lock Engaged</p>
            <p className="mt-0.5 text-slate-300">
              Please wait <span className="font-bold text-rose-400 text-sm">{lockoutSeconds}s</span> before retrying.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-slate-300 font-medium">
            {!user.isPinSet
              ? 'Enter a 4-digit PIN for instant access'
              : isConfirming
              ? 'Re-enter your 4-digit PIN to confirm'
              : 'Enter your 4-digit App PIN to unlock'}
          </p>
        )}

        {/* PIN Indicators Dots */}
        <div
          className={`mt-4 flex items-center justify-center gap-3.5 ${
            shake ? 'animate-bounce text-rose-400' : ''
          }`}
        >
          {Array.from({ length: pinTargetLength }).map((_, idx) => {
            const isFilled = idx < currentDisplayLength;
            const digitChar = isFilled ? currentPinString[idx] : '';
            return (
              <div
                key={idx}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                  isFilled
                    ? 'border-blue-400 bg-blue-500/20 shadow-md shadow-blue-500/20 text-white font-bold text-lg'
                    : 'border-white/10 bg-white/5 text-transparent'
                }`}
              >
                {isFilled ? (showPin ? digitChar : '•') : ''}
              </div>
            );
          })}
        </div>

        {/* Show / Hide Toggle Button */}
        <div className="mt-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-center text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={lockoutSeconds > 0}
              onClick={() => handleKeyPress(digit)}
              className="flex h-13 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.06] text-xl font-semibold text-white transition-all active:scale-95 active:bg-blue-600/30 hover:bg-white/[0.12] hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={lockoutSeconds > 0}
            onClick={handleClear}
            className="flex h-13 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.04] text-xs font-medium text-slate-400 transition-all active:scale-95 hover:bg-white/[0.1] hover:text-white disabled:opacity-30"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={lockoutSeconds > 0}
            onClick={() => handleKeyPress('0')}
            className="flex h-13 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.06] text-xl font-semibold text-white transition-all active:scale-95 active:bg-blue-600/30 hover:bg-white/[0.12] disabled:opacity-30 shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            disabled={lockoutSeconds > 0}
            onClick={handleBackspace}
            className="flex h-13 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.04] text-slate-400 transition-all active:scale-95 hover:bg-white/[0.1] hover:text-white disabled:opacity-30"
            aria-label="Backspace"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Forgot PIN / Recovery link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs text-slate-400 hover:text-blue-400 hover:underline transition-colors"
          >
            Forgot or lost your PIN?
          </button>
        </div>
      </div>

      {/* Forgot PIN Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Master PIN</h3>
                <p className="text-xs text-slate-400">College Demo Account Verification</p>
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
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {recoveryError && (
                <p className="text-xs text-rose-400 font-medium">{recoveryError}</p>
              )}

              <div className="rounded-lg bg-blue-950/40 border border-blue-800/40 p-2.5 text-[11px] text-blue-200">
                💡 <strong>Demo Recovery Hint:</strong> Use Student ID <code className="text-white font-mono">{user.collegeId}</code> or code <code className="text-white font-mono">POCKETZAPP2026</code>.
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setRecoveryError('');
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
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
