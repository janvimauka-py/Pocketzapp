import React, { useState, useRef } from 'react';
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
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Upload,
  Camera,
  CreditCard,
  Building2,
  Eye,
  EyeOff,
  Wifi,
  Cpu,
  ArrowRight
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
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'security' | 'supabase' | 'ai' | 'help'>('profile');

  // Profile form
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [collegeId, setCollegeId] = useState<string>(user.collegeId);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Bank & Card Details
  const [bankName, setBankName] = useState<string>(user.bankName || 'HDFC Bank (Student Premium)');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>(user.bankAccountNumber || '•••• •••• 9841');
  const [bankBalance, setBankBalance] = useState<number>(user.bankBalance ?? 142500);
  const [bankIfsc, setBankIfsc] = useState<string>(user.bankIfsc || 'HDFC0001248');

  const [creditCardHolder, setCreditCardHolder] = useState<string>(user.creditCardHolder || user.name.toUpperCase());
  const [creditCardNumber, setCreditCardNumber] = useState<string>(user.creditCardNumber || '4532 •••• •••• 5128');
  const [creditCardExpiry, setCreditCardExpiry] = useState<string>(user.creditCardExpiry || '08/29');
  const [creditCardCvv, setCreditCardCvv] = useState<string>(user.creditCardCvv || '842');
  const [creditCardLimit, setCreditCardLimit] = useState<number>(user.creditCardLimit ?? 200000);
  const [creditCardAvailable, setCreditCardAvailable] = useState<number>(user.creditCardAvailable ?? 165000);
  const [showCardDetails, setShowCardDetails] = useState<boolean>(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          onUpdateUser({
            ...user,
            avatar: reader.result,
          });
          setGeneralSuccess('Profile picture uploaded successfully!');
          setTimeout(() => setGeneralSuccess(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    setGeneralSuccess('Profile information updated successfully!');
    setTimeout(() => setGeneralSuccess(''), 3000);
  };

  const handleSaveBankAndCards = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      bankName,
      bankAccountNumber,
      bankBalance,
      bankIfsc,
      creditCardHolder,
      creditCardNumber,
      creditCardExpiry,
      creditCardCvv,
      creditCardLimit,
      creditCardAvailable,
    });
    setGeneralSuccess('Bank and credit card details saved successfully!');
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
      <div className="relative flex h-[88vh] w-full max-w-2xl flex-col rounded-3xl border border-white/60 bg-white shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-400">Settings & Financial Identity • {user.collegeId}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex border-b border-slate-100 px-5 bg-slate-50/50 gap-2 overflow-x-auto py-2">
          {[
            { id: 'profile', label: 'Profile Info', icon: User },
            { id: 'bank', label: 'Bank & Credit Cards', icon: CreditCard },
            { id: 'security', label: 'PIN & Security', icon: Shield },
            { id: 'supabase', label: 'Supabase DB', icon: Database },
            { id: 'ai', label: 'AI Engine', icon: Sparkles },
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

          {/* TAB 1: PROFILE INFO & PICTURE UPLOAD */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Picture Upload & Preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={avatar}
                      alt="avatar preview"
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Profile Picture</h4>
                      <p className="text-[11px] text-slate-400">Upload your own photo or pick an avatar</p>
                      
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Picture</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Or Choose Preset
                    </label>
                    <div className="flex gap-2">
                      {sampleAvatars.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`preset ${i}`}
                          onClick={() => setAvatar(url)}
                          className={`h-9 w-9 rounded-full object-cover cursor-pointer transition-all ${
                            avatar === url ? 'ring-2 ring-blue-600 scale-105' : 'opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name & Gmail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-600" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Janvi Mauka"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-rose-500" />
                    <span>Gmail / Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="janvi.mauka@gmail.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-indigo-600" />
                    <span>College / Student ID</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="CS-2024-8841"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
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

          {/* TAB 2: BANK BALANCE & CREDIT CARD DETAILS */}
          {activeTab === 'bank' && (
            <form onSubmit={handleSaveBankAndCards} className="space-y-6">
              
              {/* Linked Bank Account Card */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Primary Linked Bank Account</h4>
                      <p className="text-[10px] text-slate-500">Auto-cleared UPI & NetBanking Source</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active & Linked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Account Number</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="•••• •••• 9841"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Bank Available Balance (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={bankBalance}
                      onChange={(e) => setBankBalance(parseFloat(e.target.value) || 0)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-extrabold text-blue-700 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">IFSC Code</label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      placeholder="HDFC0001248"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3D Digital Credit Card Display */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span>Credit Card Details</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    {showCardDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showCardDetails ? 'Hide Sensitive Info' : 'Reveal Numbers'}</span>
                  </button>
                </div>

                {/* Credit Card Visual */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-5 text-white shadow-xl">
                  {/* Decorative ambient elements */}
                  <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-200">PocketZapp Platinum Card</span>
                    <Wifi className="h-4 w-4 text-cyan-300 rotate-90" />
                  </div>

                  <div className="my-4 flex items-center gap-3">
                    <div className="flex h-7 w-9 items-center justify-center rounded-md bg-amber-400/90 border border-amber-300 shadow-xs">
                      <Cpu className="h-4 w-4 text-amber-950" />
                    </div>
                    <span className="font-mono text-base sm:text-lg tracking-[0.2em] font-extrabold text-white">
                      {showCardDetails ? creditCardNumber.replace(/•/g, '4') : creditCardNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                      <p className="font-bold tracking-wider">{creditCardHolder}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Expires / CVV</span>
                      <p className="font-mono font-bold tracking-wider">
                        {creditCardExpiry} • {showCardDetails ? creditCardCvv : '•••'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Credit Card Edit Inputs */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      value={creditCardHolder}
                      onChange={(e) => setCreditCardHolder(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={creditCardNumber}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono font-bold text-slate-800 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={creditCardExpiry}
                      onChange={(e) => setCreditCardExpiry(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono font-bold text-slate-800 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">CVV</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={creditCardCvv}
                      onChange={(e) => setCreditCardCvv(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono font-bold text-slate-800 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Limit details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Total Credit Limit</span>
                    <p className="text-sm font-extrabold text-slate-800">₹{creditCardLimit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Available Credit</span>
                    <p className="text-sm font-extrabold text-emerald-600">₹{creditCardAvailable.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Save Bank & Card Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PIN & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Master App PIN & OTP Security</h3>
                    <p className="text-xs text-slate-500">Universal authentication credential</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Fixed Master PIN:</span>
                    <span className="font-mono text-base font-black tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      1507
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">All Transaction OTPs:</span>
                    <span className="font-mono text-base font-black tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      1507
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">PIN Reset Option:</span>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      Permanently Disabled
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                  <p className="font-semibold">🔒 Security Policy Enforced:</p>
                  <p className="mt-0.5 text-amber-800 text-[11px]">
                    To maintain strict account consistency, the unlock PIN and all verification OTPs are permanently locked to <strong>1507</strong>. Reset or modification options have been turned off.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Session Security</h4>
                <p className="text-xs text-slate-500 mb-3">Lock your app immediately to engage the full-screen PIN security overlay (PIN: 1507).</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-xs"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock App Now</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE DB */}
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
                <label className="text-xs font-semibold text-slate-700">Anon / Public API Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {dbStatus.message && (
                <div
                  className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                    dbStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {dbStatus.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{dbStatus.message}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={testingDb}
                  onClick={handleTestSupabase}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {testingDb ? 'Testing Connection...' : 'Test & Save Supabase'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSchema}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download SQL Schema</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AI CONFIGURATION */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveAIKey} className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-4">
                <h4 className="font-bold text-purple-900 text-xs">Google Gemini AI Engine</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  PocketZapp AI includes a built-in Contextual Financial Intelligence Engine that analyzes your live numbers even without an external API. To enable real-time Gemini LLM generative advice, enter your Gemini API key.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>

              {aiSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>Gemini API Key updated successfully!</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 transition-all"
                >
                  Save AI Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: HELP & DEMO GUIDANCE */}
          {activeTab === 'help' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <h4 className="font-bold text-slate-900 text-sm">Frequently Asked Questions</h4>
                <div className="mt-3 space-y-3 divide-y divide-slate-100">
                  <div className="pt-2">
                    <p className="font-bold text-slate-800">Is this real banking money?</p>
                    <p className="text-slate-500 mt-0.5">
                      No. PocketZapp AI is built as a college demonstration sandbox. All currency values, top-ups, transfers, and budgets are simulated in INR (₹).
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-slate-800">How do I verify transfers & balance?</p>
                    <p className="text-slate-500 mt-0.5">
                      All transaction authorizations require your 4-digit Master Security PIN for verified zero-trust simulation.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-slate-800">Where is data persisted?</p>
                    <p className="text-slate-500 mt-0.5">
                      All records are saved locally in your browser's persistent LocalStorage, with optional cloud sync to Supabase PostgreSQL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-900">Reset Demo Data</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Clear custom transactions and restore all original seed INR records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetDemo();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 text-xs font-bold transition-all shadow-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
