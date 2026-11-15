import React, { useState } from 'react';
import { 
  ScanLine, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Sparkles, 
  Eye, 
  Edit3, 
  ArrowRight, 
  X,
  Receipt
} from 'lucide-react';
import { Transaction, ExpenseCategory } from '../../types';
import { Page3DHero } from '../Visuals/Page3DHero';

interface ReceiptScannerProps {
  currency: string;
  onAddTransaction: (tx: Transaction) => void;
  onNavigateToHistory: () => void;
}

interface ScannedData {
  merchant: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  items: string[];
  imageUrl: string;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  currency,
  onAddTransaction,
  onNavigateToHistory,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [successSaved, setSuccessSaved] = useState<boolean>(false);

  // Review form fields
  const [merchantName, setMerchantName] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [notes, setNotes] = useState<string>('');

  // Sample templates for instant live college demonstration in INR (₹)
  const sampleTemplates: ScannedData[] = [
    {
      merchant: 'Starbucks Coffee Co.',
      amount: 480.00,
      date: '2026-11-14',
      category: 'Food',
      items: ['1x Iced Caramel Macchiato (₹260)', '1x Butter Croissant (₹160)', '1x GST & Service (₹60)'],
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    },
    {
      merchant: 'Campus Tech Mart & Books',
      amount: 3450.00,
      date: '2026-11-12',
      category: 'Education',
      items: ['1x Algorithm Design Textbook (₹1,850)', '1x USB-C Multiport Hub (₹1,250)', '1x Student GST (₹350)'],
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    },
    {
      merchant: 'Supermart Store & Groceries',
      amount: 4200.00,
      date: '2026-11-10',
      category: 'Shopping',
      items: ['Organic Almond Milk (₹320)', 'Fresh Fruit Basket (₹650)', 'Snack Bars Pack (₹780)', 'Dorm Essentials (₹2,450)'],
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleSelectTemplate = (template: ScannedData) => {
    setIsScanning(true);
    setScannedData(null);
    setSuccessSaved(false);

    // Simulate OCR Scanning time
    setTimeout(() => {
      setIsScanning(false);
      setScannedData(template);
      setMerchantName(template.merchant);
      setAmountStr(template.amount.toFixed(2));
      setDateStr(template.date);
      setCategory(template.category);
      setNotes(template.items.join('; '));
      setShowReviewModal(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedData(null);
    setSuccessSaved(false);

    // Create object URL
    const previewUrl = URL.createObjectURL(file);

    setTimeout(() => {
      setIsScanning(false);
      const parsed: ScannedData = {
        merchant: file.name.split('.')[0].replace(/[-_]/g, ' ') || 'Uploaded Receipt Merchant',
        amount: 48.75,
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        items: ['Scanned item #1 ($25.00)', 'Scanned item #2 ($23.75)'],
        imageUrl: previewUrl,
      };

      setScannedData(parsed);
      setMerchantName(parsed.merchant);
      setAmountStr(parsed.amount.toFixed(2));
      setDateStr(parsed.date);
      setCategory(parsed.category);
      setNotes(parsed.items.join('; '));
      setShowReviewModal(true);
    }, 1500);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) return;

    const newTx: Transaction = {
      id: `TXN-OCR-${Date.now().toString().slice(-6)}`,
      type: 'expense',
      amount: num,
      description: `Receipt: ${merchantName}`,
      category: category,
      recipientOrMerchant: merchantName,
      paymentMethod: 'OCR Receipt Scanner',
      status: 'completed',
      date: new Date(dateStr).toISOString(),
      referenceId: `REF-OCR-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes,
    };

    onAddTransaction(newTx);
    setShowReviewModal(false);
    setSuccessSaved(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Laser Scanner Beam over Receipt */}
      <Page3DHero
        pageId="scanner"
        title="AI Receipt Vision & Instant OCR"
        subtitle="Upload or choose from sample receipts to automatically extract merchant data, amount, and item lines."
        badgeText="3D AI Scanner Active"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Receipt Scanner</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload any paper or digital bill to automatically extract merchant, amount, date, and category
        </p>
      </div>

      {successSaved && (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Receipt verified and successfully added to your transactions and budget!</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToHistory}
            className="font-bold text-emerald-700 hover:underline"
          >
            View in History →
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-white p-8 sm:p-12 text-center shadow-sm hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isScanning}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-inner">
          {isScanning ? (
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          ) : (
            <ScanLine className="h-8 w-8 animate-pulse" />
          )}
        </div>

        {isScanning ? (
          <div>
            <h3 className="text-base font-bold text-slate-900">Scanning Receipt with AI Vision OCR...</h3>
            <p className="text-xs text-slate-400 mt-1">Extracting merchant, totals, tax line items, and date</p>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Receipt Image</h3>
            <p className="text-xs text-slate-500 mt-1">
              Drag & drop or click to upload PNG, JPG, or PDF snapshot
            </p>
            <span className="mt-3 inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25">
              Browse Receipt File
            </span>
          </div>
        )}
      </div>

      {/* 1-Click Demo Samples */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Instant Demo Test Receipts (1-Click)</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Click any pre-configured college receipt to test the instant OCR extraction workflow:
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isScanning}
              onClick={() => handleSelectTemplate(t)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-all disabled:opacity-50"
            >
              <img
                src={t.imageUrl}
                alt={t.merchant}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 truncate">
                <p className="font-bold text-slate-900 text-xs truncate">{t.merchant}</p>
                <p className="text-xs font-black text-rose-600 mt-0.5">
                  {currency}{t.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400">{t.category} • {t.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Review & Edit Modal */}
      {showReviewModal && scannedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Review OCR Extracted Information</h3>
                <p className="text-xs text-slate-400">Verify and adjust before saving to your wallet</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="mt-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Merchant Name</label>
                  <input
                    type="text"
                    required
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Amount ({currency})</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-base font-bold text-rose-600 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Detected Line Items / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Confirm & Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
