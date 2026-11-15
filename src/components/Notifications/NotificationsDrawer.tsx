import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'savings':
        return <Sparkles className="h-4 w-4 text-rose-500" />;
      case 'security':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case 'transaction':
        return <ArrowDownLeft className="h-4 w-4 text-emerald-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notifications Center</h2>
              <p className="text-xs text-slate-400">
                {notifications.filter((n) => !n.read).length} unread updates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear list</span>
          </button>
        </div>

        {/* Notification Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-600">All caught up!</p>
              <p className="text-xs">No pending notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.linkAction) {
                    onNavigateTab(n.linkAction);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                  !n.read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-100">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {n.linkAction && (
                        <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                          View details <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
