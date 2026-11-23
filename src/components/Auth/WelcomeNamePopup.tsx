import React, { useState } from 'react';
import { User, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeNamePopupProps {
  onContinue: (name: string) => void;
}

export const WelcomeNamePopup: React.FC<WelcomeNamePopupProps> = ({ onContinue }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [visible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please tell us your name!'); return; }
    onContinue(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-sm rounded-[28px] p-8 text-center"
        style={{
          background: 'rgba(8,12,36,0.95)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1.5px solid rgba(34,211,238,0.2)',
          boxShadow: '0 0 60px rgba(34,211,238,0.1), 0 30px 70px -15px rgba(0,0,0,0.9)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Animated icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full blur-xl opacity-50 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.5), rgba(255,77,121,0.3), transparent)', animationDuration: '3s' }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #1e40af, #0e7490)', boxShadow: '0 0 40px rgba(34,211,238,0.5)' }}>
              <User className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 animate-pulse" style={{ color: '#fbbf24', animationDuration: '2s' }} />
          <h2 className="text-xl font-black text-white">What do I call you?</h2>
          <Sparkles className="h-5 w-5 animate-pulse" style={{ color: '#fbbf24', animationDuration: '2s' }} />
        </div>

        <p className="text-sm mb-7" style={{ color: '#94a3b8' }}>
          Welcome to PocketZapp AI! Tell us your name so we can personalize your experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{ background: 'rgba(34,211,238,0.07)', border: '1.5px solid rgba(34,211,238,0.25)' }}
          >
            <User className="h-5 w-5 shrink-0" style={{ color: '#22d3ee' }} />
            <input
              type="text"
              placeholder="Enter your name…"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              autoFocus
              className="flex-1 bg-transparent text-sm font-semibold text-white placeholder-slate-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold" style={{ color: '#ff4d79' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #34d399)', boxShadow: '0 4px 20px rgba(34,211,238,0.35)' }}
          >
            Continue to PocketZapp
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeNamePopup;
