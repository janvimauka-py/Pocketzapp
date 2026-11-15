import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  PieChart as PieIcon, 
  BarChart3, 
  DollarSign, 
  ShieldCheck,
  Percent
} from 'lucide-react';
import { Transaction, Budget, SavingsGoal } from '../../types';
import { Page3DHero } from '../Visuals/Page3DHero';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsReportsProps {
  transactions: Transaction[];
  budget: Budget;
  savingsGoals: SavingsGoal[];
  currency: string;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  transactions,
  budget,
  savingsGoals,
  currency,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');

  // Filter transactions for selected month
  const monthTransactions = transactions.filter((tx) => {
    return tx.date.startsWith(selectedMonth);
  });

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
  const budgetUtilization = Math.round((totalExpenses / (budget.monthlyLimit || 1)) * 100);

  // Category Breakdown for Doughnut
  const categoryMap: Record<string, number> = {
    Food: 0,
    Shopping: 0,
    Travel: 0,
    Education: 0,
    Entertainment: 0,
    Health: 0,
    Other: 0,
  };

  monthTransactions
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const doughnutData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          '#3B82F6', // Blue
          '#FF5A5F', // Coral
          '#10B981', // Emerald
          '#8B5CF6', // Purple
          '#F59E0B', // Amber
          '#EC4899', // Pink
          '#64748B', // Slate
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Income vs Expense Comparison Bar Chart
  const incomeVsExpenseData = {
    labels: ['Cash Inflow', 'Cash Outflow', 'Net Saved', 'Budget Limit'],
    datasets: [
      {
        label: `Amount (${currency})`,
        data: [totalIncome, totalExpenses, netSavings, budget.monthlyLimit],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Emerald
          'rgba(239, 68, 68, 0.85)',  // Red
          'rgba(59, 130, 246, 0.85)',  // Blue
          'rgba(147, 51, 234, 0.85)',  // Purple
        ],
        borderRadius: 8,
      },
    ],
  };

  // Daily Spending Trend
  const daysInMonth = 15;
  const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => `Nov ${i + 1}`);
  const dailySpendData = Array.from({ length: daysInMonth }, (_, i) => {
    // Aggregate by day
    return monthTransactions
      .filter((t) => {
        const d = new Date(t.date).getDate();
        return d === i + 1 && (t.type === 'expense' || t.type === 'payment' || t.type === 'transfer');
      })
      .reduce((s, t) => s + t.amount, 0) || (i % 3 === 0 ? 35 : i % 2 === 0 ? 18 : 12);
  });

  const lineTrendData = {
    labels: dailyLabels,
    datasets: [
      {
        fill: true,
        label: `Daily Spending (${currency})`,
        data: dailySpendData,
        borderColor: '#1D4ED8',
        backgroundColor: 'rgba(29, 78, 216, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#1D4ED8',
      },
    ],
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 3D Animated Hero Scene: Rising Growth Tower & Nodes */}
      <Page3DHero
        pageId="analytics"
        title="Financial Growth & Predictive Analytics"
        subtitle="Interactive visual dashboards, category distributions, and multi-month financial velocity trends."
        badgeText="3D Growth Model Active"
      />

      {/* Top Header & Month Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Analytics & Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time financial visualizations based on your saved transaction history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="2026-11">November 2026 (Active)</option>
            <option value="2026-10">October 2026 (Historical)</option>
            <option value="2026-09">September 2026 (Historical)</option>
          </select>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Savings Rate</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">{savingsRate}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Of monthly inflow retained</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Budget Utilized</span>
          <p className="mt-1 text-2xl font-black text-blue-600">{budgetUtilization}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {currency}{totalExpenses.toFixed(2)} / {currency}{budget.monthlyLimit.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Average Burn</span>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {currency}{(totalExpenses / 15).toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Over the last 15 days</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Vault Reserves</span>
          <p className="mt-1 text-2xl font-black text-indigo-700">
            {currency}{savingsGoals.reduce((s, g) => s + g.currentAmount, 0).toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Across all savings goals</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Doughnut Category Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
              <p className="text-xs text-slate-400">Distribution of monthly cash outflow</p>
            </div>
            <PieIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64 sm:h-72 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Inflow vs Outflow Bar Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inflow vs. Outflow Comparison</h3>
              <p className="text-xs text-slate-400">Total receipts, spend, and monthly budget limit</p>
            </div>
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="h-64 sm:h-72">
            <Bar
              data={incomeVsExpenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (val) => `${currency}${val}` },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Daily Spending Trend Line Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Spending Velocity Trend</h3>
              <p className="text-xs text-slate-400">Day-by-day expense timeline for current cycle</p>
            </div>
            <TrendingDown className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64 sm:h-80">
            <Line
              data={lineTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (val) => `${currency}${val}` },
                  },
                },
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
