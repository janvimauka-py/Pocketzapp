# PocketZapp AI – Smart Digital Wallet & Personal Finance Assistant

> **Tagline:** *Your Money. Your Insights. Your Control.*

PocketZapp AI is a modern, responsive, and genuinely functional fintech digital wallet and personal finance assistant built from scratch for a college final project demonstration.

---

## 🌟 Key Highlights & Features

### 1. 🎨 Fintech Design & Visual Theme
- **Color Palette:** Deep Cobalt Blue (`#1E40AF`, `#1E3A8A`), Vibrant Coral (`#FF5A5F`), Soft Lavender & Slate backgrounds (`#F8FAFC`), Emerald Green for savings/inflows, and Rose/Amber for thresholds.
- **Glassmorphism & 3D Tilt:** 3D animated digital wallet card with interactive cursor-tilt physics, EMV chip, contactless wave symbol, holographic shine layer, and real-time balance metrics.

### 2. 🔐 Security – App Opening PIN Screen
- 4-Digit or 6-Digit Master Security PIN.
- Real numeric tactile keypad with clear and backspace controls.
- Show/Hide PIN toggle.
- Incorrect PIN vibration alert with remaining attempt counter.
- Automatic 30-second lockout after 3 consecutive failed attempts.
- Account-based PIN recovery using College ID (`CS-2024-8841`) or Master Code (`POCKETZAPP2026`).

### 3. 💳 Digital Wallet & Core Action Buttons
- **Check Balance:** Protected 2FA flow requiring simulated 6-digit OTP before decrypting and displaying ledger balance, goal allocations, and pending settlements.
- **Add Money:** Fund top-up with quick chips (+$50, +$100, +$250, +$500), simulated methods (FastPay UPI, Debit Card, Net Banking), simulated OTP verification, atomic balance increment, and downloadable receipt slip.
- **Transfer Money:** Peer-to-peer transfer with quick student contacts (Sarah Connor, Campus Canteen, Mike Roommate), overdraft prevention against available balance, OTP verification, and receipt generation.
- **Checkout / Pay:** 1-Click store checkout with popular merchants (Campus Tech Mart, Amazon, Starbucks, Uber, Spotify), order breakdown, OTP authorization, and digital receipt.

### 4. 🔑 Simulated OTP Verification System
- Consistent 6-digit auto-advancing input boxes with backspace and paste handling.
- Simulated SMS delivery notification banner with **1-Click Auto-Fill** button.
- 30-second resend cooldown timer and 3-attempt limit.

### 5. 🎯 Smart Budget Manager & Startup Popup
- Interactive monthly budget overview popup on startup with animated circular progress ring.
- Proactive threshold alerts at **70%** (spending warning), **90%** (almost exhausted), and **100%** (limit reached).
- Category-wise limit editor and tracking (Food, Shopping, Travel, Education, Entertainment, Health, Other).
- Previous months comparison.

### 6. 💎 Savings Management & Smart Vaults
- Dedicated savings goals (MacBook Pro M3, Goa College Roadtrip, Emergency Reserve, PS5 Console).
- Deposit funds directly into goals from wallet balance and withdraw back.
- Interactive Savings Planner Calculator (`Target / Months = Monthly Contribution`).
- Celebratory confetti explosion on goal achievement!

### 7. 📝 Smart Expense & Income Manager
- Add expenses & add income with category, recipient, and notes.
- In-place editing and deletion of transactions.
- Instant search and multi-criteria filters (category, type, date range).
- Real-time monthly and yearly outflow/inflow summaries.

### 8. 🤖 PocketZapp AI Assistant
- Floating AI assistant widget available across the entire web application.
- Answers dynamic natural language questions:
  - *"How much did I spend this month?"*
  - *"What is my remaining budget?"*
  - *"Which category has the highest expenses?"*
  - *"How much have I saved?"*
  - *"How can I manage my budget better?"*
  - *"Give me a summary of my transactions."*
- Analyzes actual live transactions, balances, and vault velocities without fake static numbers.
- Option to connect Google Gemini LLM API key in Settings.

### 9. 📸 AI Receipt Scanner
- Upload receipt snapshot or choose from 3 pre-built realistic demo receipts (Starbucks Cafe, Campus Bookstore, Whole Foods).
- OCR parsing extracting Merchant, Amount, Date, Category, and itemized lines.
- Review and edit modal before committing to wallet ledger.

### 10. 📊 Analytics & Interactive Reports
- Monthly expense bar chart.
- Cash inflow vs. Cash outflow vs. Net savings comparison chart.
- Spending distribution doughnut chart.
- Daily spending velocity trend line chart.
- Month selector (November 2026, October 2026, September 2026).

### 11. 🧾 Transaction History & Receipts
- Comprehensive transaction table with filter tabs.
- Export transaction history to CSV format.
- Click any transaction to view, print, or download a digital receipt slip.

### 12. ⚡ Demo Mode & Reset Functionality
- Prominently labeled **DEMO MODE** badge with a 1-click **Reset Demo Data** button in the header and settings to reset all balances and goals back to initial state for repeated live evaluations.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🗄️ Database & Supabase Schema
The complete PostgreSQL schema with Row Level Security (RLS) is located in [`supabase/schema.sql`](supabase/schema.sql).
By default, PocketZapp AI features high-reliability atomic local persistence. To sync with a live Supabase instance, enter your Supabase URL and Anon Key in **Settings -> Supabase DB**.
