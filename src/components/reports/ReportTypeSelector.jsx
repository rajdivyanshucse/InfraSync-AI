import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  FileCheck2, 
  ShieldAlert, 
  BellRing, 
  Compass 
} from 'lucide-react';
import { REPORT_TYPES } from '../../data/reportData';

export const ReportTypeSelector = ({
  selectedReportType,
  onSelectReportType,
}) => {
  const icons = {
    executive: LayoutDashboard,
    schedule: Calendar,
    execution: Activity,
    evidence: FileCheck2,
    risk: ShieldAlert,
    alerts: BellRing,
    spatial: Compass,
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {Object.values(REPORT_TYPES).map((type) => {
          const Icon = icons[type.id] || LayoutDashboard;
          const isSelected = selectedReportType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelectReportType(type.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-surface-subtle hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{type.shortName}</span>
              <span
                className={`font-mono text-3xs px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/20 text-sky-100' : 'bg-surface-subtle text-slate-500 dark:text-slate-400 border border-surface-border'
                }`}
              >
                {type.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

