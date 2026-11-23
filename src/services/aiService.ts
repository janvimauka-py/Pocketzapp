import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

export interface FinancialContext {
  user: UserProfile;
  transactions: Transaction[];
  budget: Budget;
  savingsGoals: SavingsGoal[];
  walletBalance: number;
}

/** Build a compact financial snapshot string for Gemini's system context */
function buildFinancialSnapshot(context: FinancialContext, currency: string): string {
  const now = new Date();
  const monthTxs = context.transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalSpent = monthTxs
    .filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const totalIncome = monthTxs
    .filter(t => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const categorySpending: Record<string, number> = {};
  monthTxs.filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .forEach(t => { categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount; });

  const budgetUsed = Math.round((totalSpent / (context.budget.monthlyLimit || 1)) * 100);
  const budgetLeft = Math.max(0, context.budget.monthlyLimit - totalSpent);
  const totalSaved = context.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = context.savingsGoals.reduce((s, g) => s + g.targetAmount, 0);

  return `
You are PocketZapp AI — a smart, friendly personal finance assistant for a college student named ${context.user.name}.
Always reply in a helpful, concise, human tone. Use INR (${currency}) for all amounts.
Keep responses to 2–4 short paragraphs or bullet points. Use markdown bold for numbers.

## ${context.user.name}'s Live Financial Snapshot:
- Wallet Balance: ${currency}${context.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Monthly Budget Limit: ${currency}${context.budget.monthlyLimit.toLocaleString('en-IN')}
- Spent This Month: ${currency}${totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${budgetUsed}% used)
- Budget Remaining: ${currency}${budgetLeft.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Monthly Inflow: ${currency}${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
- Spending by Category: ${JSON.stringify(categorySpending)}
- Total Saved: ${currency}${totalSaved.toLocaleString('en-IN')} / ${currency}${totalTarget.toLocaleString('en-IN')} across ${context.savingsGoals.length} goals
- Savings Goals: ${context.savingsGoals.map(g => `${g.name} (${currency}${g.currentAmount}/${currency}${g.targetAmount})`).join(', ')}
- Recent Transactions (last 5): ${context.transactions.slice(0, 5).map(t => `${t.description} (${currency}${t.amount}, ${t.type})`).join('; ')}

Always base every number on this actual data. Never invent figures.
  `.trim();
}

export async function askPocketZappAI(
  userQuery: string,
  context: FinancialContext
): Promise<{
  text: string;
  dataMetrics?: { label: string; value: string; type?: 'positive' | 'negative' | 'neutral' }[];
  suggestions?: string[];
}> {
  const currency = context.user.currency || '₹';

  // ── Compute key stats (used by both Gemini and fallback engine) ──────────
  const now = new Date();
  const monthTxs = context.transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalSpentThisMonth = monthTxs
    .filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((s, t) => s + t.amount, 0);

  const totalIncomeThisMonth = monthTxs
    .filter(t => t.type === 'income' || t.type === 'add_money')
    .reduce((s, t) => s + t.amount, 0);

  const categorySpending: Record<string, number> = {};
  monthTxs.filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .forEach(t => { categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount; });

  let highestCategory = 'None';
  let highestAmount = 0;
  for (const [cat, amt] of Object.entries(categorySpending)) {
    if (amt > highestAmount) { highestAmount = amt; highestCategory = cat; }
  }

  const budgetRemaining = Math.max(0, context.budget.monthlyLimit - totalSpentThisMonth);
  const budgetUtilization = Math.round((totalSpentThisMonth / (context.budget.monthlyLimit || 1)) * 100);
  const totalSavings = context.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const totalSavingsTarget = context.savingsGoals.reduce((s, g) => s + g.targetAmount, 0);

  const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // ── Standard metrics shown alongside any reply ───────────────────────────
  const standardMetrics = [
    { label: 'Spent This Month', value: fmt(totalSpentThisMonth), type: budgetUtilization > 80 ? 'negative' as const : 'neutral' as const },
    { label: 'Budget Left', value: fmt(budgetRemaining), type: budgetRemaining > 1000 ? 'positive' as const : 'negative' as const },
    { label: 'Total Saved', value: fmt(totalSavings), type: 'positive' as const },
  ];

  const standardSuggestions = [
    'How much did I spend this month?',
    'What is my remaining budget?',
    'Which category has the highest expenses?',
    'How much have I saved?',
  ];

  // ── Try Gemini API (key from env var OR user settings) ───────────────────
  // The key is read from VITE_GEMINI_API_KEY (set in .env.local - never hardcoded)
  // or from the user's optional personal API key saved in settings.
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)
    || context.user.geminiApiKey;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const systemPrompt = buildFinancialSnapshot(context, currency);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser question: ${userQuery}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return {
            text,
            dataMetrics: standardMetrics,
            suggestions: standardSuggestions,
          };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('[PocketZapp AI] Gemini API error:', response.status, errData);
      }
    } catch (err) {
      console.warn('[PocketZapp AI] Gemini fetch failed, using built-in engine:', err);
    }
  }

  // ── Built-in Smart Financial Analysis Engine (fallback) ──────────────────
  const q = userQuery.toLowerCase();

  if (q.includes('spend') || q.includes('spent') || q.includes('expense')) {
    return {
      text: `📊 **Monthly Spending Analysis:**\n\nYou have spent **${fmt(totalSpentThisMonth)}** so far this month across **${monthTxs.length}** transactions.\n\nYour monthly limit is **${fmt(context.budget.monthlyLimit)}**, meaning you have used **${budgetUtilization}%** of your budget. ${budgetUtilization >= 80 ? '⚠️ **Warning:** You\'ve exceeded 80% of your budget — consider cutting back on discretionary spending.' : '✅ You are in a healthy spending range!'}`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  if (q.includes('budget') || q.includes('remaining') || q.includes('left')) {
    return {
      text: `🎯 **Budget Status:**\n\nYour remaining budget is **${fmt(budgetRemaining)}** out of **${fmt(context.budget.monthlyLimit)}**.\n\n• **Spent so far:** ${fmt(totalSpentThisMonth)} (${budgetUtilization}%)\n• **Daily safe pace:** ${fmt(budgetRemaining / Math.max(1, 30 - new Date().getDate()))}/day\n\n${budgetUtilization >= 90 ? '🚨 Budget almost exhausted! Freeze non-essential purchases.' : budgetUtilization >= 70 ? '⚡ Heads up: You\'re at 70%+ utilization.' : '✨ Looking good! Keep up the disciplined spending.'}`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  if (q.includes('category') || q.includes('highest') || q.includes('categories')) {
    const sorted = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const breakdown = sorted.map(([cat, amt]) => `• **${cat}:** ${fmt(amt)} (${Math.round((amt / (totalSpentThisMonth || 1)) * 100)}%)`).join('\n');
    return {
      text: `🏆 **Category Spending Breakdown:**\n\nHighest: **${highestCategory}** at **${fmt(highestAmount)}** (${Math.round((highestAmount / (totalSpentThisMonth || 1)) * 100)}% of expenses).\n\n${breakdown}`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  if (q.includes('save') || q.includes('saving') || q.includes('goal')) {
    const goalLines = context.savingsGoals.map(g => {
      const pct = Math.round((g.currentAmount / (g.targetAmount || 1)) * 100);
      return `• **${g.name}:** ${fmt(g.currentAmount)} / ${fmt(g.targetAmount)} (${pct}%)`;
    }).join('\n');
    return {
      text: `💎 **Savings & Goals Overview:**\n\nTotal saved: **${fmt(totalSavings)}** out of **${fmt(totalSavingsTarget)}** (${Math.round((totalSavings / (totalSavingsTarget || 1)) * 100)}% achieved).\n\n**Goal Breakdown:**\n${goalLines}\n\n💡 Tip: Allocating 15% of your next top-up into your top goal will speed up its completion!`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  if (q.includes('summary') || q.includes('transaction') || q.includes('recent')) {
    const recent = context.transactions.slice(0, 5).map(t => {
      const sign = t.type === 'income' || t.type === 'add_money' ? '+' : '-';
      return `• **${t.description}**: ${sign}${fmt(t.amount)} *(${t.category})*`;
    }).join('\n');
    return {
      text: `📋 **Transaction Summary:**\n\nTotal recorded: **${context.transactions.length} transactions**.\n• Wallet Balance: **${fmt(context.walletBalance)}**\n• Monthly Outflow: **${fmt(totalSpentThisMonth)}**\n• Monthly Inflow: **${fmt(totalIncomeThisMonth)}**\n\n**Latest 5:**\n${recent}`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  if (q.includes('tip') || q.includes('advice') || q.includes('manage') || q.includes('better')) {
    return {
      text: `💡 **AI Financial Tips for ${context.user.name}:**\n\n1. **Meal prep:** Cooking 3 days a week can save ${currency}2,500–4,000/month on food.\n2. **Micro-savings:** Route ${currency}500 to your top savings goal every time you add money.\n3. **Subscriptions:** Share student bundles for streaming services.\n4. **Keep a buffer:** Maintain at least ${currency}5,000 in your wallet for emergencies.`,
      dataMetrics: standardMetrics,
      suggestions: standardSuggestions,
    };
  }

  // Default response
  return {
    text: `Hello ${context.user.name}! 👋 I'm your **PocketZapp AI Financial Assistant**.\n\n**Quick Snapshot:**\n• Wallet Balance: **${fmt(context.walletBalance)}**\n• Spent This Month: **${fmt(totalSpentThisMonth)}** (${budgetUtilization}% of budget)\n• Active Goals: **${context.savingsGoals.length}** (${fmt(totalSavings)} saved)\n\nAsk me anything about your finances or pick a prompt below!`,
    dataMetrics: standardMetrics,
    suggestions: standardSuggestions,
  };
}
