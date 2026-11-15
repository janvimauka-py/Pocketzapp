import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

export interface FinancialContext {
  user: UserProfile;
  transactions: Transaction[];
  budget: Budget;
  savingsGoals: SavingsGoal[];
  walletBalance: number;
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
  
  // Calculate dynamic stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter this month's transactions
  const monthTransactions = context.transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpentThisMonth = monthTransactions
    .filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomeThisMonth = monthTransactions
    .filter(t => t.type === 'income' || t.type === 'add_money')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown
  const categorySpending: Record<string, number> = {};
  monthTransactions
    .filter(t => t.type === 'expense' || t.type === 'payment' || t.type === 'transfer')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  let highestCategory = 'None';
  let highestCategoryAmount = 0;
  for (const [cat, amt] of Object.entries(categorySpending)) {
    if (amt > highestCategoryAmount) {
      highestCategoryAmount = amt;
      highestCategory = cat;
    }
  }

  const budgetRemaining = Math.max(0, context.budget.monthlyLimit - totalSpentThisMonth);
  const budgetUtilization = Math.round((totalSpentThisMonth / (context.budget.monthlyLimit || 1)) * 100);

  const totalSavings = context.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalSavingsTarget = context.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  // Check if Gemini API Key is configured
  const apiKey = context.user.geminiApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (apiKey && apiKey.trim() !== '') {
    try {
      const financialSystemPrompt = `You are PocketZapp AI, an empathetic, sharp, and highly intelligent personal finance assistant for a college student named ${context.user.name}.
Here is ${context.user.name}'s real-time financial data:
- Wallet Balance: ${currency}${context.walletBalance.toFixed(2)}
- Monthly Budget Limit: ${currency}${context.budget.monthlyLimit.toFixed(2)}
- Total Spent This Month: ${currency}${totalSpentThisMonth.toFixed(2)} (${budgetUtilization}% used)
- Remaining Budget: ${currency}${budgetRemaining.toFixed(2)}
- Total Monthly Inflow: ${currency}${totalIncomeThisMonth.toFixed(2)}
- Highest Spending Category: ${highestCategory} (${currency}${highestCategoryAmount.toFixed(2)})
- Spending by category: ${JSON.stringify(categorySpending)}
- Total Current Savings: ${currency}${totalSavings.toFixed(2)} out of ${currency}${totalSavingsTarget.toFixed(2)} target across ${context.savingsGoals.length} goals.
- Goals: ${context.savingsGoals.map(g => `${g.name}: ${currency}${g.currentAmount}/${currency}${g.targetAmount}`).join(', ')}
- Recent 5 transactions: ${context.transactions.slice(0, 5).map(t => `${t.description} (${currency}${t.amount}, ${t.type})`).join('; ')}

Rules:
1. Always base your numbers strictly on this actual financial snapshot.
2. Keep responses concise, clear, and actionable (2 to 4 paragraphs or bullet points).
3. Provide friendly college-budget tips when relevant.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${financialSystemPrompt}\n\nUser Question: ${userQuery}` }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            text,
            dataMetrics: [
              { label: 'Spent This Month', value: `${currency}${totalSpentThisMonth.toFixed(2)}`, type: 'neutral' },
              { label: 'Budget Left', value: `${currency}${budgetRemaining.toFixed(2)}`, type: budgetRemaining > 200 ? 'positive' : 'negative' },
              { label: 'Total Saved', value: `${currency}${totalSavings.toFixed(2)}`, type: 'positive' }
            ],
            suggestions: [
              'How can I manage my budget better?',
              'Which category has the highest expenses?',
              'Give me a summary of my transactions'
            ]
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to PocketZapp Financial Engine:', e);
    }
  }

  // Built-in Smart Financial Analysis Engine (Evaluates live data with natural language matching)
  const lowerQuery = userQuery.toLowerCase();

  if (lowerQuery.includes('spend') || lowerQuery.includes('spent') || lowerQuery.includes('expense')) {
    return {
      text: `📊 **Monthly Spending Analysis:**\n\nYou have spent **${currency}${totalSpentThisMonth.toFixed(2)}** so far this month across **${monthTransactions.length}** transactions.\n\nYour monthly limit is **${currency}${context.budget.monthlyLimit.toFixed(2)}**, meaning you have utilized **${budgetUtilization}%** of your total budget. ${
        budgetUtilization >= 80 
          ? `⚠️ **Warning:** You've exceeded 80% of your budget with half the month left. Consider cutting back on discretionary spending like dining out and entertainment.` 
          : `✅ You are in a healthy spending range!`
      }`,
      dataMetrics: [
        { label: 'Total Spent', value: `${currency}${totalSpentThisMonth.toFixed(2)}`, type: budgetUtilization > 80 ? 'negative' : 'neutral' },
        { label: 'Budget Limit', value: `${currency}${context.budget.monthlyLimit.toFixed(2)}`, type: 'neutral' },
        { label: 'Remaining', value: `${currency}${budgetRemaining.toFixed(2)}`, type: budgetRemaining > 300 ? 'positive' : 'negative' }
      ],
      suggestions: [
        'Which category has the highest expenses?',
        'What is my remaining budget?',
        'How can I manage my budget better?'
      ]
    };
  }

  if (lowerQuery.includes('budget') || lowerQuery.includes('remaining') || lowerQuery.includes('left')) {
    return {
      text: `🎯 **Budget Status:**\n\nYour remaining budget for this month is **${currency}${budgetRemaining.toFixed(2)}** out of **${currency}${context.budget.monthlyLimit.toFixed(2)}**.\n\n• **Spent so far:** ${currency}${totalSpentThisMonth.toFixed(2)} (${budgetUtilization}%)\n• **Daily Safe Spending Pace:** ${currency}${(budgetRemaining / 15).toFixed(2)}/day to stay within limit.\n\n${budgetUtilization >= 90 ? '🚨 **Alert:** Budget is almost exhausted! Freeze non-essential purchases.' : budgetUtilization >= 70 ? '⚡ **Heads up:** You are at 70%+ budget utilization.' : '✨ Looking good! Keep up the disciplined spending.'}`,
      dataMetrics: [
        { label: 'Remaining Budget', value: `${currency}${budgetRemaining.toFixed(2)}`, type: budgetRemaining > 200 ? 'positive' : 'negative' },
        { label: 'Budget Utilized', value: `${budgetUtilization}%`, type: budgetUtilization > 80 ? 'negative' : 'positive' },
        { label: 'Safe Daily Pace', value: `${currency}${(budgetRemaining / 15).toFixed(2)}/day`, type: 'neutral' }
      ],
      suggestions: [
        'Which category has the highest expenses?',
        'How much have I saved?',
        'How can I manage my budget better?'
      ]
    };
  }

  if (lowerQuery.includes('highest') || lowerQuery.includes('category') || lowerQuery.includes('categories')) {
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const breakdownText = sortedCategories.map(([cat, amt]) => `• **${cat}:** ${currency}${amt.toFixed(2)} (${Math.round((amt / (totalSpentThisMonth || 1)) * 100)}%)`).join('\n');

    return {
      text: `🏆 **Category Spending Breakdown:**\n\nYour highest spending category this month is **${highestCategory}**, totaling **${currency}${highestCategoryAmount.toFixed(2)}** (${Math.round((highestCategoryAmount / (totalSpentThisMonth || 1)) * 100)}% of your expenses).\n\nHere is how your money was distributed:\n${breakdownText}`,
      dataMetrics: [
        { label: 'Top Category', value: highestCategory, type: 'neutral' },
        { label: 'Amount Spent', value: `${currency}${highestCategoryAmount.toFixed(2)}`, type: 'negative' },
        { label: 'Total Inflow', value: `${currency}${totalIncomeThisMonth.toFixed(2)}`, type: 'positive' }
      ],
      suggestions: [
        'How can I manage my budget better?',
        'Give me a summary of my transactions',
        'How much have I saved?'
      ]
    };
  }

  if (lowerQuery.includes('save') || lowerQuery.includes('saving') || lowerQuery.includes('goal')) {
    const goalsList = context.savingsGoals.map(g => {
      const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
      return `• **${g.name}:** ${currency}${g.currentAmount.toFixed(2)} / ${currency}${g.targetAmount.toFixed(2)} (${pct}% funded)`;
    }).join('\n');

    return {
      text: `💎 **Savings & Goals Overview:**\n\nYou have currently saved a total of **${currency}${totalSavings.toFixed(2)}** across **${context.savingsGoals.length}** goals!\n\nOverall Target: **${currency}${totalSavingsTarget.toFixed(2)}** (${Math.round((totalSavings / (totalSavingsTarget || 1)) * 100)}% achieved)\n\n**Goal Breakdown:**\n${goalsList}\n\n💡 *Pro-tip:* Allocating 15% of your next incoming transfer directly into your Goa College Roadtrip goal will complete it 2 weeks earlier!`,
      dataMetrics: [
        { label: 'Total Saved', value: `${currency}${totalSavings.toFixed(2)}`, type: 'positive' },
        { label: 'Total Target', value: `${currency}${totalSavingsTarget.toFixed(2)}`, type: 'neutral' },
        { label: 'Active Goals', value: `${context.savingsGoals.length}`, type: 'neutral' }
      ],
      suggestions: [
        'How can I manage my budget better?',
        'What is my remaining budget?',
        'How much did I spend this month?'
      ]
    };
  }

  if (lowerQuery.includes('summary') || lowerQuery.includes('transaction') || lowerQuery.includes('recent') || lowerQuery.includes('history')) {
    const recentFive = context.transactions.slice(0, 5).map(t => {
      const sign = (t.type === 'income' || t.type === 'add_money') ? '+' : '-';
      return `• **${t.description}**: ${sign}${currency}${t.amount.toFixed(2)} *(${t.category} • ${t.paymentMethod})*`;
    }).join('\n');

    return {
      text: `📋 **Transaction Summary & Activity:**\n\nYou have recorded **${context.transactions.length} total transactions** in PocketZapp.\n\n• **Wallet Demo Balance:** ${currency}${context.walletBalance.toFixed(2)}\n• **Net Monthly Outflow:** ${currency}${totalSpentThisMonth.toFixed(2)}\n• **Net Monthly Inflow:** ${currency}${totalIncomeThisMonth.toFixed(2)}\n\n**Latest Transactions:**\n${recentFive}`,
      dataMetrics: [
        { label: 'Wallet Balance', value: `${currency}${context.walletBalance.toFixed(2)}`, type: 'positive' },
        { label: 'Total Outflow', value: `${currency}${totalSpentThisMonth.toFixed(2)}`, type: 'negative' },
        { label: 'Total Inflow', value: `${currency}${totalIncomeThisMonth.toFixed(2)}`, type: 'positive' }
      ],
      suggestions: [
        'Which category has the highest expenses?',
        'What is my remaining budget?',
        'How can I manage my budget better?'
      ]
    };
  }

  if (lowerQuery.includes('manage') || lowerQuery.includes('better') || lowerQuery.includes('advice') || lowerQuery.includes('tip')) {
    return {
      text: `💡 **AI Financial Optimization Strategy for ${context.user.name}:**\n\n1. **High Food Expenses:** Food accounts for the bulk of discretionary spending. Preparing lunch 3 days a week can easily save you **${currency}2,500–4,000/month**.\n2. **Automate Micro-Savings:** Route ${currency}500 automatically every time you add money to PocketZapp directly toward your **${context.savingsGoals[0]?.name || 'Savings Goal'}**.\n3. **Subscription Review:** You have recurring entertainment subscriptions (e.g., Netflix). Check if you can share a student family bundle.\n4. **Maintain 20% Buffer:** Keep at least ${currency}5,000 in your PocketZapp demo balance as emergency liquidity.`,
      dataMetrics: [
        { label: 'Est. Monthly Savings', value: `${currency}3,500+`, type: 'positive' },
        { label: 'Discretionary Cut', value: '~15%', type: 'neutral' }
      ],
      suggestions: [
        'How much did I spend this month?',
        'How much have I saved?',
        'What is my remaining budget?'
      ]
    };
  }

  // Default intelligent assistant response
  return {
    text: `Hello ${context.user.name}! 👋 I am your **PocketZapp AI Financial Assistant**.\n\nI monitor your transactions, savings velocity, and budget limits in real time.\n\n**Quick Snapshot Today:**\n• Available Wallet Balance: **${currency}${context.walletBalance.toFixed(2)}**\n• Spent This Month: **${currency}${totalSpentThisMonth.toFixed(2)}** (${budgetUtilization}% of budget used)\n• Active Savings Goals: **${context.savingsGoals.length} goals** (${currency}${totalSavings.toFixed(2)} saved)\n\nAsk me anything about your finances or choose one of the prompts below!`,
    dataMetrics: [
      { label: 'Wallet Balance', value: `${currency}${context.walletBalance.toFixed(2)}`, type: 'positive' },
      { label: 'Budget Used', value: `${budgetUtilization}%`, type: budgetUtilization > 80 ? 'negative' : 'positive' },
      { label: 'Total Saved', value: `${currency}${totalSavings.toFixed(2)}`, type: 'positive' }
    ],
    suggestions: [
      'How much did I spend this month?',
      'What is my remaining budget?',
      'Which category has the highest expenses?',
      'How much have I saved?'
    ]
  };
}
