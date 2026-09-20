import React from 'react';
import { 
  Camera, 
  Video, 
  FileText, 
  Ruler, 
  ClipboardCheck, 
  Award, 
  MapPin, 
  ShieldAlert, 
  HardDrive 
} from 'lucide-react';

export const EvidencePreview = ({ evidence }) => {
  if (!evidence) return null;

  const getTypeDetails = (type) => {
    switch (type) {
      case 'photo':
        return {
          icon: Camera,
          label: 'Field High-Resolution Photograph',
          color: 'text-sky-400',
          bg: 'bg-sky-950/30',
          border: 'border-sky-500/30',
        };
      case 'video':
        return {
          icon: Video,
          label: 'Site Inspection Video Walkthrough',
          color: 'text-purple-400',
          bg: 'bg-purple-950/30',
          border: 'border-purple-500/30',
        };
      case 'document':
        return {
          icon: FileText,
          label: 'Engineering Report / Survey Dataset',
          color: 'text-amber-400',
          bg: 'bg-amber-950/30',
          border: 'border-amber-500/30',
        };
      case 'measurement':
        return {
          icon: Ruler,
          label: 'Calibrated Physical Measurement / NDT Scan',
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/30',
          border: 'border-emerald-500/30',
        };
      case 'inspection':
        return {
          icon: ClipboardCheck,
          label: 'Field QA/QC Checklist & Total Station Audit',
          color: 'text-indigo-400',
          bg: 'bg-indigo-950/30',
          border: 'border-indigo-500/30',
        };
      case 'certificate':
        return {
          icon: Award,
          label: 'Official Batch & Mill Test Certificate',
          color: 'text-rose-400',
          bg: 'bg-rose-950/30',
          border: 'border-rose-500/30',
        };
      default:
        return {
          icon: FileText,
          label: 'Field Evidence Record',
          color: 'text-slate-400',
          bg: 'bg-surface-subtle',
          border: 'border-surface-border',
        };
    }
  };

  const typeConfig = getTypeDetails(evidence.evidenceType);
  const Icon = typeConfig.icon;

  return (
    <div className="space-y-3">
      {/* Visual Canvas Placeholder */}
      <div className={`relative overflow-hidden rounded-xl border ${typeConfig.border} ${typeConfig.bg} p-6 text-center`}>
        {/* Background Grid Pattern Simulation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${typeConfig.border} bg-surface/90 shadow-md ${typeConfig.color}`}>
            <Icon className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-3xs font-bold uppercase tracking-widest text-slate-400 block">
              [ FIELD EVIDENCE PREVIEW ]
            </span>
            <h4 className="text-sm font-bold text-white max-w-sm mx-auto">
              {evidence.title}
            </h4>
            <span className={`inline-block font-mono text-xs font-semibold ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
          </div>

          {/* Technical Metadata Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-3xs font-mono text-slate-300">
            <span className="rounded bg-surface/80 px-2 py-1 border border-surface-border">
              ID: {evidence.id}
            </span>
            <span className="rounded bg-surface/80 px-2 py-1 border border-surface-border">
              Source: {evidence.captureSource}
            </span>
            <span className="rounded bg-surface/80 px-2 py-1 border border-surface-border">
              Captured: {new Date(evidence.capturedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Explicit Prototype Notice */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-3xs font-semibold text-amber-300">
            <ShieldAlert className="h-3 w-3 shrink-0" />
            <span>Prototype preview — no source media attached</span>
          </div>
        </div>

        {/* Location & File Info Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-surface-border/50 pt-3 text-3xs font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span>{evidence.location?.label || 'Project Site Coordinates'}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-sky-400" />
            <span>{evidence.fileMeta?.fileName || 'evidence-record.dat'} ({evidence.fileMeta?.sizeKb || 0} KB)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
