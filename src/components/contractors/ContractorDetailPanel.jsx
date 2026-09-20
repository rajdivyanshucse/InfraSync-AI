import React from 'react';
import { 
  X, 
  Layers, 
  HardHat, 
  UserCheck, 
  Mail, 
  Calendar, 
  Activity
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { ContractorPerformance } from './ContractorPerformance';
import { ContractorPackageList } from './ContractorPackageList';
import { Link } from 'react-router-dom';

export const ContractorDetailPanel = ({
  contractor,
  allActivities = [],
  allMicroActivities = [],
  onClose,
}) => {
  if (!contractor) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'active':
        return 'onTrack';
      case 'warning':
        return 'atRisk';
      case 'delayed':
        return 'delayed';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'warning':
        return 'Variance Slip';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-surface-border bg-surface-card/95 shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle/80">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded ring-1 ring-sky-500/20">
              {contractor.code}
            </span>
            <StatusBadge
              status={getStatusVariant(contractor.status)}
              label={getStatusLabel(contractor.status)}
              size="sm"
            />
            <span className="rounded bg-surface-muted/60 px-1.5 py-0.2 font-mono text-3xs text-slate-400">
              {contractor.category}
            </span>
          </div>

          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {contractor.name}
          </h2>

          <p className="text-3xs text-slate-400 font-mono">
            {contractor.contactRole}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Execution Performance Component */}
        <ContractorPerformance contractor={contractor} />

        {/* Ownership & Key Contact */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-2.5">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-sky-400" />
            Contractor Personnel & Mobilization
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface/60 p-2 border border-surface-border/50">
              <span className="text-3xs text-slate-400 font-mono block">Lead Engineer</span>
              <span className="font-semibold text-white mt-0.5 block truncate">
                {contractor.leadEngineer || 'Assigned Lead'}
              </span>
            </div>

            <div className="rounded-lg bg-surface/60 p-2 border border-surface-border/50">
              <span className="text-3xs text-slate-400 font-mono block">Mobilization Date</span>
              <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-500" />
                {contractor.mobilizationDate || '15 Sep 2024'}
              </span>
            </div>
          </div>

          {contractor.contactEmail && (
            <div className="flex items-center gap-1.5 text-3xs font-mono text-slate-400 px-1">
              <Mail className="h-3 w-3 text-slate-500" />
              <span>{contractor.contactEmail}</span>
            </div>
          )}
        </div>

        {/* Disciplines Handled */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-2.5">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardHat className="h-3.5 w-3.5 text-amber-400" />
            Assigned Disciplines & Engineering Trades
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {(contractor.disciplines || []).map((disc) => (
              <span
                key={disc}
                className="rounded-lg bg-surface/80 border border-surface-border px-2.5 py-1 text-xs font-mono text-slate-200"
              >
                {disc}
              </span>
            ))}
          </div>
        </div>

        {/* Package Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            Assigned Work Packages ({(contractor.wbsPackages || []).length})
          </h4>

          <ContractorPackageList
            packages={contractor.wbsPackages || []}
            allActivities={allActivities}
            allMicroActivities={allMicroActivities}
          />
        </div>

        {/* Cross Navigation Action */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-950/20 p-3.5 space-y-2">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-brand-300">
            Cross-Workspace Navigation
          </h4>
          <p className="text-3xs text-slate-400 leading-relaxed">
            Jump directly into the execution tracking workspace filtered to this contractor's micro-activities.
          </p>
          <div className="pt-1">
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              View Execution Units in Progress Workspace
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-surface-border p-3.5 bg-surface-subtle/80 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-400">
          Close Inspector
        </Button>
        <span className="text-3xs font-mono text-slate-500">
          Contractor Responsibility Node
        </span>
      </div>
    </div>
  );
};
