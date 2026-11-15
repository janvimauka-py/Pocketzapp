import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Bot, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  UserProfile, 
  Transaction, 
  Budget, 
  SavingsGoal, 
  AppNotification, 
  RecentContact 
} from './types';
import { storageService, DEFAULT_USER } from './services/storage';

// Components
import { PinLockScreen } from './components/Security/PinLockScreen';
import { LeftSidebar } from './components/Navigation/LeftSidebar';
import { TopNav } from './components/Header/TopNav';
import { HomeWalletView } from './components/Wallet/HomeWalletView';
import { SavingsManager } from './components/Savings/SavingsManager';
import { ExpenseManager } from './components/Expenses/ExpenseManager';
import { BudgetManager } from './components/Budget/BudgetManager';
import { ReceiptScanner } from './components/ReceiptScanner/ReceiptScanner';
import { TransactionHistory } from './components/TransactionHistory/TransactionHistory';
import { AnalyticsReports } from './components/Analytics/AnalyticsReports';

// Popups & Drawers
import { CheckBalanceModal } from './components/Popups/CheckBalanceModal';
import { AddMoneyModal } from './components/Popups/AddMoneyModal';
import { TransferMoneyModal } from './components/Popups/TransferMoneyModal';
import { CheckoutPayModal } from './components/Popups/CheckoutPayModal';
import { TransactionReceiptModal } from './components/Popups/TransactionReceiptModal';
import { SmartBudgetPopup } from './components/Popups/SmartBudgetPopup';
import { AIAssistantDrawer } from './components/AIAssistant/AIAssistantDrawer';
import { ProfileSettingsModal } from './components/ProfileSettings/ProfileSettingsModal';
import { NotificationsDrawer } from './components/Notifications/NotificationsDrawer';

export function App() {
  // App authentication state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Persistent domain state
  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => storageService.getSavingsGoals());
  const [budget, setBudget] = useState<Budget>(() => storageService.getBudget());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.getNotifications());
  const [contacts, setContacts] = useState<RecentContact[]>(() => storageService.getContacts());

  // UI Navigation state
  const [activeTab, setActiveTab] = useState<string>('wallet');

  // Modals state
  const [showCheckBalance, setShowCheckBalance] = useState<boolean>(false);
  const [showAddMoney, setShowAddMoney] = useState<boolean>(false);
  const [showTransferMoney, setShowTransferMoney] = useState<boolean>(false);
  const [selectedTransferContact, setSelectedTransferContact] = useState<RecentContact | null>(null);
  const [showCheckoutPay, setShowCheckoutPay] = useState<boolean>(false);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [showBudgetPopup, setShowBudgetPopup] = useState<boolean>(false);
  const [showAIDrawer, setShowAIDrawer] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);

  // Auto trigger budget popup on first entry
  useEffect(() => {
    if (isUnlocked && !storageService.hasSeenBudgetPopup()) {
      setShowBudgetPopup(true);
      storageService.setSeenBudgetPopup(true);
    }
  }, [isUnlocked]);

  // Inactivity Auto-Lock (Locks app after 3 minutes of idle time)
  useEffect(() => {
    if (!isUnlocked) return;

    let timeoutId: any;

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsUnlocked(false);
      }, 3 * 60 * 1000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((ev) => window.removeEventListener(ev, resetInactivityTimer));
    };
  }, [isUnlocked]);

  // Sync state to LocalStorage
  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storageService.saveSavingsGoals(savingsGoals);
  }, [savingsGoals]);

  useEffect(() => {
    storageService.saveBudget(budget);
  }, [budget]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  // Dynamic calculations from transactions
  const BASE_WALLET_BALANCE = 84500.00; // Base seed balance in INR (₹)
  const netTransactionDelta = transactions.reduce((acc, tx) => {
    if (tx.type === 'income' || tx.type === 'add_money') {
      return acc + tx.amount;
    } else {
      return acc - tx.amount;
    }
  }, 0);

  // Dynamic available wallet balance (guaranteed non-negative in demo)
  const walletBalance = Math.max(0, BASE_WALLET_BALANCE + netTransactionDelta);

  // Month-to-date inflows and outflows
  const now = new Date();
  const currentMonthTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalIncome = currentMonthTxs
    .filter((t) => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = currentMonthTxs
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const totalSavings = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);

  // Category breakdown for current cycle
  const categorySpending: Record<string, number> = {};
  currentMonthTxs
    .filter((t) => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  // Keep budget.spent in sync with totalExpenses
  useEffect(() => {
    if (budget.spent !== totalExpenses) {
      setBudget((prev) => ({ ...prev, spent: totalExpenses }));
    }
  }, [totalExpenses]);

  // Atomic Transaction Handler (called by Add, Transfer, Checkout, Savings deposit, etc.)
  const handleRecordTransaction = (newTx: Transaction) => {
    // 1. Prepend transaction
    const updatedTransactions = [newTx, ...transactions];
    setTransactions(updatedTransactions);

    // 2. Add in-app notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `${newTx.type === 'add_money' ? 'Fund Top-up' : newTx.type === 'transfer' ? 'Transfer Sent' : 'Payment Approved'}`,
      message: `${newTx.description} of ${user.currency || '$'}${newTx.amount.toFixed(2)} completed. Ref: ${newTx.referenceId || newTx.id}`,
      type: 'transaction',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 3. Show celebration confetti for successful add / transfer / payment
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });

    // 4. Reveal receipt modal
    setReceiptTx(newTx);
  };

  // Full Reset Demo Data
  const handleResetDemoData = () => {
    storageService.resetDemoData();
    setUser(storageService.getUser());
    setTransactions(storageService.getTransactions());
    setSavingsGoals(storageService.getSavingsGoals());
    setBudget(storageService.getBudget());
    setNotifications(storageService.getNotifications());
    setContacts(storageService.getContacts());
    setActiveTab('wallet');
  };

  return (
    <div className="relative min-h-screen bg-[#070B14] text-slate-800 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Actual Website Dashboard (Always Loaded in Background, Blurred when Locked) */}
      <div 
        className={`flex min-h-screen bg-[#F1F5F9] transition-all duration-700 ease-in-out ${
          !isUnlocked 
            ? 'filter blur-[14px] brightness-[0.5] pointer-events-none select-none max-h-screen overflow-hidden' 
            : 'filter blur-0 brightness-100'
        }`}
      >
          
          {/* Permanent Left Sidebar with All Pages Listed */}
          <LeftSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === 'settings') {
                setShowSettingsModal(true);
              } else {
                setActiveTab(tab);
              }
            }}
            user={user}
            walletBalance={walletBalance}
            currency={user.currency || '₹'}
            onOpenAI={() => setShowAIDrawer(true)}
            onOpenAddMoney={() => setShowAddMoney(true)}
            onResetDemo={handleResetDemoData}
            onLogout={() => setIsUnlocked(false)}
            isOpenMobile={isOpenMobileSidebar}
            onCloseMobile={() => setIsOpenMobileSidebar(false)}
          />

          {/* Right Main Content Area (Offset for Desktop Sidebar) */}
          <div className="flex flex-1 flex-col xl:pl-72 min-w-0">
            
            {/* Top Navigation Bar */}
            <TopNav
              user={user}
              activeTab={activeTab}
              onOpenMobileMenu={() => setIsOpenMobileSidebar(true)}
              notifications={notifications}
              onOpenNotifications={() => setShowNotificationsDrawer(true)}
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenAI={() => setShowAIDrawer(true)}
              onOpenBudgetModal={() => setShowBudgetPopup(true)}
              onLockApp={() => setIsUnlocked(false)}
              onResetDemo={handleResetDemoData}
              onUpdateUser={(updated) => setUser(updated)}
            />

            {/* Main Body Viewport */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              
              {/* View 1: Digital Wallet (Main Home Screen) */}
              {activeTab === 'wallet' && (
                <HomeWalletView
                  user={user}
                  walletBalance={walletBalance}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  totalSavings={totalSavings}
                  budget={budget}
                  savingsGoals={savingsGoals}
                  transactions={transactions}
                  contacts={contacts}
                  currency={user.currency || '₹'}
                  onCheckBalance={() => setShowCheckBalance(true)}
                  onAddMoney={() => setShowAddMoney(true)}
                  onTransferMoney={() => {
                    setSelectedTransferContact(null);
                    setShowTransferMoney(true);
                  }}
                  onTransferToContact={(contact) => {
                    setSelectedTransferContact(contact);
                    setShowTransferMoney(true);
                  }}
                  onRecordTransaction={handleRecordTransaction}
                  onCheckoutPay={() => setShowCheckoutPay(true)}
                  onSelectTransaction={(tx) => setReceiptTx(tx)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenBudgetModal={() => setShowBudgetPopup(true)}
                />
              )}

              {/* View 2: Savings Goals Manager */}
              {activeTab === 'savings' && (
                <SavingsManager
                  savingsGoals={savingsGoals}
                  walletBalance={walletBalance}
                  currency={user.currency || '₹'}
                  onUpdateGoals={(goals) => setSavingsGoals(goals)}
                  onWalletTransaction={handleRecordTransaction}
                />
              )}

              {/* View 3: Smart Expense Manager */}
              {activeTab === 'expenses' && (
                <ExpenseManager
                  transactions={transactions}
                  currency={user.currency || '₹'}
                  onAddTransaction={handleRecordTransaction}
                  onEditTransaction={(updatedTx) => {
                    setTransactions((prev) =>
                      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
                    );
                  }}
                  onDeleteTransaction={(txId) => {
                    setTransactions((prev) => prev.filter((t) => t.id !== txId));
                  }}
                />
              )}

              {/* View 4: Smart Budget Manager */}
              {activeTab === 'budget' && (
                <BudgetManager
                  budget={budget}
                  currency={user.currency || '₹'}
                  categorySpending={categorySpending}
                  onUpdateBudget={(b) => setBudget(b)}
                />
              )}

              {/* View 5: AI Receipt Scanner */}
              {activeTab === 'scanner' && (
                <ReceiptScanner
                  currency={user.currency || '₹'}
                  onAddTransaction={handleRecordTransaction}
                  onNavigateToHistory={() => setActiveTab('history')}
                />
              )}

              {/* View 6: Transaction History */}
              {activeTab === 'history' && (
                <TransactionHistory
                  transactions={transactions}
                  currency={user.currency || '₹'}
                />
              )}

              {/* View 7: Financial Analytics & Reports */}
              {activeTab === 'analytics' && (
                <AnalyticsReports
                  transactions={transactions}
                  budget={budget}
                  savingsGoals={savingsGoals}
                  currency={user.currency || '₹'}
                />
              )}

            </main>

            {/* Footer with Demo Mode Label & Project Details */}
            <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500">
              <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">
                    Pocket<span className="text-rose-500">Zapp</span> AI
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Your Money. Your Insights. Your Control.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    COLLEGE PROJECT DEMO MODE
                  </span>
                  <span>Simulated Sandbox</span>
                </div>
              </div>
            </footer>
          </div>

          {/* Floating AI Assistant Button (Visible throughout the website) */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              type="button"
              onClick={() => setShowAIDrawer(true)}
              className="group flex items-center gap-2.5 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-xl shadow-blue-600/35 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Open PocketZapp AI Assistant"
            >
              <div className="relative">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-tight">
                Ask PocketZapp AI
              </span>
            </button>
          </div>

          {/* -------------------- MODALS & DRAWERS -------------------- */}

          {/* 1. Check Balance Protected Modal */}
          {showCheckBalance && (
            <CheckBalanceModal
              isOpen={showCheckBalance}
              walletBalance={walletBalance}
              currency={user.currency || '₹'}
              totalSavings={totalSavings}
              recentTransactions={transactions}
              onClose={() => setShowCheckBalance(false)}
              onAddMoneyClick={() => {
                setShowCheckBalance(false);
                setShowAddMoney(true);
              }}
              onTransferClick={() => {
                setShowCheckBalance(false);
                setShowTransferMoney(true);
              }}
            />
          )}

          {/* 2. Add Money Modal */}
          {showAddMoney && (
            <AddMoneyModal
              isOpen={showAddMoney}
              currency={user.currency || '₹'}
              onSuccess={handleRecordTransaction}
              onClose={() => setShowAddMoney(false)}
            />
          )}

          {/* 3. Transfer Money Modal */}
          {showTransferMoney && (
            <TransferMoneyModal
              isOpen={showTransferMoney}
              walletBalance={walletBalance}
              currency={user.currency || '₹'}
              contacts={contacts}
              initialContact={selectedTransferContact}
              onSuccess={handleRecordTransaction}
              onClose={() => {
                setShowTransferMoney(false);
                setSelectedTransferContact(null);
              }}
            />
          )}

          {/* 4. Checkout / Pay Modal */}
          {showCheckoutPay && (
            <CheckoutPayModal
              isOpen={showCheckoutPay}
              walletBalance={walletBalance}
              currency={user.currency || '₹'}
              onSuccess={handleRecordTransaction}
              onClose={() => setShowCheckoutPay(false)}
            />
          )}

          {/* 5. Transaction Digital Receipt Slip Modal */}
          {receiptTx && (
            <TransactionReceiptModal
              transaction={receiptTx}
              currency={user.currency || '₹'}
              onClose={() => setReceiptTx(null)}
            />
          )}

          {/* 6. Smart Budget Overview Popup */}
          {showBudgetPopup && (
            <SmartBudgetPopup
              isOpen={showBudgetPopup}
              budget={budget}
              currency={user.currency || '₹'}
              totalSavings={totalSavings}
              categorySpending={categorySpending}
              onClose={() => setShowBudgetPopup(false)}
              onNavigateToBudget={() => {
                setShowBudgetPopup(false);
                setActiveTab('budget');
              }}
            />
          )}

          {/* 7. AI Assistant Drawer */}
          {showAIDrawer && (
            <AIAssistantDrawer
              isOpen={showAIDrawer}
              onClose={() => setShowAIDrawer(false)}
              user={user}
              transactions={transactions}
              budget={budget}
              savingsGoals={savingsGoals}
              walletBalance={walletBalance}
            />
          )}

          {/* 8. Profile & Settings Modal */}
          {showSettingsModal && (
            <ProfileSettingsModal
              isOpen={showSettingsModal}
              onClose={() => setShowSettingsModal(false)}
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onLogout={() => {
                setShowSettingsModal(false);
                setIsUnlocked(false);
              }}
              onResetDemo={handleResetDemoData}
            />
          )}

          {/* 9. Notifications Drawer */}
          {showNotificationsDrawer && (
            <NotificationsDrawer
              isOpen={showNotificationsDrawer}
              onClose={() => setShowNotificationsDrawer(false)}
              notifications={notifications}
              onMarkAllRead={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                );
              }}
              onClearAll={() => setNotifications([])}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

        </div>

      {/* Premium Full-Screen PIN Security Overlay */}
      {!isUnlocked && (
        <PinLockScreen
          user={user}
          onUnlocked={() => setIsUnlocked(true)}
          onUpdateUser={(updated) => setUser(updated)}
        />
      )}

    </div>
  );
}

export default App;
