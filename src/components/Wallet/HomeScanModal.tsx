import React, { useState } from 'react';
import { 
  ScanLine, 
  Camera, 
  QrCode, 
  Zap, 
  X, 
  Check, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Store,
  DollarSign
} from 'lucide-react';
import { OtpModal } from '../Popups/OtpModal';
import { Transaction, ExpenseCategory } from '../../types';

interface HomeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  walletBalance: number;
  expectedPin?: string;
  onSuccessTransaction: (tx: Transaction) => void;
}

export const HomeScanModal: React.FC<HomeScanModalProps> = ({
  isOpen,
  onClose,
  currency,
  walletBalance,
  expectedPin = '1507',
  onSuccessTransaction,
}) => {
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(true);
  const [detectedMerchant, setDetectedMerchant] = useState<{
    name: string;
    amount: number;
    category: ExpenseCategory;
    upiId: string;
  } | null>(null);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickQrSamples = [
    { name: 'Campus Book Store', amount: 1250, category: 'Education' as ExpenseCategory, upiId: 'books@univcampus' },
    { name: 'Student Cafe & Bistro', amount: 380, category: 'Food' as ExpenseCategory, upiId: 'cafebistro@okaxis' },
    { name: 'Robotics Lab Supply', amount: 2450, category: 'Education' as ExpenseCategory, upiId: 'robotics@okhdfc' },
    { name: 'Metro Transit Card', amount: 600, category: 'Travel' as ExpenseCategory, upiId: 'transit@fastupi' },
  ];

  const handleSimulateScan = (item: typeof quickQrSamples[0]) => {
    setScanning(false);
    setDetectedMerchant(item);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanning(false);
      // Simulate reading QR / receipt from image
      setDetectedMerchant({
        name: 'Supermart Store & Groceries',
        amount: 1850,
        category: 'Shopping',
        upiId: 'supermart@paytm',
      });
    }
  };

  const handleConfirmPay = () => {
    if (!detectedMerchant) return;
    if (detectedMerchant.amount > walletBalance) {
      alert(`Insufficient balance. Your wallet balance is ${currency}${walletBalance.toFixed(2)}`);
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (!detectedMerchant) return;

    const newTx: Transaction = {
      id: `TXN-SCN-${Date.now().toString().slice(-6)}`,
      type: 'payment',
      amount: detectedMerchant.amount,
      description: `QR Scan & Pay at ${detectedMerchant.name}`,
      category: detectedMerchant.category,
      recipientOrMerchant: detectedMerchant.name,
      paymentMethod: 'PocketZapp QR Camera Scan',
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-QR-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Scanned from QR code (${detectedMerchant.upiId})`,
    };

    setShowPinModal(false);
    onSuccessTransaction(newTx);
    onClose();
  };

  return (
    <>
      {showPinModal && detectedMerchant && (
        <OtpModal
          isOpen={true}
          title="Authorize QR Payment"
          subtitle={`Enter your 4-digit PIN to pay ${currency}${detectedMerchant.amount.toFixed(2)} to ${detectedMerchant.name}`}
          expectedPin={expectedPin}
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPinModal(false)}
        />
      )}

      {!showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0E1526] p-6 text-white shadow-2xl">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                <ScanLine className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Smart QR & Receipt Scanner</h3>
                <p className="text-xs text-slate-400">Point at any UPI QR code or bill</p>
              </div>
            </div>

            {/* Camera Viewfinder Screen */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/15 bg-black/90 aspect-[4/3] flex flex-col items-center justify-center">
              
              {/* Torch button */}
              <button
                type="button"
                onClick={() => setTorchOn(!torchOn)}
                className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                  torchOn ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-white/20 bg-white/10 text-white'
                }`}
                title="Toggle Flashlight"
              >
                <Zap className="h-4 w-4" />
              </button>

              {/* Viewfinder Target Crosshairs */}
              <div className="relative h-44 w-44 rounded-2xl border-2 border-dashed border-cyan-400/60 flex items-center justify-center">
                {/* 4 corner accents */}
                <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                {/* Laser scan line animation */}
                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-laser" />

                {/* Center QR indicator */}
                <QrCode className="h-16 w-16 text-cyan-400/40" />
              </div>

              {/* Status pill */}
              <div className="absolute bottom-3 flex items-center gap-2 rounded-full bg-slate-900/80 border border-white/10 px-3 py-1 text-[11px] text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Camera Viewfinder Active</span>
              </div>
            </div>

            {/* Detected QR Card or Quick Demo Barcodes */}
            {detectedMerchant ? (
              <div className="mt-4 rounded-2xl border border-cyan-400/40 bg-cyan-950/30 p-4 animate-scaleIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Store className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{detectedMerchant.name}</h4>
                      <p className="text-[11px] text-slate-400">{detectedMerchant.upiId}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-cyan-300">
                    {currency}{detectedMerchant.amount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDetectedMerchant(null);
                      setScanning(true);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Scan Again
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPay}
                    className="flex-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95"
                  >
                    <span>Proceed to Pay</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
                  <span>Tap to Simulate Quick Scan:</span>
                  <label className="cursor-pointer text-cyan-400 hover:underline flex items-center gap-1 text-[11px]">
                    <Upload className="h-3 w-3" />
                    <span>Upload QR Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {quickQrSamples.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSimulateScan(item)}
                      className="flex flex-col text-left rounded-xl border border-white/10 bg-white/[0.04] p-2.5 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all"
                    >
                      <span className="font-bold text-white truncate text-[11px]">{item.name}</span>
                      <span className="font-mono text-cyan-300 font-extrabold mt-0.5">{currency}{item.amount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
