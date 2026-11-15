import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or configured credentials
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || ENV_SUPABASE_URL;
  const key = customKey || ENV_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    if (!clientInstance || customUrl || customKey) {
      clientInstance = createClient(url, key);
    }
    return clientInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message || 'Connection test failed. Check your Supabase URL and Anon Key.' };
    }
    return { success: true, message: 'Supabase connected successfully!' };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Invalid URL or network error.' };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- PocketZapp AI - Complete Supabase Database Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college_id TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT '$',
  wallet_balance NUMERIC(12, 2) DEFAULT 2850.00,
  pin_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read and write their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('add_money', 'transfer', 'payment', 'expense', 'income')),
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  recipient_or_merchant TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  reference_id TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own transactions"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id);

-- 3. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0.00,
  target_date DATE NOT NULL,
  category TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own savings goals"
  ON public.savings_goals FOR ALL
  USING (auth.uid() = user_id);

-- 4. Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  monthly_limit NUMERIC(12, 2) NOT NULL,
  spent NUMERIC(12, 2) DEFAULT 0.00,
  month_year TEXT NOT NULL,
  category_limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own budgets"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);
`;
