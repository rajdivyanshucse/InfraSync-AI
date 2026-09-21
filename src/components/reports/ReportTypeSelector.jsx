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
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-md backdrop-blur-sm p-3">
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(REPORT_TYPES).map((type) => {
          const Icon = icons[type.id] || LayoutDashboard;
          const isSelected = selectedReportType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelectReportType(type.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white font-bold shadow-md ring-1 ring-sky-400/50'
                  : 'text-slate-300 hover:bg-surface-subtle hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{type.shortName}</span>
              <span
                className={`font-mono text-3xs px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-black/25 text-sky-100' : 'bg-surface-muted text-slate-400'
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
