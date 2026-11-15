import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  X, 
  DollarSign,
  FileText
} from 'lucide-react';
import { Transaction, ExpenseCategory, TransactionType } from '../../types';
import { Page3DHero } from '../Visuals/Page3DHero';

interface ExpenseManagerProps {
  transactions: Transaction[];
  currency: string;
  onAddTransaction: (tx: Transaction) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  transactions,
  currency,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all', 'this_month', 'last_month'

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addModalType, setAddModalType] = useState<'expense' | 'income'>('expense');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Form states
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [recipientOrMerchant, setRecipientOrMerchant] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('PocketZapp Wallet');
  const [notes, setNotes] = useState<string>('');

  const categories: ExpenseCategory[] = [
    'Food',
    'Shopping',
    'Travel',
    'Education',
    'Entertainment',
    'Health',
    'Other',
  ];

  // Filtering
  const filtered = transactions.filter((tx) => {
    // Search
    const matchSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipientOrMerchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Category
    const matchCategory = categoryFilter === 'all' || tx.category === categoryFilter;

    // Type
    const matchType = typeFilter === 'all' || tx.type === typeFilter;

    // Date
    const txDate = new Date(tx.date);
    const now = new Date();
    let matchDate = true;
    if (dateFilter === 'this_month') {
      matchDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    } else if (dateFilter === 'last_month') {
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      matchDate = txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
    }

    return matchSearch && matchCategory && matchType && matchDate;
  });

  // Calculate Monthly & Yearly summary
  const now = new Date();
  const currentMonthTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const currentYearTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === now.getFullYear();
  });

  const monthExpenses = currentMonthTxs
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const monthIncome = currentMonthTxs
    .filter((t) => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const yearExpenses = currentYearTxs
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const yearIncome = currentYearTxs
    .filter((t) => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const handleOpenAdd = (type: 'expense' | 'income') => {
    setAddModalType(type);
    setAmount('');
    setDescription('');
    setCategory(type === 'expense' ? 'Food' : 'Deposit');
    setRecipientOrMerchant(type === 'expense' ? '' : 'Self / Employer');
    setPaymentMethod('PocketZapp Wallet');
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setAmount(tx.amount.toString());
    setDescription(tx.description);
    setCategory(tx.category);
    setRecipientOrMerchant(tx.recipientOrMerchant);
    setPaymentMethod(tx.paymentMethod);
    setNotes(tx.notes || '');
  };

  const handleSaveNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const newTx: Transaction = {
      id: `TXN-${addModalType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      type: addModalType,
      amount: num,
      description: description || `${addModalType} record`,
      category: category,
      recipientOrMerchant: recipientOrMerchant || (addModalType === 'income' ? 'Income Deposit' : 'General Merchant'),
      paymentMethod: paymentMethod,
      status: 'completed',
      date: new Date().toISOString(),
      referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes,
    };

    onAddTransaction(newTx);
    setShowAddModal(false);
  };

  const handleSaveEditTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const updatedTx: Transaction = {
      ...editingTx,
      amount: num,
      description,
      category,
      recipientOrMerchant,
      paymentMethod,
      notes,
    };

    onEditTransaction(updatedTx);
    setEditingTx(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Cash Register & Floating Receipt */}
      <Page3DHero
        pageId="expenses"
        title="Smart Expense & Income Manager"
        subtitle="Real-time transaction tracking, categorical classification, and cash flow analysis."
        badgeText="3D Register & Cashflow Active"
        actionButtonText="Add New Expense"
        onActionButtonClick={() => handleOpenAdd('expense')}
      />

      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Smart Expense & Income Manager</h1>
          <p className="text-xs sm:text-sm text-slate-500">Record, filter, search, and track all your cash flows</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd('expense')}
            className="flex items-center gap-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenAdd('income')}
            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Monthly and Yearly Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <TrendingDown className="h-4 w-4" />
            <span>This Month Outflow</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
            {currency}{monthExpenses.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">November 2026</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>This Month Inflow</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
            {currency}{monthIncome.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">November 2026</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Calendar className="h-4 w-4" />
            <span>Year-to-Date Outflow</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
            {currency}{yearExpenses.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Annual Total</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>Year-to-Date Inflow</span>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
            {currency}{yearIncome.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Annual Total</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description, merchant, or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="Deposit">Deposit</option>
            <option value="Transfer">Transfer</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
            <option value="payment">Payments</option>
            <option value="transfer">Transfers</option>
            <option value="add_money">Money Added</option>
          </select>

          {/* Date filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Transactions List Table / Cards */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-600">No transactions match your search</p>
              <p className="text-xs text-slate-400">Try clearing filters or adding a new record</p>
            </div>
          ) : (
            filtered.map((tx) => {
              const isPositive = tx.type === 'income' || tx.type === 'add_money';
              return (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                      }`}
                    >
                      {isPositive ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{tx.description}</h4>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tx.recipientOrMerchant} • {tx.paymentMethod} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className={`text-base font-extrabold ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isPositive ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                      </span>
                      <p className="font-mono text-[10px] text-slate-400">{tx.referenceId || tx.id}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(tx)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Edit Transaction"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete transaction "${tx.description}"?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">
              {addModalType === 'expense' ? 'Add New Expense' : 'Add New Income'}
            </h3>
            <p className="text-xs text-slate-400">Record a simulated transaction directly</p>

            <form onSubmit={handleSaveNewTransaction} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Amount ({currency})</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xl font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Textbook or Freelance Stipend"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    {addModalType === 'income' ? (
                      <>
                        <option value="Deposit">Deposit / Stipend</option>
                        <option value="Other">Other Inflow</option>
                      </>
                    ) : (
                      categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    {addModalType === 'expense' ? 'Merchant / Recipient' : 'Payer / Source'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starbucks or College"
                    value={recipientOrMerchant}
                    onChange={(e) => setRecipientOrMerchant(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Payment Channel</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Receipt notes..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-2 rounded-xl py-2.5 text-xs font-semibold text-white shadow-md transition-all ${
                    addModalType === 'expense'
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  Save {addModalType === 'expense' ? 'Expense' : 'Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setEditingTx(null)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Edit Transaction</h3>
            <p className="text-xs text-slate-400">Update details for {editingTx.id}</p>

            <form onSubmit={handleSaveEditTransaction} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Amount ({currency})</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xl font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Deposit">Deposit</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Party / Merchant</label>
                  <input
                    type="text"
                    required
                    value={recipientOrMerchant}
                    onChange={(e) => setRecipientOrMerchant(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
