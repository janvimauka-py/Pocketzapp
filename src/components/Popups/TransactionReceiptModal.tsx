import React from 'react';
import { CheckCircle2, Download, Printer, X, Shield, ArrowUpRight, ArrowDownLeft, Wallet, ExternalLink } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  currency: string;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  currency,
  onClose,
}) => {
  if (!transaction) return null;

  const isPositive = transaction.type === 'income' || transaction.type === 'add_money';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = `
=============================================
           POCKETZAPP AI DIGITAL WALLET
             TRANSACTION RECEIPT (DEMO)
=============================================
Receipt ID:     ${transaction.referenceId || transaction.id}
Transaction ID: ${transaction.id}
Date & Time:    ${new Date(transaction.date).toLocaleString()}
Type:           ${transaction.type.toUpperCase()}
Category:       ${transaction.category}
Amount:         ${currency}${transaction.amount.toFixed(2)}
Party:          ${transaction.recipientOrMerchant}
Payment Method: ${transaction.paymentMethod}
Status:         COMPLETED (SIMULATED)
Notes:          ${transaction.notes || 'N/A'}
=============================================
Tagline: Your Money. Your Insights. Your Control.
=============================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PocketZapp_Receipt_${transaction.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
        
        {/* Top Accent Ribbon */}
        <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                PZ
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-800">
                Pocket<span className="text-rose-500">Zapp</span> AI
              </span>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified Demo
            </span>
          </div>

          {/* Success Check Icon & Amount */}
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Transaction Successful
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              <span className={isPositive ? 'text-emerald-600' : 'text-slate-900'}>
                {isPositive ? '+' : '-'}{currency}{transaction.amount.toFixed(2)}
              </span>
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {transaction.description}
            </p>
          </div>

          {/* Receipt Breakdown Box */}
          <div className="mt-6 divide-y divide-dashed divide-slate-200 rounded-2xl bg-slate-50 p-4 text-xs">
            <div className="flex items-center justify-between pb-2.5">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">{transaction.id}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Reference No.</span>
              <span className="font-mono font-medium text-blue-700">{transaction.referenceId || 'REF-8849-001'}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Recipient / Merchant</span>
              <span className="font-semibold text-slate-800">{transaction.recipientOrMerchant}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Payment Channel</span>
              <span className="font-medium text-slate-700">{transaction.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-500">Category</span>
              <span className="rounded-md bg-blue-100/70 px-2 py-0.5 font-medium text-blue-800">
                {transaction.category}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500">Date & Timestamp</span>
              <span className="font-medium text-slate-700">
                {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="mt-5 flex flex-col items-center">
            <div className="flex h-9 w-48 items-center justify-center gap-1 opacity-70">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i % 3 === 0 ? 'w-1 bg-slate-900' : i % 2 === 0 ? 'w-0.5 bg-slate-600' : 'w-1.5 bg-slate-800'}`}
                />
              ))}
            </div>
            <span className="mt-1 font-mono text-[10px] tracking-widest text-slate-400">
              * DEMO-MODE-COLLEGE-PROJECT *
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Download className="h-4 w-4 text-slate-500" />
              Download Receipt
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
              title="Print Receipt"
            >
              <Printer className="h-4 w-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
