import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Delete, Eye, EyeOff, AlertCircle, Check, Shield } from 'lucide-react';
import { UserProfile } from '../../types';

interface PinLockScreenProps {
  user: UserProfile;
  onUnlocked: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Constant-time PIN comparison — never log or expose the PIN value
function verifyPin(entered: string, stored: string): boolean {
  if (entered.length !== stored.length) return false;
  let result = 0;
  for (let i = 0; i < entered.length; i++) {
    result |= entered.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return result === 0;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ user, onUnlocked, onUpdateUser }) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [filledAnim, setFilledAnim] = useState<boolean[]>([false, false, false, false]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lockout countdown on mount / lockUntil change
  useEffect(() => {
    if (user.lockUntil) {
      const remaining = Math.max(0, Math.ceil((user.lockUntil - Date.now()) / 1000));
      if (remaining > 0) {
        setLockoutSeconds(remaining);
        timerRef.current = setInterval(() => {
          setLockoutSeconds((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              onUpdateUser({ ...user, lockUntil: null, failedPinAttempts: 0 });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
      }
    }
  }, [user.lockUntil]);

  const triggerShake = () => {
    setShake(true);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    setTimeout(() => setShake(false), 600);
  };

  const validatePin = useCallback((entered: string) => {
    if (verifyPin(entered, user.pin || '')) {
      setIsSuccess(true);
      setErrorMessage('');
      onUpdateUser({ ...user, failedPinAttempts: 0, lockUntil: null });
      setTimeout(() => onUnlocked(), 900);
    } else {
      triggerShake();
      const newAttempts = (user.failedPinAttempts || 0) + 1;
      setPinInput('');
      setFilledAnim([false, false, false, false]);
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_SECONDS * 1000;
        onUpdateUser({ ...user, failedPinAttempts: newAttempts, lockUntil: lockoutTime });
        setLockoutSeconds(LOCKOUT_SECONDS);
        setErrorMessage(`Security lockout active. Try again in ${LOCKOUT_SECONDS}s.`);
      } else {
        onUpdateUser({ ...user, failedPinAttempts: newAttempts });
        const remaining = MAX_ATTEMPTS - newAttempts;
        setErrorMessage(`Incorrect PIN — ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      }
    }
  }, [user, onUnlocked, onUpdateUser]);

  const handleKeyPress = useCallback((digit: string) => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setErrorMessage('');
    if (pinInput.length < PIN_LENGTH) {
      const next = pinInput + digit;
      setPinInput(next);
      setFilledAnim(prev => { const a = [...prev]; a[next.length - 1] = true; return a; });
      if (next.length === PIN_LENGTH) setTimeout(() => validatePin(next), 80);
    }
  }, [lockoutSeconds, isSuccess, pinInput, validatePin]);

  const handleBackspace = useCallback(() => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setErrorMessage('');
    setPinInput(prev => {
      if (prev.length === 0) return prev;
      setFilledAnim(arr => { const a = [...arr]; a[prev.length - 1] = false; return a; });
      return prev.slice(0, -1);
    });
  }, [lockoutSeconds, isSuccess]);

  const handleClear = useCallback(() => {
    if (lockoutSeconds > 0 || isSuccess) return;
    setPinInput('');
    setFilledAnim([false, false, false, false]);
    setErrorMessage('');
  }, [lockoutSeconds, isSuccess]);

  // Physical keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleKeyPress(e.key);
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKeyPress, handleBackspace, handleClear]);

  const greeting = getTimeGreeting();
  const firstName = user.name?.split(' ')[0] || 'User';

  // Stable floating coin positions
  const coins = [
    { top: '8%', left: '6%', delay: '0s', dur: '7s' },
    { top: '15%', left: '87%', delay: '1.5s', dur: '8s' },
    { top: '55%', left: '4%', delay: '2.8s', dur: '6s' },
    { top: '72%', left: '91%', delay: '0.7s', dur: '9s' },
    { top: '38%', left: '2%', delay: '3.5s', dur: '7.5s' },
    { top: '82%', left: '12%', delay: '1.2s', dur: '8.5s' },
    { top: '28%', left: '93%', delay: '2.2s', dur: '5.5s' },
    { top: '48%', left: '96%', delay: '0.4s', dur: '10s' },
    { top: '65%', left: '7%', delay: '4s', dur: '6.5s' },
    { top: '90%', left: '78%', delay: '1.9s', dur: '7s' },
  ];

  return (
    <>
      <style>{`
        @keyframes coinRise {
          0%   { transform: translateY(0px) rotate(-8deg); opacity: 0; }
          15%  { opacity: 0.55; }
          85%  { opacity: 0.35; }
          100% { transform: translateY(-90px) rotate(12deg); opacity: 0; }
        }
        @keyframes auroraShift {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33%       { transform: scale(1.1) translate(3%, -4%); }
          66%       { transform: scale(0.95) translate(-2%, 3%); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        @keyframes dotPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden transition-all duration-800 ${
          isSuccess ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 25% 60%, #0d1b4b 0%, #070a1f 55%, #0a0620 100%)',
        }}
      >
        {/* Aurora blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute rounded-full" style={{
            width: '700px', height: '450px', top: '-15%', left: '-20%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.22) 0%, transparent 65%)',
            animation: 'auroraShift 12s ease-in-out infinite',
            filter: 'blur(80px)',
          }} />
          <div className="absolute rounded-full" style={{
            width: '550px', height: '550px', bottom: '-25%', right: '-15%',
            background: 'radial-gradient(circle, rgba(255,77,121,0.18) 0%, transparent 65%)',
            animation: 'auroraShift 15s ease-in-out infinite 3s',
            filter: 'blur(70px)',
          }} />
          <div className="absolute rounded-full" style={{
            width: '350px', height: '350px', top: '25%', right: '15%',
            background: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 65%)',
            animation: 'auroraShift 9s ease-in-out infinite 1.5s',
            filter: 'blur(60px)',
          }} />
          {/* Subtle dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }} />
        </div>

        {/* Floating ₹ coins */}
        {coins.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute select-none pointer-events-none font-black"
            style={{
              top: c.top, left: c.left,
              fontSize: i % 3 === 0 ? '1.5rem' : i % 2 === 0 ? '1.1rem' : '0.9rem',
              color: 'rgba(251,191,36,0.35)',
              animation: `coinRise ${c.dur} ease-in-out infinite`,
              animationDelay: c.delay,
              textShadow: '0 0 12px rgba(251,191,36,0.4)',
            }}
          >
            ₹
          </span>
        ))}

        {/* ── GLASS CARD ── */}
        <div
          className={`relative w-full max-w-[390px] rounded-[28px] p-7 sm:p-8 transition-all duration-300 ${
            shake ? 'animate-[wiggle_0.45s_ease-in-out]' : ''
          }`}
          style={{
            background: 'rgba(8, 12, 36, 0.78)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: isSuccess
              ? '1.5px solid rgba(52,211,153,0.45)'
              : '1.5px solid rgba(34,211,238,0.14)',
            boxShadow: isSuccess
              ? '0 0 70px rgba(52,211,153,0.25), 0 30px 70px -15px rgba(0,0,0,0.85)'
              : '0 0 50px rgba(34,211,238,0.07), 0 30px 70px -15px rgba(0,0,0,0.85)',
          }}
        >
          {/* Brand + Shield */}
          <div className="flex flex-col items-center text-center space-y-3">

            {/* Animated shield icon */}
            <div className="relative mt-1">
              <div className="absolute -inset-4 rounded-full blur-2xl opacity-50 animate-pulse" style={{
                background: isSuccess
                  ? 'radial-gradient(circle, rgba(52,211,153,0.6), transparent)'
                  : 'radial-gradient(circle, rgba(34,211,238,0.5), rgba(255,77,121,0.3), transparent)',
                animationDuration: '3s',
              }} />
              <div
                className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] transition-all duration-500"
                style={{
                  background: isSuccess
                    ? 'linear-gradient(145deg, #34d399, #059669)'
                    : 'linear-gradient(145deg, #1e3a8a, #0e7490)',
                  boxShadow: isSuccess
                    ? '0 0 35px rgba(52,211,153,0.6), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : '0 0 30px rgba(34,211,238,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {isSuccess
                  ? <Check className="h-8 w-8 text-white" strokeWidth={3} />
                  : <Shield className="h-8 w-8 text-white animate-pulse" style={{ animationDuration: '2.5s' }} />
                }
              </div>
            </div>

            {/* PocketZapp brand */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">
                Pocket<span style={{ color: '#ff4d79' }}>Zapp</span>
              </span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest" style={{
                background: 'rgba(34,211,238,0.12)',
                border: '1px solid rgba(34,211,238,0.28)',
                color: '#22d3ee',
              }}>AI</span>
            </div>

            {/* Time-based greeting */}
            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {isSuccess ? '✓ Access Granted!' : `${greeting}, ${firstName} ✨`}
              </h1>
              {!isSuccess && (
                <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                  Your money deserves protection.
                </p>
              )}
              <p className="text-xs" style={{ color: '#64748b' }}>
                {isSuccess
                  ? 'Unlocking your PocketZapp universe…'
                  : 'Secure access to your PocketZapp universe.'}
              </p>
            </div>
          </div>

          {/* Lockout Timer */}
          {lockoutSeconds > 0 && (
            <div className="mt-5 rounded-2xl p-4 text-center" style={{
              background: 'rgba(255,77,121,0.1)',
              border: '1px solid rgba(255,77,121,0.3)',
            }}>
              <AlertCircle className="mx-auto mb-1.5 h-5 w-5" style={{ color: '#ff4d79' }} />
              <p className="text-xs font-bold text-white">Security Lockout Active</p>
              <p className="mt-1.5 text-xs" style={{ color: '#94a3b8' }}>
                Wait{' '}
                <span className="font-mono font-black text-lg" style={{ color: '#ff4d79' }}>
                  {lockoutSeconds}s
                </span>{' '}
                to retry
              </p>
            </div>
          )}

          {/* PIN Dots */}
          <div className="mt-6 flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
                const filled = idx < pinInput.length;
                return (
                  <div
                    key={idx}
                    className="flex h-14 w-14 items-center justify-center rounded-[18px] transition-all duration-200"
                    style={{
                      background: isSuccess
                        ? 'rgba(52,211,153,0.18)'
                        : filled
                        ? 'rgba(34,211,238,0.1)'
                        : 'rgba(255,255,255,0.04)',
                      border: isSuccess
                        ? '1.5px solid rgba(52,211,153,0.55)'
                        : filled
                        ? '1.5px solid rgba(34,211,238,0.5)'
                        : '1.5px solid rgba(255,255,255,0.08)',
                      boxShadow: isSuccess
                        ? '0 0 20px rgba(52,211,153,0.3)'
                        : filled
                        ? '0 0 16px rgba(34,211,238,0.22)'
                        : 'none',
                      transform: (filled && filledAnim[idx]) || isSuccess ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {filled ? (
                      showPin ? (
                        <span
                          className="font-mono font-black text-lg"
                          style={{ color: '#22d3ee', animation: 'dotPop 0.2s ease-out forwards' }}
                        >
                          {pinInput[idx]}
                        </span>
                      ) : (
                        <div
                          className="rounded-full"
                          style={{
                            width: '12px', height: '12px',
                            background: 'linear-gradient(135deg, #22d3ee, #ff4d79)',
                            animation: 'dotPop 0.2s ease-out forwards',
                            boxShadow: '0 0 10px rgba(34,211,238,0.5)',
                          }}
                        />
                      )
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show / Hide toggle */}
            <button
              type="button"
              onClick={() => setShowPin(s => !s)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 hover:opacity-80"
              style={{ color: '#64748b' }}
            >
              {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
            </button>
          </div>

          {/* Error */}
          {errorMessage && lockoutSeconds === 0 && (
            <div className="mt-3 rounded-xl px-3 py-2.5 text-center text-xs font-semibold" style={{
              background: 'rgba(255,77,121,0.1)',
              border: '1px solid rgba(255,77,121,0.25)',
              color: '#ff4d79',
            }}>
              {errorMessage}
            </div>
          )}

          {/* Success banner */}
          {isSuccess && (
            <div className="mt-3 rounded-xl px-3 py-2.5 text-center text-xs font-semibold" style={{
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399',
            }}>
              ✓ PIN Verified — Welcome back!
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {['1','2','3','4','5','6','7','8','9'].map((d) => (
              <KeypadButton key={d} label={d} disabled={lockoutSeconds > 0 || isSuccess} onClick={() => handleKeyPress(d)} />
            ))}
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isSuccess}
              onClick={handleClear}
              className="flex h-14 items-center justify-center rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}
            >
              Clear
            </button>
            <KeypadButton label="0" disabled={lockoutSeconds > 0 || isSuccess} onClick={() => handleKeyPress('0')} />
            <button
              type="button"
              disabled={lockoutSeconds > 0 || isSuccess}
              onClick={handleBackspace}
              aria-label="Backspace"
              className="flex h-14 items-center justify-center rounded-[18px] transition-all duration-150 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}
            >
              <Delete className="h-5 w-5" />
            </button>
          </div>

          {/* Footer security indicator */}
          <div className="mt-5 flex items-center justify-center gap-2 border-t pt-4 text-[11px] font-medium" style={{
            borderColor: 'rgba(255,255,255,0.07)',
            color: '#475569',
          }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{
              background: '#34d399',
              boxShadow: '0 0 8px rgba(52,211,153,0.9)',
              animationDuration: '2s',
            }} />
            <span>256-bit encrypted • Zero-Trust Lock</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable keypad digit button
const KeypadButton: React.FC<{ label: string; disabled: boolean; onClick: () => void }> = ({ label, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="relative flex h-14 items-center justify-center rounded-[18px] text-xl font-bold text-white transition-all duration-100 active:scale-90 active:brightness-125 disabled:opacity-25 disabled:cursor-not-allowed select-none"
    style={{ background: 'rgba(255,255,255,0.065)', border: '1px solid rgba(255,255,255,0.1)' }}
    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,211,238,0.14)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(34,211,238,0.35)'; }}
    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.065)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.065)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
  >
    {label}
  </button>
);

export default PinLockScreen;
