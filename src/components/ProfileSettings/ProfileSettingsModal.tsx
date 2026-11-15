import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Database, 
  Sparkles, 
  HelpCircle, 
  LogOut, 
  X, 
  Check, 
  AlertCircle, 
  Download, 
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../../types';
import { testSupabaseConnection, SUPABASE_SQL_SCHEMA } from '../../services/supabase';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onResetDemo: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'supabase' | 'ai' | 'help'>('profile');

  // Profile form
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [collegeId, setCollegeId] = useState<string>(user.collegeId);
  const [avatar, setAvatar] = useState<string>(user.avatar);

  // Security (Change PIN)
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');

  // Supabase
  const [supabaseUrl, setSupabaseUrl] = useState<string>(user.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState<string>(user.supabaseAnonKey || '');
  const [testingDb, setTestingDb] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<{ success?: boolean; message?: string }>({});

  // AI
  const [geminiKey, setGeminiKey] = useState<string>(user.geminiApiKey || '');
  const [aiSuccess, setAiSuccess] = useState<boolean>(false);

  const [generalSuccess, setGeneralSuccess] = useState<string>('');

  if (!isOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      phone,
      collegeId,
      avatar,
    });
    setGeneralSuccess('Profile updated successfully!');
    setTimeout(() => setGeneralSuccess(''), 3000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (oldPin !== user.pin) {
      setPinError('Current PIN is incorrect.');
      return;
    }
    if (newPin.length !== 4) {
      setPinError('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinError('New PINs do not match.');
      return;
    }

    onUpdateUser({
      ...user,
      pin: newPin,
    });
    setPinSuccess('PIN successfully changed!');
    setOldPin('');
    setNewPin('');
    setConfirmNewPin('');
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setDbStatus({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }
    setTestingDb(true);
    setDbStatus({});
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTestingDb(false);
    setDbStatus(res);
    if (res.success) {
      onUpdateUser({
        ...user,
        supabaseUrl,
        supabaseAnonKey: supabaseKey,
      });
    }
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pocketzapp_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAIKey = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      geminiApiKey: geminiKey,
    });
    setAiSuccess(true);
    setTimeout(() => setAiSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-white/60 bg-white shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-400">Settings & Preferences • {user.collegeId}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex border-b border-slate-100 px-5 bg-slate-50/50 gap-2 overflow-x-auto py-2">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'PIN & Security', icon: Shield },
            { id: 'supabase', label: 'Supabase DB', icon: Database },
            { id: 'ai', label: 'AI Configuration', icon: Sparkles },
            { id: 'help', label: 'Help & FAQs', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {generalSuccess && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{generalSuccess}</span>
            </div>
          )}

          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Choose Avatar</label>
                <div className="mt-2 flex gap-3">
                  {sampleAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="avatar"
                      onClick={() => setAvatar(url)}
                      className={`h-12 w-12 rounded-full object-cover cursor-pointer transition-all ${
                        avatar === url ? 'ring-3 ring-blue-600 scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">College / Student ID</label>
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security (Change PIN) */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePin} className="space-y-4 max-w-sm">
              <h3 className="font-bold text-slate-900 text-sm">Change App Security PIN</h3>
              <p className="text-xs text-slate-400">Update your 4-digit master PIN used on the lock screen.</p>

              <div>
                <label className="text-xs font-semibold text-slate-700">Current PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold tracking-widest text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold tracking-widest text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold tracking-widest text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {pinError && <p className="text-xs font-semibold text-rose-500">{pinError}</p>}
              {pinSuccess && <p className="text-xs font-semibold text-emerald-600">{pinSuccess}</p>}

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
              >
                Update PIN
              </button>
            </form>
          )}

          {/* Tab 3: Supabase Sync */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4">
                <h4 className="font-bold text-blue-900 text-xs">Supabase Database Integration</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  PocketZapp AI features built-in atomic local persistence out-of-the-box. To sync your data to your Supabase PostgreSQL cloud backend with Row Level Security, provide your project credentials below.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {dbStatus.message && (
                <div
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    dbStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {dbStatus.message}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={testingDb}
                  onClick={handleTestSupabase}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50"
                >
                  {testingDb ? 'Testing Connection...' : 'Test & Connect'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSchema}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SQL Schema</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: AI Configuration */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveAIKey} className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4">
                <h4 className="font-bold text-blue-900 text-xs">Google Gemini LLM Integration</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  PocketZapp AI assistant currently runs with high accuracy using its built-in smart financial analysis engine. For conversational generative chat powered by Google Gemini, enter your Gemini API key below.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Google Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {aiSuccess && (
                <p className="text-xs font-semibold text-emerald-600">Gemini API Key saved!</p>
              )}

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
              >
                Save AI Settings
              </button>
            </form>
          )}

          {/* Tab 5: Help & College Presentation FAQs */}
          {activeTab === 'help' && (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm">College Project Demonstration Guide</h4>
                <p className="mt-1 text-slate-500">
                  PocketZapp AI is designed for seamless, impressive live evaluation:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Security PIN:</strong> Secure Master PIN protection is active to guard wallet access.</li>
                  <li><strong>OTP Verification:</strong> Whenever performing a Check Balance, Add Money, Transfer, or Checkout, simulated OTP codes are instantly provided on-screen with an "Auto-Fill" button.</li>
                  <li><strong>Reset Demo Data:</strong> Use the "Reset Demo" button in the top navigation anytime to restore fresh sample balances and transactions.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200/80 p-4">
                <h4 className="font-bold text-slate-900">Is real money used?</h4>
                <p className="mt-0.5 text-slate-500">
                  No. All transactions, cards, and balances operate strictly in simulated DEMO MODE as specified in the project requirements.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 p-4">
                <h4 className="font-bold text-slate-900">How does the AI Assistant analyze data?</h4>
                <p className="mt-0.5 text-slate-500">
                  It inspects real-time state: calculating monthly outflows, inflow ratios, top spending categories, and goal velocities without fake responses.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions: Reset Demo Data & Logout */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-4 px-6">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo data back to default values?')) {
                onResetDemo();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock App / Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};
