import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  CalendarRange, 
  ShieldCheck, 
  AlertTriangle, 
  FileSpreadsheet, 
  Compass, 
  CheckCircle2, 
  Save, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../ui/Button';

const NOTIF_STORAGE_KEY = 'infrasync_notification_prefs';

const DEFAULT_PREFERENCES = {
  earlyWarnings: true,
  scheduleSlippage: true,
  aiVerification: true,
  alertEscalations: true,
  reportReady: false,
  spatialTelemetry: false,
  inAppBadge: true,
  topBarDrawer: true,
  dailyDigest: false,
};

export const NotificationSection = () => {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to load notification preferences:', e);
    }
    return DEFAULT_PREFERENCES;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist notification preferences:', e);
      }
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to persist notification preferences:', e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    } catch (e) {
      console.warn('Failed to reset notification preferences:', e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const operationalTriggers = [
    {
      key: 'earlyWarnings',
      title: 'Rule-Based Early Warning Triggers',
      description: 'Notify immediately when deterministic rules detect critical path delay exposure or material bottlenecks.',
      icon: ShieldAlert,
      badge: 'Critical Risk',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
    },
    {
      key: 'scheduleSlippage',
      title: 'Primavera P6 Milestone Slippage',
      description: 'Receive alerts when activity finish dates deviate beyond approved baseline variance tolerance.',
      icon: CalendarRange,
      badge: 'Schedule',
      badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
    },
    {
      key: 'aiVerification',
      title: 'AI Evidence Schedule-Link Discoveries',
      description: 'Notify when high-confidence drone LiDAR or 360° photo records are ready for engineer QA sign-off.',
      icon: ShieldCheck,
      badge: 'Verification',
      badgeColor: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
    },
    {
      key: 'alertEscalations',
      title: 'Accountable Human Intervention Escalations',
      description: 'Alert when open site interventions remain unacknowledged past the 24-hour SLA window.',
      icon: AlertTriangle,
      badge: 'Intervention',
      badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
    },
    {
      key: 'reportReady',
      title: 'Intelligence Dossier & Report Generation',
      description: 'Notify when weekly consolidated executive reports are compiled and ready for PDF/CSV export.',
      icon: FileSpreadsheet,
      badge: 'Reports',
      badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
    },
    {
      key: 'spatialTelemetry',
      title: 'Spatial Sector Telemetry Node Alerts',
      description: 'Alert when field capture nodes or survey point sensors in active sectors report offline status.',
      icon: Compass,
      badge: 'Spatial',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Operational Event Triggers */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span>Operational Risk & Schedule Alert Subscriptions</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure event notifications based on your operational responsibilities. Preferences are stored locally.
            </p>
          </div>
          <span className="text-3xs font-mono px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-slate-600 dark:text-slate-300">
            Storage: <strong className="text-emerald-600 dark:text-emerald-400">Browser Synchronized</strong>
          </span>
        </div>

        <div className="space-y-3">
          {operationalTriggers.map((item) => {
            const Icon = item.icon;
            const isEnabled = Boolean(preferences[item.key]);

            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isEnabled
                    ? 'border-surface-border bg-surface-subtle hover:border-blue-500/40'
                    : 'border-surface-border/60 bg-surface/50 opacity-70 hover:opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border mt-0.5 ${
                    isEnabled
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                      : 'bg-surface border-surface-border text-slate-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className={`rounded px-1.5 py-0.2 text-3xs font-mono font-bold uppercase border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center pt-1 shrink-0 ml-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-border">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleReset}
            className="text-3xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to System Defaults</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </Button>
        </div>

        {savedSuccess && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Notification subscriptions successfully saved and persisted.</span>
          </div>
        )}
      </div>
    </div>
  );
};
