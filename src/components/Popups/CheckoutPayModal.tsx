import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ShieldCheck, X, Store, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { OtpModal } from './OtpModal';
import { Transaction, ExpenseCategory } from '../../types';

interface CheckoutPayModalProps {
  isOpen: boolean;
  walletBalance: number;
  currency: string;
  onSuccess: (transaction: Transaction) => void;
  onClose: () => void;
}

export const CheckoutPayModal: React.FC<CheckoutPayModalProps> = ({
  isOpen,
  walletBalance,
  currency,
  onSuccess,
  onClose,
}) => {
  const [merchant, setMerchant] = useState<string>('Campus Tech Store');
  const [category, setCategory] = useState<ExpenseCategory>('Education');
  const [amount, setAmount] = useState<string>('2450.00');
  const [orderDescription, setOrderDescription] = useState<string>('Arduino Uno & Sensor Kit');
  const [paymentMethod, setPaymentMethod] = useState<string>('PocketZapp 1-Click Pay');
  const [step, setStep] = useState<'form' | 'review' | 'otp'>('form');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const popularMerchants = [
    { name: 'Campus Tech Store', cat: 'Education' as ExpenseCategory, desc: 'Arduino Uno & Sensor Kit', defaultAmt: '2450.00' },
    { name: 'Amazon Prime', cat: 'Shopping' as ExpenseCategory, desc: 'Wireless Mechanical Keyboard', defaultAmt: '3299.00' },
    { name: 'Starbucks Cafe', cat: 'Food' as ExpenseCategory, desc: 'Iced Latte & Cinnamon Roll', defaultAmt: '480.00' },
    { name: 'Uber Mobility', cat: 'Travel' as ExpenseCategory, desc: 'Campus to Central Station', defaultAmt: '520.00' },
    { name: 'Spotify Music', cat: 'Entertainment' as ExpenseCategory, desc: 'Student Premium Subscription', defaultAmt: '119.00' },
  ];

  const handleSelectMerchant = (item: typeof popularMerchants[0]) => {
    setMerchant(item.name);
    setCategory(item.cat);
    setOrderDescription(item.desc);
    setAmount(item.defaultAmt);
    setError('');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid checkout amount.');
      return;
    }
    if (num > walletBalance) {
      setError(`Insufficient balance in PocketZapp wallet (${currency}${walletBalance.toFixed(2)} available).`);
      return;
    }
    setError('');
    setStep('review');
  };

  const handleOtpSuccess = () => {
    const num = parseFloat(amount);
    const newTx: Transaction = {
      id: `TXN-PAY-${Date.now().toString().slice(-6)}`,
      type: 'payment',
      amount: num,
      description: orderDescription || `Payment to ${merchant}`,
      category: category,
      recipientOrMerchant: merchant,
      paymentMethod: paymentMethod,
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Demo checkout payment at ${merchant}`,
    };

    onSuccess(newTx);
    onClose();
    setStep('form');
  };

  return (
    <>
      {step === 'otp' && (
        <OtpModal
          isOpen={true}
          title="Authenticate Checkout Payment"
          subtitle={`Approve payment of ${currency}${parseFloat(amount).toFixed(2)} to ${merchant}`}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {step === 'form' ? 'Checkout / Pay' : 'Confirm Order Payment'}
                </h2>
                <p className="text-xs text-slate-500">
                  Wallet Balance: <strong className="text-emerald-700">{currency}{walletBalance.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            {step === 'form' && (
              <form onSubmit={handleProceedToReview} className="mt-5 space-y-4">
                {/* Popular Demo Merchants */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Quick Select Merchant</label>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {popularMerchants.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleSelectMerchant(item)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                          merchant === item.name
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Merchant Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Merchant Name</label>
                    <input
                      type="text"
                      required
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      placeholder="e.g. Campus Store"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Education">Education</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Health">Health</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Pay Amount</label>
                  <div className="relative mt-1 flex items-center">
                    <span className="absolute left-4 text-xl font-bold text-slate-400">{currency}</span>
                    <input
                      type="number"
                      min="0.5"
                      step="any"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-2xl font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Item description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Item / Order Description</label>
                  <input
                    type="text"
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    placeholder="e.g. CS Lab supplies or Book"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Payment Channel */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="PocketZapp 1-Click Pay">PocketZapp 1-Click Pay (Wallet)</option>
                    <option value="PocketZapp Virtual Visa">PocketZapp Virtual Visa Card</option>
                    <option value="QR Code Scan">Direct Merchant QR Code</option>
                  </select>
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs font-medium text-rose-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:opacity-95 active:scale-[0.98]"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 'review' && (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs divide-y divide-slate-200/80">
                  <div className="flex justify-between pb-2.5">
                    <span className="text-slate-500">Order Amount</span>
                    <span className="font-extrabold text-base text-emerald-700">
                      {currency}{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Merchant</span>
                    <span className="font-semibold text-slate-800">{merchant}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Item Details</span>
                    <span className="font-medium text-slate-700">{orderDescription}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Category</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 font-medium text-slate-800">
                      {category}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Payment Channel</span>
                    <span className="font-semibold text-slate-800">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-2.5">
                    <span className="text-slate-500">Wallet After Payment</span>
                    <span className="font-semibold text-slate-800">
                      {currency}{(walletBalance - parseFloat(amount)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Simulated DEMO payment. No real credit card or bank will be charged.</span>
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
                    className="flex-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                  >
                    Authorize with OTP
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
