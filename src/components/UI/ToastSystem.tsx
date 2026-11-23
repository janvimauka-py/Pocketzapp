/**
 * PocketZapp AI – Universal Toast & Notification System
 * Phase 2: Reusable toast(), openSheet(), and notification helpers
 */

import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Check } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  emoji?: string;
  duration?: number; // ms, default 3500
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Toast config ──────────────────────────────────────────────────────────

const TOAST_STYLES: Record<ToastType, { border: string; bg: string; iconColor: string; barColor: string }> = {
  success: {
    border: 'rgba(52,211,153,0.4)',
    bg: 'rgba(52,211,153,0.08)',
    iconColor: '#34d399',
    barColor: '#34d399',
  },
  error: {
    border: 'rgba(255,77,121,0.4)',
    bg: 'rgba(255,77,121,0.08)',
    iconColor: '#ff4d79',
    barColor: '#ff4d79',
  },
  warning: {
    border: 'rgba(251,191,36,0.4)',
    bg: 'rgba(251,191,36,0.08)',
    iconColor: '#fbbf24',
    barColor: '#fbbf24',
  },
  info: {
    border: 'rgba(34,211,238,0.4)',
    bg: 'rgba(34,211,238,0.08)',
    iconColor: '#22d3ee',
    barColor: '#22d3ee',
  },
};

const TOAST_ICONS: Record<ToastType, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

// ─── Single Toast Item ─────────────────────────────────────────────────────

const ToastCard: React.FC<{ item: ToastItem; onDismiss: (id: string) => void }> = ({ item, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const style = TOAST_STYLES[item.type];
  const Icon = TOAST_ICONS[item.type];
  const duration = item.duration ?? 3500;

  useEffect(() => {
    // Slide in
    const inTimer = setTimeout(() => setVisible(true), 20);
    // Auto-dismiss
    const outTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(item.id), 350);
    }, duration);
    return () => { clearTimeout(inTimer); clearTimeout(outTimer); };
  }, []);

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(() => onDismiss(item.id), 350); }}
      style={{
        background: 'rgba(10,15,40,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${style.border}`,
        borderLeft: `4px solid ${style.barColor}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${style.bg}`,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        cursor: 'pointer',
        minWidth: '280px',
        maxWidth: '380px',
        marginBottom: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '2px',
        background: style.barColor,
        animation: `toastProgress ${duration}ms linear forwards`,
        opacity: 0.6,
      }} />

      <Icon style={{ color: style.iconColor, width: 20, height: 20, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>
          {item.emoji && <span style={{ marginRight: 4 }}>{item.emoji}</span>}
          {item.title}
        </p>
        {item.message && (
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: 2, lineHeight: 1.4 }}>
            {item.message}
          </p>
        )}
      </div>
      <X style={{ color: '#64748b', width: 14, height: 14, flexShrink: 0 }} />

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// ─── Toast Provider & Container ────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [{ ...item, id }, ...prev].slice(0, 5)); // max 5 stacked
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastCard item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Payment Success Bottom Sheet ──────────────────────────────────────────

export interface PaymentSheetProps {
  isOpen: boolean;
  amount: number;
  currency: string;
  recipient: string;
  upiId?: string;
  referenceId?: string;
  cashback?: number;
  onDone: () => void;
  onViewReceipt?: () => void;
}

export const PaymentSuccessSheet: React.FC<PaymentSheetProps> = ({
  isOpen,
  amount,
  currency,
  recipient,
  upiId,
  referenceId,
  cashback,
  onDone,
  onViewReceipt,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'rgba(10,15,40,0.98)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(52,211,153,0.3)',
        borderBottom: 'none',
        borderRadius: '28px 28px 0 0',
        padding: '32px 24px 40px',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 -20px 60px rgba(52,211,153,0.15)',
      }}>
        {/* Handle bar */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto 24px',
        }} />

        {/* Animated checkmark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #34d399, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(52,211,153,0.5)',
            animation: 'successPop 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
          }}>
            <Check size={36} color="white" strokeWidth={3} />
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#34d399', fontWeight: 700, fontSize: '14px', marginBottom: 4 }}>
          Payment Successful!
        </p>
        <p style={{
          textAlign: 'center', fontWeight: 900, fontSize: '32px',
          background: 'linear-gradient(135deg, #22d3ee, #34d399)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 20,
        }}>
          {currency}{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>

        {/* Details */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '16px',
          marginBottom: 20,
        }}>
          {[
            { label: 'Paid to', value: recipient },
            upiId ? { label: 'UPI ID', value: upiId } : null,
            referenceId ? { label: 'Reference', value: referenceId } : null,
            cashback ? { label: '🎁 Cashback Earned', value: `${currency}${cashback.toFixed(2)}` } : null,
          ].filter(Boolean).map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>{(row as any).label}</span>
              <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{(row as any).value}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          {onViewReceipt && (
            <button
              onClick={onViewReceipt}
              style={{
                flex: 1, padding: '14px',
                background: 'rgba(34,211,238,0.1)',
                border: '1px solid rgba(34,211,238,0.3)',
                borderRadius: 14, color: '#22d3ee',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}
            >
              View Receipt
            </button>
          )}
          <button
            onClick={onDone}
            style={{
              flex: 1, padding: '14px',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              border: 'none', borderRadius: 14, color: '#fff',
              fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(52,211,153,0.4)',
            }}
          >
            Done
          </button>
        </div>

        <style>{`
          @keyframes successPop {
            0%   { transform: scale(0.5); opacity: 0; }
            70%  { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

// ─── Savings Milestone Popup ───────────────────────────────────────────────

export interface SavingsMilestoneProps {
  isOpen: boolean;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  milestonePercent: 25 | 50 | 75 | 100;
  onClose: () => void;
}

const MILESTONE_MESSAGES: Record<number, string> = {
  25: "Great start! You're a quarter of the way there 🚀",
  50: "You're halfway there! Keep building your savings. 💪",
  75: "Almost there! Just 25% more to go! 🎯",
  100: "🎉 Goal Achieved! You did it! Time to celebrate!",
};

export const SavingsMilestonePopup: React.FC<SavingsMilestoneProps> = ({
  isOpen, goalName, currentAmount, targetAmount, currency, milestonePercent, onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (milestonePercent / 100) * circ;

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: 16,
    }}>
      <div style={{
        maxWidth: 340, width: '100%',
        background: 'rgba(10,15,40,0.95)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(34,211,238,0.2)',
        borderRadius: 24, padding: 28, textAlign: 'center',
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(34,211,238,0.1)',
      }}>
        {/* Circular progress ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <svg width={110} height={110}>
            <circle cx={55} cy={55} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
            <circle
              cx={55} cy={55} r={radius}
              fill="none"
              stroke="url(#mGrad)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 55 55)"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <text x={55} y={55} textAnchor="middle" dominantBaseline="middle"
              fill="#f1f5f9" fontSize={18} fontWeight={900}>{milestonePercent}%</text>
          </svg>
        </div>

        <p style={{ color: '#22d3ee', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
          Milestone Reached!
        </p>
        <h3 style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '18px', marginBottom: 8 }}>{goalName}</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: 12 }}>
          {currency}{currentAmount.toLocaleString('en-IN')} of {currency}{targetAmount.toLocaleString('en-IN')} saved
        </p>
        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.5, marginBottom: 20 }}>
          {MILESTONE_MESSAGES[milestonePercent]}
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #22d3ee, #34d399)',
            border: 'none', borderRadius: 12, color: '#fff',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(34,211,238,0.3)',
          }}
        >
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
};

export default ToastProvider;
