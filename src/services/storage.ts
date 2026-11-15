import {
  UserProfile,
  Transaction,
  SavingsGoal,
  Budget,
  AppNotification,
  RecentContact
} from '../types';

const STORAGE_KEYS = {
  USER: 'pocketzapp_user_v2',
  TRANSACTIONS: 'pocketzapp_transactions_v2',
  SAVINGS_GOALS: 'pocketzapp_savings_goals_v2',
  BUDGET: 'pocketzapp_budget_v2',
  NOTIFICATIONS: 'pocketzapp_notifications_v2',
  CONTACTS: 'pocketzapp_contacts_v2',
  HAS_SEEN_BUDGET_POPUP: 'pocketzapp_seen_budget_popup_v2',
};

// Default Demo User in INR (₹)
export const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  name: 'Janvi Mauka',
  email: 'janvi.mauka@pocketzapp.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  phone: '+91 98200 12345',
  collegeId: 'CS-2024-8841',
  pin: '1507',
  pinLength: 4,
  isPinSet: true,
  failedPinAttempts: 0,
  lockUntil: null,
  currency: '₹', // Standard INR Currency
  showBalance: true,
  geminiApiKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

// Initial Sample Transactions in INR (₹)
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_demo_001',
    type: 'add_money',
    amount: 15000,
    description: 'Wallet Top-up via FastPay UPI',
    category: 'Deposit',
    recipientOrMerchant: 'Self (FastPay UPI)',
    paymentMethod: 'UPI / FastPay',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    referenceId: 'REF-TOPUP-9941',
    notes: 'PocketZapp UPI demo fund addition'
  },
  {
    id: 'tx_demo_002',
    type: 'payment',
    amount: 3450,
    description: 'CS Lab Electronics Kit & Microcontrollers',
    category: 'Education',
    recipientOrMerchant: 'Campus Tech Mart',
    paymentMethod: 'PocketZapp Digital Card',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    referenceId: 'REF-TECH-4821',
    notes: 'Purchased hardware kit for IoT robotics presentation'
  },
  {
    id: 'tx_demo_003',
    type: 'transfer',
    amount: 1850,
    description: 'Split Weekend Cafe & Dinner',
    category: 'Food',
    recipientOrMerchant: 'Sarah Connor',
    paymentMethod: 'PocketZapp Peer Transfer',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    referenceId: 'REF-TRF-7731',
    notes: 'Split bill with Sarah and Mike'
  },
  {
    id: 'tx_demo_004',
    type: 'expense',
    amount: 480,
    description: 'Caramel Macchiato & Cinnamon Roll',
    category: 'Food',
    recipientOrMerchant: 'Starbucks Cafe',
    paymentMethod: 'PocketZapp Wallet',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    referenceId: 'REF-CAFE-1192',
    notes: 'Exam study coffee'
  },
  {
    id: 'tx_demo_005',
    type: 'income',
    amount: 28000,
    description: 'Freelance UI/UX Web Design Project',
    category: 'Deposit',
    recipientOrMerchant: 'College Innovation Hub',
    paymentMethod: 'Direct Bank Transfer',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    referenceId: 'REF-INC-5512',
    notes: 'UI/UX Workshop stipend'
  },
  {
    id: 'tx_demo_006',
    type: 'payment',
    amount: 649,
    description: 'Monthly Premium 4K UHD Plan',
    category: 'Entertainment',
    recipientOrMerchant: 'Netflix Digital',
    paymentMethod: 'Auto Debit Card',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    referenceId: 'REF-NET-3381',
    notes: 'Monthly entertainment subscription'
  },
  {
    id: 'tx_demo_007',
    type: 'expense',
    amount: 520,
    description: 'Uber Campus to Metro Central',
    category: 'Travel',
    recipientOrMerchant: 'Uber Mobility',
    paymentMethod: 'PocketZapp Wallet',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    referenceId: 'REF-UBR-2819',
    notes: 'Late evening commute'
  },
  {
    id: 'tx_demo_008',
    type: 'expense',
    amount: 4200,
    description: 'Weekly Dorm Groceries & Supplies',
    category: 'Shopping',
    recipientOrMerchant: 'Supermart Store',
    paymentMethod: 'PocketZapp Wallet',
    status: 'completed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
    referenceId: 'REF-TGT-6610',
    notes: 'Dorm essentials and groceries'
  }
];

// Initial Savings Goals in INR (₹)
export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_001',
    name: 'New MacBook Pro M3',
    targetAmount: 160000,
    currentAmount: 120000,
    targetDate: '2027-02-28',
    category: 'Education',
    icon: 'Laptop',
    color: 'from-blue-600 to-indigo-600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: 'goal_002',
    name: 'Goa College Roadtrip',
    targetAmount: 25000,
    currentAmount: 18500,
    targetDate: '2026-12-25',
    category: 'Travel',
    icon: 'Plane',
    color: 'from-amber-500 to-rose-500',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'goal_003',
    name: 'Emergency Safety Reserve',
    targetAmount: 100000,
    currentAmount: 75000,
    targetDate: '2027-06-30',
    category: 'Health',
    icon: 'Shield',
    color: 'from-emerald-500 to-teal-600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 'goal_004',
    name: 'PlayStation 5 Console',
    targetAmount: 45000,
    currentAmount: 32000,
    targetDate: '2027-03-15',
    category: 'Entertainment',
    icon: 'Gamepad2',
    color: 'from-purple-600 to-pink-600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  }
];

// Initial Budget in INR (₹)
export const INITIAL_BUDGET: Budget = {
  id: 'budget_nov_2026',
  monthlyLimit: 50000,
  spent: 38200, // ~76% spent
  monthYear: '2026-11',
  categoryLimits: {
    Food: 15000,
    Shopping: 10000,
    Travel: 6000,
    Education: 8000,
    Entertainment: 5000,
    Health: 3000,
    Other: 3000,
  },
  alertsDismissed: {
    seventy: false,
    ninety: false,
    hundred: false,
  }
};

// Initial Notifications in INR (₹)
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_001',
    title: 'Smart Budget Warning (76% Used)',
    message: 'You have spent ₹38,200 of your ₹50,000 monthly budget. We recommend limiting Food & Shopping for the remaining 15 days.',
    type: 'budget',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    linkAction: 'budget'
  },
  {
    id: 'notif_002',
    title: 'Savings Goal Milestone!',
    message: 'Awesome progress! "Goa College Roadtrip" is now 74% funded (₹18,500 / ₹25,000).',
    type: 'savings',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
    linkAction: 'savings'
  },
  {
    id: 'notif_003',
    title: 'Simulated UPI Top-up Successful',
    message: 'Added ₹15,000.00 to PocketZapp Demo Wallet via FastPay UPI. Ref: REF-TOPUP-9941.',
    type: 'transaction',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    read: true,
  },
  {
    id: 'notif_004',
    title: 'PocketZapp Security Shield Active',
    message: 'App PIN protection & biometric 2FA simulation are active. Safe demo mode engaged.',
    type: 'security',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  }
];

// Recent Contacts for Fast Peer Transfers (No DP - Just Names: Udit, Anvay, Aarvi, Jerry)
export const INITIAL_CONTACTS: RecentContact[] = [
  {
    id: 'cnt_001',
    name: 'Udit',
    identifier: 'udit@okhdfcbank',
    avatar: '',
    type: 'friend'
  },
  {
    id: 'cnt_002',
    name: 'Anvay',
    identifier: 'anvay@oksbi',
    avatar: '',
    type: 'friend'
  },
  {
    id: 'cnt_003',
    name: 'Aarvi',
    identifier: 'aarvi@okaxis',
    avatar: '',
    type: 'friend'
  },
  {
    id: 'cnt_004',
    name: 'Jerry',
    identifier: 'jerry@okicici',
    avatar: '',
    type: 'friend'
  }
];

// Local Storage Helper Functions
export const storageService = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure default currency is always INR (₹)
        parsed.currency = '₹';
        parsed.pin = '1507';
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    }
    this.saveUser(DEFAULT_USER);
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load transactions', e);
    }
    this.saveTransactions(INITIAL_TRANSACTIONS);
    return INITIAL_TRANSACTIONS;
  },

  saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getSavingsGoals(): SavingsGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load savings goals', e);
    }
    this.saveSavingsGoals(INITIAL_SAVINGS_GOALS);
    return INITIAL_SAVINGS_GOALS;
  },

  saveSavingsGoals(goals: SavingsGoal[]) {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  },

  getBudget(): Budget {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load budget', e);
    }
    this.saveBudget(INITIAL_BUDGET);
    return INITIAL_BUDGET;
  },

  saveBudget(budget: Budget) {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  },

  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  },

  saveNotifications(notifications: AppNotification[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getContacts(): RecentContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (data) {
        const parsed: RecentContact[] = JSON.parse(data);
        // Ensure contacts list reflects Udit, Anvay, Aarvi, Jerry
        const names = parsed.map((c) => c.name);
        if (names.includes('Udit') && names.includes('Anvay')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load contacts', e);
    }
    this.saveContacts(INITIAL_CONTACTS);
    return INITIAL_CONTACTS;
  },

  saveContacts(contacts: RecentContact[]) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  hasSeenBudgetPopup(): boolean {
    return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_BUDGET_POPUP) === 'true';
  },

  setSeenBudgetPopup(seen: boolean) {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_BUDGET_POPUP, String(seen));
  },

  // Full Demo Reset
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(INITIAL_SAVINGS_GOALS));
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(INITIAL_BUDGET));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
    localStorage.removeItem(STORAGE_KEYS.HAS_SEEN_BUDGET_POPUP);
  }
};
