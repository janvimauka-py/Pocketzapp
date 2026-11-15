export type TransactionType = 'add_money' | 'transfer' | 'payment' | 'expense' | 'income';

export type ExpenseCategory = 
  | 'Food' 
  | 'Shopping' 
  | 'Travel' 
  | 'Education' 
  | 'Entertainment' 
  | 'Health' 
  | 'Other'
  | 'Deposit'
  | 'Transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: ExpenseCategory;
  recipientOrMerchant: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  date: string; // ISO string
  referenceId: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
  color: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  monthlyLimit: number;
  spent: number;
  monthYear: string; // '2026-11'
  categoryLimits: Record<string, number>;
  alertsDismissed?: {
    seventy?: boolean;
    ninety?: boolean;
    hundred?: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  collegeId: string;
  pin: string; // Hashed or stored demo PIN
  pinLength: 4 | 6;
  isPinSet: boolean;
  failedPinAttempts: number;
  lockUntil: number | null;
  currency: string; // '$' | '₹' | '€' | '£'
  showBalance: boolean;
  geminiApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  // Linked Bank & Credit Card Details
  bankName?: string;
  bankAccountNumber?: string;
  bankBalance?: number;
  bankIfsc?: string;
  creditCardHolder?: string;
  creditCardNumber?: string;
  creditCardExpiry?: string;
  creditCardCvv?: string;
  creditCardLimit?: number;
  creditCardAvailable?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'security' | 'transaction' | 'savings' | 'ai';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  dataMetrics?: {
    label: string;
    value: string;
    type?: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface RecentContact {
  id: string;
  name: string;
  identifier: string; // phone or UPI ID or email
  avatar: string;
  type: 'friend' | 'merchant' | 'college';
}
