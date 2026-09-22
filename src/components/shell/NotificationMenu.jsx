import React, { useState, useRef, useEffect } from 'react';
import { mockNotifications } from '../../data/mockData';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from '../ui/IconButton';

export const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getNotificationIcon = (variant) => {
    switch (variant) {
      case 'critical':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <div className="relative">
        <IconButton
          aria-label="View notifications"
          variant="ghost"
          size="md"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Bell className="w-4 h-4 text-foreground-muted hover:text-foreground" />
        </IconButton>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white shadow-sm pointer-events-none">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-surface border border-border shadow-panel-lg z-50 animate-slide-up overflow-hidden focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-subtle/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Site & Schedule Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-[10px] font-mono font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/60 p-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'p-3 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer',
                  n.unread ? 'bg-surface-subtle' : 'hover:bg-surface-subtle/60'
                )}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                  );
                }}
              >
                <div className="mt-0.5">{getNotificationIcon(n.variant)}</div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={cn(
                        'text-xs truncate',
                        n.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground-secondary'
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="text-[10px] font-mono text-foreground-muted shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted leading-relaxed">
                    {n.description}
                  </p>
                </div>
                {n.unread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border text-center bg-surface-subtle/40">
            <span className="text-[10px] text-foreground-muted font-mono">
              Live telemetry feed synced
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
