import React, { useState } from 'react';
import { PlusCircle, Wallet, CreditCard, Building2, Smartphone, ArrowRight, ShieldCheck, X, Check } from 'lucide-react';
import { OtpModal } from './OtpModal';
import { Transaction } from '../../types';

interface AddMoneyModalProps {
  isOpen: boolean;
  currency: string;
  onSuccess: (transaction: Transaction) => void;
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  currency,
  onSuccess,
  onClose,
}) => {
  const [amount, setAmount] = useState<string>('2000');
  const [selectedMethod, setSelectedMethod] = useState<string>('FastPay UPI');
  const [description, setDescription] = useState<string>('PocketZapp Wallet Demo Top-up');
  const [step, setStep] = useState<'form' | 'review' | 'otp'>('form');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const paymentMethods = [
    { id: 'FastPay UPI', name: 'FastPay UPI / QR', desc: 'Instant 0% fee', icon: Smartphone },
    { id: 'Debit Card', name: 'Visa / Mastercard Debit', desc: 'Instant credit', icon: CreditCard },
    { id: 'Net Banking', name: 'Demo Net Banking', desc: 'Verified bank portal', icon: Building2 },
  ];

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (num > 500000) {
      setError('Simulated transaction limit is ₹5,00,000 per demo operation.');
      return;
    }
    setError('');
    setStep('review');
  };

  const handleStartOtp = () => {
    setStep('otp');
  };

  const handleOtpSuccess = () => {
    const num = parseFloat(amount);
    const newTx: Transaction = {
      id: `TXN-ADD-${Date.now().toString().slice(-6)}`,
      type: 'add_money',
      amount: num,
      description: description || 'Wallet Demo Top-up',
      category: 'Deposit',
      recipientOrMerchant: 'Self (PocketZapp Wallet)',
      paymentMethod: selectedMethod,
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-ADD-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Simulated top-up through ${selectedMethod}`,
    };

    onSuccess(newTx);
    onClose();
    // Reset state
    setStep('form');
    setAmount('100');
  };

  return (
    <>
      {step === 'otp' && (
        <OtpModal
          isOpen={true}
          title="Verify Add Money Authorization"
          subtitle={`Authorize top-up of ${currency}${parseFloat(amount).toFixed(2)} via ${selectedMethod}`}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 shadow-sm">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {step === 'form' ? 'Add Money to Wallet' : 'Review & Confirm Top-up'}
                </h2>
                <p className="text-xs text-slate-500">
                  {step === 'form' ? 'Simulated instant digital wallet fund addition' : 'Please check the details before 2FA'}
                </p>
              </div>
            </div>

            {step === 'form' && (
              <form onSubmit={handleProceedToReview} className="mt-5 space-y-4">
                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Enter Amount</label>
                  <div className="relative mt-1.5 flex items-center">
                    <span className="absolute left-4 text-xl font-bold text-slate-400">{currency}</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-2xl font-bold text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  {/* Quick amount chips */}
                  <div className="mt-2.5 flex items-center gap-2">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(q.toString())}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          amount === q.toString()
                            ? 'border-rose-500 bg-rose-50 text-rose-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        +{currency}{q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Payment Methods */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Select Simulated Channel</label>
                  <div className="mt-2 space-y-2">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      const isSelected = selectedMethod === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMethod(m.id)}
                          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition-all ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50/50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{m.name}</p>
                              <p className="text-[11px] text-slate-500">{m.desc}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Note / Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Monthly allowance or demo top-up"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:opacity-95 active:scale-[0.98]"
                >
                  <span>Review Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 'review' && (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs divide-y divide-slate-200/80">
                  <div className="flex justify-between pb-2.5">
                    <span className="text-slate-500">Top-up Amount</span>
                    <span className="font-extrabold text-base text-rose-600">
                      {currency}{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Destination</span>
                    <span className="font-semibold text-slate-800">PocketZapp Digital Wallet</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Funding Method</span>
                    <span className="font-semibold text-slate-800">{selectedMethod}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Transaction Fee</span>
                    <span className="font-semibold text-emerald-600">FREE ($0.00)</span>
                  </div>
                  <div className="flex justify-between pt-2.5">
                    <span className="text-slate-500">Note</span>
                    <span className="font-medium text-slate-700">{description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Next step requires simulated 6-digit OTP verification for secure authorization.</span>
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
                    onClick={handleStartOtp}
                    className="flex-2 rounded-xl bg-rose-500 py-3 text-xs font-semibold text-white shadow-md shadow-rose-500/30 hover:bg-rose-600 transition-all"
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
