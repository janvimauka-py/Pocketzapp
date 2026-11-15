import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, Smartphone, ArrowRight, X } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  title,
  subtitle,
  onSuccess,
  onCancel,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [cooldown, setCooldown] = useState<number>(30);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate simulated OTP when opened
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    setIsExpired(false);
    setCooldown(30);
    setAttemptsLeft(3);
  };

  useEffect(() => {
    if (isOpen) {
      generateNewOtp();
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Countdown timer for resend & expiry (expires after 2 minutes)
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (index: number, value: string) => {
    if (isExpired) return;
    setErrorMessage('');

    // Only allow numbers
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // Handle paste of 6 digits
    if (cleanVal.length === 6) {
      const newDigits = cleanVal.split('').slice(0, 6);
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = singleDigit;
    setDigits(nextDigits);

    // Auto focus next box
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (generatedOtp) {
      setDigits(generatedOtp.split(''));
      setErrorMessage('');
    }
  };

  const handleVerify = () => {
    const fullEntered = digits.join('');
    if (fullEntered.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      if (fullEntered === generatedOtp) {
        onSuccess();
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        if (remaining <= 0) {
          setIsExpired(true);
          setErrorMessage('Maximum attempts exceeded. Please request a new OTP code.');
        } else {
          setErrorMessage(`Invalid OTP code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
        }
      }
    }, 800);
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl transition-all sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {/* Demo Mode Simulated OTP Notification Banner */}
        <div className="mt-5 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-indigo-50/70 p-3.5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Smartphone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  Simulated 2FA SMS Delivery
                </p>
                <p className="text-xs text-slate-700">
                  PocketZapp Verification Code:{' '}
                  <span className="font-mono font-bold text-blue-900 text-sm tracking-wider">
                    {generatedOtp}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all"
            >
              Auto-Fill
            </button>
          </div>
        </div>

        {/* 6 Digit Input Group */}
        <div className="mt-6">
          <label className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Enter 6-Digit Security Code
          </label>
          <div className="mt-3 flex justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isExpired || isVerifying}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`h-12 w-11 sm:h-13 sm:w-12 rounded-xl border text-center text-xl font-bold transition-all focus:outline-none focus:ring-2 ${
                  digit
                    ? 'border-blue-600 bg-blue-50/40 text-blue-950 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20'
                } ${isExpired ? 'opacity-40 bg-slate-100' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 p-2 text-center text-xs font-medium text-rose-600">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            disabled={!isComplete || isVerifying || isExpired}
            onClick={handleVerify}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Confirm Operation</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={generateNewOtp}
              className="font-medium text-blue-600 hover:text-blue-800 disabled:text-slate-400 disabled:cursor-not-allowed hover:underline"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend New OTP'}
            </button>
            <span className="text-[11px] text-slate-400">
              {attemptsLeft} attempts left
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
