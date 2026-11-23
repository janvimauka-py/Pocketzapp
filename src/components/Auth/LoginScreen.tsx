import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, email: string, isNewUser: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stored credentials key
  const CRED_KEY = 'pz_credentials';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // UX delay

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        if (!email.trim() || !email.includes('@')) { setError('Enter a valid email address.'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }

        // Save credentials locally (demo - no real auth server)
        const existing = JSON.parse(localStorage.getItem(CRED_KEY) || '{}');
        if (existing[email.toLowerCase()]) {
          setError('An account with this email already exists. Please log in.');
          setLoading(false);
          return;
        }
        existing[email.toLowerCase()] = { name: name.trim(), password };
        localStorage.setItem(CRED_KEY, JSON.stringify(existing));
        onLogin(name.trim(), email.toLowerCase(), true);

      } else {
        // Login
        if (!email.trim()) { setError('Please enter your email.'); setLoading(false); return; }
        if (!password) { setError('Please enter your password.'); setLoading(false); return; }

        const existing = JSON.parse(localStorage.getItem(CRED_KEY) || '{}');
        const account = existing[email.toLowerCase()];

        if (!account) {
          setError('No account found. Please sign up first.');
          setLoading(false);
          return;
        }
        if (account.password !== password) {
          setError('Incorrect password. Please try again.');
          setLoading(false);
          return;
        }
        onLogin(account.name, email.toLowerCase(), false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 25% 60%, #0d1b4b 0%, #070a1f 55%, #0a0620 100%)' }}
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full" style={{ width: 700, height: 450, top: '-15%', left: '-20%', background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 65%)', filter: 'blur(80px)', animation: 'pulse 12s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ width: 550, height: 550, bottom: '-25%', right: '-15%', background: 'radial-gradient(circle, rgba(255,77,121,0.15) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'pulse 15s ease-in-out infinite 3s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-[420px] rounded-[28px] p-8"
        style={{
          background: 'rgba(8,12,36,0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1.5px solid rgba(34,211,238,0.14)',
          boxShadow: '0 0 50px rgba(34,211,238,0.07), 0 30px 70px -15px rgba(0,0,0,0.85)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-3">
            <div className="absolute -inset-3 rounded-full blur-xl opacity-50 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.5), rgba(255,77,121,0.3), transparent)', animationDuration: '3s' }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px]" style={{ background: 'linear-gradient(145deg, #1e3a8a, #0e7490)', boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}>
              <Sparkles className="h-8 w-8 text-white animate-pulse" style={{ animationDuration: '2.5s' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-2xl font-black tracking-tight text-white">Pocket<span style={{ color: '#ff4d79' }}>Zapp</span></span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest" style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee' }}>AI</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Your Money. Your Insights. Your Control.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200"
              style={mode === m ? { background: 'linear-gradient(135deg, #1e40af, #0e7490)', color: '#fff', boxShadow: '0 2px 12px rgba(34,211,238,0.2)' } : { color: '#64748b' }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (signup only) */}
          {mode === 'signup' && (
            <InputField icon={<User className="h-4 w-4" />} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          )}

          {/* Email */}
          <InputField icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />

          {/* Password */}
          <InputField
            icon={<Lock className="h-4 w-4" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            suffix={
              <button type="button" onClick={() => setShowPassword(s => !s)} style={{ color: '#64748b' }}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {/* Confirm password (signup only) */}
          {mode === 'signup' && (
            <InputField
              icon={<Lock className="h-4 w-4" />}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              suffix={
                <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ color: '#64748b' }}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl px-3 py-2.5 text-xs font-semibold text-center" style={{ background: 'rgba(255,77,121,0.1)', border: '1px solid rgba(255,77,121,0.25)', color: '#ff4d79' }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1e40af, #0e7490)', boxShadow: '0 4px 20px rgba(34,211,238,0.3)' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : (
              <>
                {mode === 'login' ? 'Sign In to PocketZapp' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-center gap-2 border-t pt-4 text-[11px] font-medium" style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#475569' }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#34d399' }} />
          <span>Secure demo environment • No real data stored</span>
        </div>
      </div>
    </div>
  );
};

// Reusable input field
const InputField: React.FC<{
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
}> = ({ icon, type, placeholder, value, onChange, suffix }) => (
  <div
    className="flex items-center gap-3 rounded-2xl px-4 py-3"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.09)' }}
  >
    <span style={{ color: '#64748b', flexShrink: 0 }}>{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
      autoComplete={type === 'password' ? 'current-password' : undefined}
    />
    {suffix}
  </div>
);

export default LoginScreen;
