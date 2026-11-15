import React, { useState, useEffect } from 'react';
import { Send, Users, ShieldCheck, X, AlertCircle, ArrowRight, UserCheck, Check } from 'lucide-react';
import { OtpModal } from './OtpModal';
import { Transaction, RecentContact } from '../../types';

interface TransferMoneyModalProps {
  isOpen: boolean;
  walletBalance: number;
  currency: string;
  contacts: RecentContact[];
  initialContact?: RecentContact | null;
  onSuccess: (transaction: Transaction) => void;
  onClose: () => void;
}

export const TransferMoneyModal: React.FC<TransferMoneyModalProps> = ({
  isOpen,
  walletBalance,
  currency,
  contacts,
  initialContact,
  onSuccess,
  onClose,
}) => {
  const [recipientName, setRecipientName] = useState<string>('Udit');
  const [recipientId, setRecipientId] = useState<string>('udit@okhdfcbank');
  const [amount, setAmount] = useState<string>('1500');
  const [note, setNote] = useState<string>('Split dinner & rides');
  const [step, setStep] = useState<'form' | 'review' | 'otp'>('form');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialContact) {
      setRecipientName(initialContact.name);
      setRecipientId(initialContact.identifier);
    } else if (contacts.length > 0 && (!recipientName || recipientName === 'Sarah Connor')) {
      setRecipientName(contacts[0].name);
      setRecipientId(contacts[0].identifier);
    }
  }, [initialContact, contacts, isOpen]);

  if (!isOpen) return null;

  const handleSelectContact = (contact: RecentContact) => {
    setRecipientName(contact.name);
    setRecipientId(contact.identifier);
    setError('');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (num > walletBalance) {
      setError(`Insufficient balance. Your available balance is ${currency}${walletBalance.toFixed(2)}.`);
      return;
    }
    if (!recipientName.trim() || !recipientId.trim()) {
      setError('Please select or enter a recipient name and ID.');
      return;
    }
    setError('');
    setStep('review');
  };

  const handleOtpSuccess = () => {
    const num = parseFloat(amount);
    const newTx: Transaction = {
      id: `TXN-TRF-${Date.now().toString().slice(-6)}`,
      type: 'transfer',
      amount: num,
      description: note || `Transfer to ${recipientName}`,
      category: 'Transfer',
      recipientOrMerchant: recipientName,
      paymentMethod: 'PocketZapp Peer Transfer',
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Sent to ${recipientId} (${note})`,
    };

    onSuccess(newTx);
    onClose();
    setStep('form');
    setAmount('1500');
  };

  return (
    <>
      {step === 'otp' && (
        <OtpModal
          isOpen={true}
          title="Authorize Peer-to-Peer Transfer"
          subtitle={`Sending ${currency}${parseFloat(amount).toFixed(2)} to ${recipientName}`}
          onSuccess={handleOtpSuccess}
          onCancel={() => setStep('review')}
        />
      )}

      {step !== 'otp' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-8">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {step === 'form' ? 'Transfer Money' : 'Verify Recipient & Amount'}
                </h2>
                <p className="text-xs text-slate-500">
                  Available Balance: <strong className="text-blue-700">{currency}{walletBalance.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            {step === 'form' && (
              <form onSubmit={handleProceedToReview} className="mt-5 space-y-4">
                {/* Transfer Money to Contact (No DP - Just Names: Udit, Anvay, Aarvi, Jerry) */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Transfer Money to Contact
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      Tap name to auto-fill
                    </span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {contacts.map((c) => {
                      const isSelected = recipientName === c.name || recipientId === c.identifier;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectContact(c)}
                          className={`flex flex-col items-center justify-center rounded-2xl border py-2.5 px-3 text-center transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50'
                          }`}
                        >
                          <span className="text-xs font-black tracking-wide">{c.name}</span>
                          <span className={`text-[10px] mt-0.5 truncate max-w-full font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {c.identifier.split('@')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient inputs */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Udit"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">UPI ID / Phone / Email</label>
                    <input
                      type="text"
                      required
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      placeholder="e.g. udit@okhdfcbank"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Transfer Amount</label>
                  <div className="relative mt-1 flex items-center">
                    <span className="absolute left-4 text-xl font-bold text-slate-400">{currency}</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-2xl font-bold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Transfer Note</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Split lunch or project fees"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs font-medium text-rose-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:opacity-95 active:scale-[0.98]"
                >
                  <span>Review Transfer Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 'review' && (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs divide-y divide-slate-200/80">
                  <div className="flex justify-between pb-2.5">
                    <span className="text-slate-500">Amount to Transfer</span>
                    <span className="font-extrabold text-base text-indigo-700">
                      {currency}{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Recipient Name</span>
                    <span className="font-semibold text-slate-800">{recipientName}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Recipient Identifier</span>
                    <span className="font-mono text-slate-700">{recipientId}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Source</span>
                    <span className="font-semibold text-slate-800">PocketZapp Demo Wallet</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Balance Remaining After</span>
                    <span className="font-semibold text-slate-800">
                      {currency}{(walletBalance - parseFloat(amount)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2.5">
                    <span className="text-slate-500">Note</span>
                    <span className="font-medium text-slate-700">{note}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Verify that the recipient details match your intended party before OTP authorization.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('otp')}
                    className="flex-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
                  >
                    Proceed to OTP Verification
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
