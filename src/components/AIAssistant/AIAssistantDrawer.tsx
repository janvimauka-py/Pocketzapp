import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  ArrowUpRight, 
  CheckCircle, 
  HelpCircle, 
  ShieldCheck, 
  Key,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AIChatMessage, UserProfile, Transaction, Budget, SavingsGoal } from '../../types';
import { askPocketZappAI, FinancialContext } from '../../services/aiService';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  transactions: Transaction[];
  budget: Budget;
  savingsGoals: SavingsGoal[];
  walletBalance: number;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  user,
  transactions,
  budget,
  savingsGoals,
  walletBalance,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `Hello ${user.name.split(' ')[0]}! 👋 I am **PocketZapp AI**, your personal digital wallet and financial advisor.\n\nI analyze your live transactions, monthly budget, and savings vaults in real time to give you grounded, accurate insights.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How much did I spend this month?',
        'What is my remaining budget?',
        'Which category has the highest expenses?',
        'How much have I saved?',
        'How can I manage my budget better?',
        'Give me a summary of my transactions.',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const financialContext: FinancialContext = {
    user,
    transactions,
    budget,
    savingsGoals,
    walletBalance,
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: AIChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await askPocketZappAI(textToSend, financialContext);
      const assistantMessage: AIChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dataMetrics: response.dataMetrics,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          text: 'Apologies, I encountered a temporary issue analyzing your data. Please check your query or settings.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-4 sm:p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-md shadow-rose-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-white">PocketZapp AI</h2>
                <span className="rounded-full bg-rose-500/30 border border-rose-400/40 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-rose-200">
                  Live Advisor
                </span>
              </div>
              <p className="text-[11px] text-blue-200">Real-Time College Finance Copilot</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Context Banner */}
        <div className="flex items-center justify-between bg-blue-50/80 px-4 py-2 border-b border-blue-100 text-[11px] text-blue-800 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Analyzing {transactions.length} transactions & {savingsGoals.length} savings vaults</span>
          </div>
          <span className="rounded bg-blue-200/60 px-1.5 py-0.2 font-bold text-[10px] text-blue-900">
            Ground Truth Active
          </span>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text}
                  </div>

                  {/* Render Data Metrics Tags if present */}
                  {msg.dataMetrics && msg.dataMetrics.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                      {msg.dataMetrics.map((dm, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-50 p-2 border border-slate-100 text-center">
                          <span className="text-[10px] font-semibold text-slate-400 block truncate">
                            {dm.label}
                          </span>
                          <span
                            className={`text-xs font-black ${
                              dm.type === 'positive'
                                ? 'text-emerald-600'
                                : dm.type === 'negative'
                                ? 'text-rose-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {dm.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`mt-2 block text-[10px] text-right font-medium ${
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Prompt Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && !isUser && (
                  <div className="flex flex-wrap gap-1.5 max-w-[90%] pt-1">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="rounded-xl border border-blue-200/80 bg-white hover:bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 shadow-2xs transition-all active:scale-95 text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200/80 p-3 max-w-[120px]">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Analyzing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about spending, budget, or advice..."
              disabled={isTyping}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-1.5 text-center text-[10px] text-slate-400">
            PocketZapp AI combines deterministic ledger analytics with Google Gemini LLM reasoning.
          </p>
        </div>

      </div>
    </div>
  );
};
