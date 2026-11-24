import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Transaction, TransactionType, ExpenseCategory } from '../../types';
import { TransactionReceiptModal } from '../Popups/TransactionReceiptModal';
import { Page3DHero } from '../Visuals/Page3DHero';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currency: string;
  onAddTransaction?: (tx: Transaction) => void;
  onDeleteTransaction?: (txId: string) => void;
}

// ─── Add Transaction Modal ────────────────────────────────────────────────────
const CATEGORIES: ExpenseCategory[] = [
  'Food', 'Shopping', 'Travel', 'Education', 'Entertainment', 'Health', 'Deposit', 'Transfer', 'Other',
];

interface AddModalProps {
  currency: string;
  onSave: (tx: Transaction) => void;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddModalProps> = ({ currency, onSave, onClose }) => {
  const [description, setDescription]       = useState('');
  const [amount, setAmount]                 = useState('');
  const [type, setType]                     = useState<TransactionType>('expense');
  const [category, setCategory]             = useState<ExpenseCategory>('Food');
  const [date, setDate]                     = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote]                     = useState('');
  const [merchant, setMerchant]             = useState('');
  const [error, setError]                   = useState('');

  const handleSave = () => {
    if (!description.trim()) { setError('Transaction name is required.'); return; }
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) { setError('Enter a valid amount greater than ₹0.'); return; }

    const tx: Transaction = {
      id: `TXN-MAN-${Date.now().toString().slice(-8)}`,
      type,
      amount: parsed,
      description: description.trim(),
      category,
      recipientOrMerchant: merchant.trim() || (type === 'income' ? 'Self / Employer' : 'Manual Entry'),
      paymentMethod: 'Manual Entry',
      status: 'completed',
      date: new Date(date).toISOString(),
      referenceId: `REF-MAN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: note.trim() || undefined,
    };
    onSave(tx);
  };

  const isIncome = type === 'income' || type === 'add_money';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Add Transaction</h2>
              <p className="text-xs text-blue-100">Manually log a new entry</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setCategory(t === 'income' ? 'Deposit' : 'Food');
                  }}
                  className={`rounded-2xl py-2.5 text-xs font-bold transition-all border ${
                    type === t
                      ? t === 'income'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                        : 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t === 'income' ? '↓ Income' : '↑ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Transaction Name *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="e.g. Grocery Shopping, Salary, Uber Ride…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount ({currency})*</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">{currency}</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder="0.00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-4 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {isIncome ? 'Source / Payer' : 'Merchant / Recipient'}
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder={isIncome ? 'e.g. Employer, Freelance Client…' : 'e.g. Amazon, Zomato…'}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional details…"
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-black text-white shadow-md shadow-blue-600/30 hover:opacity-90 transition-all"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
interface DeleteModalProps {
  tx: Transaction;
  currency: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmModal: React.FC<DeleteModalProps> = ({ tx, currency, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
    <div
      className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-200/80 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100">
          <Trash2 className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900">Delete Transaction?</h2>
          <p className="mt-1 text-xs text-slate-500">This action cannot be undone. The entry will be permanently removed and your balance will be recalculated.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left space-y-1">
          <p className="text-xs font-bold text-slate-800 truncate">{tx.description}</p>
          <p className="text-xs text-slate-500">{tx.category} · {new Date(tx.date).toLocaleDateString()}</p>
          <p className={`text-sm font-black ${tx.type === 'income' || tx.type === 'add_money' ? 'text-emerald-600' : 'text-rose-500'}`}>
            {tx.type === 'income' || tx.type === 'add_money' ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 pb-6">
        <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
          Keep It
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-xs font-black text-white shadow-md shadow-red-500/30 hover:opacity-90 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currency,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery]         = useState<string>('');
  const [selectedTx, setSelectedTx]           = useState<Transaction | null>(null);
  const [showAddModal, setShowAddModal]        = useState(false);
  const [txToDelete, setTxToDelete]           = useState<Transaction | null>(null);
  const [deletedId, setDeletedId]             = useState<string | null>(null); // flash animation

  const filterTabs = [
    { id: 'all',       label: 'All' },
    { id: 'add_money', label: 'Added' },
    { id: 'transfer',  label: 'Transfers' },
    { id: 'payment',   label: 'Payments' },
    { id: 'expense',   label: 'Expenses' },
    { id: 'income',    label: 'Income' },
  ];

  const filtered = transactions.filter((tx) => {
    const matchesTab    = activeFilterTab === 'all' || tx.type === activeFilterTab;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipientOrMerchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceId && tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Amount', 'Description', 'Category', 'Party', 'Payment Method', 'Date', 'Status', 'Reference'];
    const rows = filtered.map((t) => [
      t.id, t.type, t.amount,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      `"${t.recipientOrMerchant.replace(/"/g, '""')}"`,
      `"${t.paymentMethod}"`,
      new Date(t.date).toISOString(),
      t.status,
      t.referenceId || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PocketZapp_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSave = (tx: Transaction) => {
    onAddTransaction?.(tx);
    setShowAddModal(false);
  };

  const handleDeleteConfirm = () => {
    if (!txToDelete) return;
    setDeletedId(txToDelete.id);
    setTimeout(() => setDeletedId(null), 600);
    onDeleteTransaction?.(txToDelete.id);
    setTxToDelete(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* 3D Animated Hero Scene */}
      <Page3DHero
        pageId="history"
        title="Transaction History & Ledger Audit"
        subtitle="Complete verifiable simulated digital wallet records with downloadable and printable receipt slips."
        badgeText="3D Vault Ledger Active"
        actionButtonText="Export CSV Report"
        onActionButtonClick={handleExportCSV}
      />

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transaction History</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {transactions.length} records · audit trail of all simulated digital wallet activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Add Entry Button */}
          {onAddTransaction && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:opacity-90 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </button>
          )}
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilterTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilterTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, merchant, ID or reference…"
          className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Transaction / Type</th>
                <th className="px-5 py-4">Recipient / Merchant</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Date &amp; Time</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4 text-center">Receipt</th>
                {onDeleteTransaction && <th className="px-5 py-4 text-center">Delete</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={onDeleteTransaction ? 8 : 7} className="p-12 text-center text-slate-400">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 font-medium">No records found matching your filter</p>
                    {onAddTransaction && (
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add First Entry
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPositive = tx.type === 'income' || tx.type === 'add_money';
                  const isDeleting = deletedId === tx.id;
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`cursor-pointer hover:bg-slate-50/80 transition-all ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100'}`}
                      style={{ transition: 'opacity 0.3s, transform 0.3s' }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            {isPositive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 max-w-[180px] truncate">{tx.description}</p>
                            <p className="font-mono text-[10px] text-slate-400">{tx.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 max-w-[120px] truncate">{tx.recipientOrMerchant}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{tx.category}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium max-w-[130px] truncate">{tx.paymentMethod}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-black text-sm ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isPositive ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Slip</span>
                        </button>
                      </td>
                      {onDeleteTransaction && (
                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setTxToDelete(tx); }}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              Showing {filtered.length} of {transactions.length} transactions
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <TransactionReceiptModal
          transaction={selectedTx}
          currency={currency}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          currency={currency}
          onSave={handleAddSave}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {txToDelete && (
        <DeleteConfirmModal
          tx={txToDelete}
          currency={currency}
          onConfirm={handleDeleteConfirm}
          onClose={() => setTxToDelete(null)}
        />
      )}
    </div>
  );
};
