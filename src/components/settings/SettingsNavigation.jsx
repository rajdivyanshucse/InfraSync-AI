import React from 'react';
import { SETTINGS_TABS } from './settingsTabs';

export const SettingsNavigation = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="flex overflow-x-auto rounded-xl border border-surface-border bg-surface-card p-1.5 shadow-sm gap-1 scrollbar-none">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isDanger = tab.danger;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
              isActive
                ? isDanger
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs'
                  : 'bg-surface-subtle text-blue-600 dark:text-blue-400 border border-surface-border font-bold shadow-xs'
                : isDanger
                ? 'text-rose-500/80 hover:text-rose-600 hover:bg-rose-500/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-subtle/60'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? (isDanger ? 'text-rose-500' : 'text-blue-500') : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            <span className={`font-mono text-3xs px-1 py-0.2 rounded border ${
              isActive
                ? isDanger ? 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                : 'bg-surface border-surface-border text-slate-400'
            }`}>
              {tab.code}
            </span>
          </button>
        );
      })}
    </div>
  );
};
