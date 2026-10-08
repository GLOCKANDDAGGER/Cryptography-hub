import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  TrendingUp,
  Shield,
  ArrowRightLeft,
  UserCheck,
  AlertCircle,
  ExternalLink,
  Clock,
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    notifications,
    notificationModalOpen,
    setNotificationModalOpen,
    selectedNotification,
    setSelectedNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActivePage,
  } = useApp();

  if (!notificationModalOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'INVESTMENT':
        return <TrendingUp className="w-4 h-4 text-[#FFA000]" />;
      case 'TRANSACTION':
        return <ArrowRightLeft className="w-4 h-4 text-emerald-400" />;
      case 'SECURITY':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'ACCOUNT':
        return <UserCheck className="w-4 h-4 text-indigo-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setNotificationModalOpen(false);
    if (notif.destinationAction) {
      setActivePage(notif.destinationAction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0B0F19] border border-[#1E293B] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0D1424]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#FFA000]/10 border border-[#FFA000]/30 flex items-center justify-center text-[#FFA000]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">System & Account Notifications</h3>
              <p className="text-xs text-slate-400 font-mono">
                Authoritative multi-device alert ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={() => markAllNotificationsAsRead()}
                className="px-2.5 py-1 text-xs font-mono text-[#FFA000] hover:bg-[#FFA000]/10 rounded border border-[#FFA000]/30 flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            )}
            <button
              onClick={() => {
                setNotificationModalOpen(false);
                setSelectedNotification(null);
              }}
              className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-800/40">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bell className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No Notifications</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your portfolio alerts, deposit confirmations, and hourly investment updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`pt-3 first:pt-0 transition-all ${
                  notif.isRead ? 'opacity-80' : 'opacity-100'
                }`}
              >
                <div
                  className={`p-3.5 rounded-lg border transition-all ${
                    notif.isRead
                      ? 'bg-[#080C14] border-slate-800/80 hover:border-slate-700'
                      : 'bg-[#0D1525] border-[#FFA000]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#FFA000] inline-block animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                          <span className="uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {notif.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-[11px] font-mono text-[#FFA000] hover:underline cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      {notif.destinationAction && (
                        <button
                          onClick={() => handleActionClick(notif)}
                          className="px-2.5 py-1 text-[11px] font-bold text-black bg-[#FFA000] hover:bg-[#FFB300] rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#1E293B] bg-[#080C14] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>{notifications.filter((n) => !n.isRead).length} unread alerts</span>
          <button
            onClick={() => setNotificationModalOpen(false)}
            className="text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
