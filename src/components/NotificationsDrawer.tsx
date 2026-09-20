import React from 'react';
import { X, Bell, Flame, CheckCheck, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  matchId: string;
  time: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'score' | 'end_quarter' | 'alert';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectMatch: (matchId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectMatch
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0c111c] border-l border-white/10 h-full p-6 flex flex-col shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 font-black text-base text-white">
            <Bell className="w-5 h-5 text-orange-400" />
            <span>Alertes Live FIBB</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-orange-400 hover:text-orange-300 font-bold px-2 py-1 rounded-lg bg-white/5 transition flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout lire
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Aucune notification récente pour le moment.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectMatch(n.matchId);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer group ${
                  n.isRead
                    ? 'bg-white/[0.02] border-white/5 text-slate-400'
                    : 'bg-white/5 border-orange-500/30 text-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-extrabold text-orange-400 flex items-center gap-1.5">
                    {n.type === 'score' ? <Flame className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300 group-hover:text-white">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-500 text-center">
          Alertes automatiques en temps réel du Championnat National FIBB
        </div>
      </div>
    </div>
  );
};
