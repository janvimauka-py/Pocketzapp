import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  Calendar, 
  Printer, 
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Transaction, TransactionType } from '../../types';
import { TransactionReceiptModal } from '../Popups/TransactionReceiptModal';
import { Page3DHero } from '../Visuals/Page3DHero';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currency: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currency,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'add_money', label: 'Money Added' },
    { id: 'transfer', label: 'Transfers' },
    { id: 'payment', label: 'Payments' },
    { id: 'expense', label: 'Expenses' },
    { id: 'income', label: 'Income' },
  ];

  const filtered = transactions.filter((tx) => {
    const matchesTab = activeFilterTab === 'all' || tx.type === activeFilterTab;
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
      t.id,
      t.type,
      t.amount,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      `"${t.recipientOrMerchant.replace(/"/g, '""')}"`,
      `"${t.paymentMethod}"`,
      new Date(t.date).toISOString(),
      t.status,
      t.referenceId || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PocketZapp_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Secured Ledger Vault */}
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
            Audit trail of all simulated digital wallet activities and downloadable receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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
          placeholder="Search by ID, merchant, recipient, or keywords..."
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
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 font-medium">No records found matching your filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPositive = tx.type === 'income' || tx.type === 'add_money';
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isPositive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{tx.description}</p>
                            <p className="font-mono text-[10px] text-slate-400">{tx.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {tx.recipientOrMerchant}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium">
                        {tx.paymentMethod}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          <FileText className="h-3 w-3" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <TransactionReceiptModal
          transaction={selectedTx}
          currency={currency}
          onClose={() => setSelectedTx(null)}
        />
      )}

    </div>
  );
};
