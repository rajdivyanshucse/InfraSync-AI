import React, { useState } from 'react';
import { 
  AlertTriangle, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const DangerZoneSection = ({
  onLogout,
}) => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const handleResetPreferences = () => {
    try {
      localStorage.removeItem('infrasync_notification_prefs');
      localStorage.removeItem('infrasync_theme');
      setActionSuccess('Local UI display and notification preferences have been reset to factory defaults.');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e) {
      console.warn('Failed to reset local preferences:', e);
    }
    setConfirmAction(null);
  };

  const handleClearSession = () => {
    try {
      localStorage.removeItem('infrasync_prototype_auth');
      localStorage.removeItem('infrasync_notification_prefs');
      if (onLogout) onLogout();
      navigate('/login');
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Boundary Notice */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-surface-border pb-3">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Danger Zone & Client Session Governance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reset local browser cache, clear cached prototype state, or terminate active session credentials.
            </p>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 p-4 text-xs space-y-1.5 text-slate-700 dark:text-slate-200 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 font-mono text-3xs uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Client-Side Scope Limitation</span>
          </div>
          <p className="text-3xs">
            Actions in this section exclusively clear your <strong>local browser storage, cached UI preferences, and session tokens</strong>. Authoritative project database entries, Primavera P6 baseline files, verified ground records, and audit logs remain permanently preserved on the enterprise server.
          </p>
        </div>

        {actionSuccess && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Action Cards */}
        <div className="space-y-3 pt-2">
          {/* Action 1: Reset Local Preferences */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-surface-border bg-surface-subtle gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                <span>Reset Display & Notification Preferences</span>
              </h5>
              <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clears custom theme modes, alert subscription toggles, and UI filters back to default values.
              </p>
            </div>

            {confirmAction === 'resetPrefs' ? (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setConfirmAction(null)}
                  className="text-3xs text-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleResetPreferences}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-3xs"
                >
                  Confirm Reset
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => setConfirmAction('resetPrefs')}
                className="text-3xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 shrink-0"
              >
                Reset Preferences
              </Button>
            )}
          </div>

          {/* Action 2: Sign Out & Clear Active Session */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5 gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Terminate Session & Sign Out</span>
              </h5>
              <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clears active authentication tokens, releases session lock, and redirects to the portal login screen.
              </p>
            </div>

            {confirmAction === 'logout' ? (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setConfirmAction(null)}
                  className="text-3xs text-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleClearSession}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-3xs"
                >
                  Confirm Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => setConfirmAction('logout')}
                className="text-3xs text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-950/40 shrink-0"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
