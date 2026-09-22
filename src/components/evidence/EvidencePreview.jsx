import React from 'react';
import { 
  Camera, 
  Video, 
  FileText, 
  Ruler, 
  ClipboardCheck, 
  Award, 
  MapPin, 
  HardDrive,
  Info 
} from 'lucide-react';

export const EvidencePreview = ({ evidence }) => {
  if (!evidence) return null;

  const getTypeDetails = (type) => {
    switch (type?.toLowerCase()) {
      case 'photo':
        return {
          icon: Camera,
          label: 'Field High-Resolution Photograph',
          color: 'text-sky-500 dark:text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/20',
        };
      case 'video':
        return {
          icon: Video,
          label: 'Site Inspection Video Walkthrough',
          color: 'text-purple-500 dark:text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
        };
      case 'document':
        return {
          icon: FileText,
          label: 'Engineering Report / Survey Dataset',
          color: 'text-amber-500 dark:text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
        };
      case 'measurement':
        return {
          icon: Ruler,
          label: 'Calibrated Physical Measurement / NDT Scan',
          color: 'text-emerald-500 dark:text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
        };
      case 'inspection':
        return {
          icon: ClipboardCheck,
          label: 'Field QA/QC Checklist & Total Station Audit',
          color: 'text-indigo-500 dark:text-indigo-400',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/20',
        };
      case 'certificate':
        return {
          icon: Award,
          label: 'Official Batch & Mill Test Certificate',
          color: 'text-rose-500 dark:text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
        };
      default:
        return {
          icon: FileText,
          label: 'Field Evidence Record',
          color: 'text-foreground-muted',
          bg: 'bg-surface-subtle',
          border: 'border-surface-border',
        };
    }
  };

  const typeConfig = getTypeDetails(evidence.evidenceType);
  const Icon = typeConfig.icon;

  // If actual media URL exists in backend payload
  const hasRealMedia = Boolean(evidence.mediaUrl || evidence.storage?.url);

  return (
    <div className="space-y-3">
      {hasRealMedia ? (
        <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-subtle">
          {evidence.evidenceType === 'photo' || evidence.evidenceType === 'PHOTO' ? (
            <img 
              src={evidence.mediaUrl || evidence.storage?.url} 
              alt={evidence.title} 
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="p-6 text-center">
              <Icon className="h-10 w-10 mx-auto text-brand-500 mb-2" />
              <p className="text-xs font-semibold text-foreground">{evidence.title}</p>
            </div>
          )}
        </div>
      ) : (
        /* Professional Technical Media Viewer Placeholder */
        <div className={`relative overflow-hidden rounded-xl border ${typeConfig.border} bg-surface-subtle p-6 text-center transition-colors`}>
          <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${typeConfig.border} ${typeConfig.bg} shadow-sm ${typeConfig.color}`}>
              <Icon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-foreground-muted block">
                MEDIA PREVIEW
              </span>
              <h4 className="text-sm font-bold text-foreground max-w-sm mx-auto">
                {evidence.title}
              </h4>
              <p className="text-3xs text-foreground-muted max-w-xs mx-auto">
                Source media unavailable · Evidence metadata remains available for technical inspection.
              </p>
            </div>

            {/* Technical Metadata Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-3xs font-mono text-foreground-muted">
              <span className="rounded bg-surface px-2 py-0.5 border border-surface-border font-semibold text-foreground">
                {evidence.id}
              </span>
              <span className="rounded bg-surface px-2 py-0.5 border border-surface-border">
                {evidence.captureSource}
              </span>
              <span className="rounded bg-surface px-2 py-0.5 border border-surface-border">
                {new Date(evidence.capturedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Factual Prototype Disclaimer */}
            <div className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 text-3xs font-mono text-foreground-muted border border-surface-border">
              <Info className="h-3 w-3 text-sky-500 shrink-0" />
              <span>Prototype record — no binary stream attached</span>
            </div>
          </div>

          {/* Location & File Metadata Strip */}
          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-surface-border pt-2.5 text-3xs font-mono text-foreground-muted">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-500" />
              <span>{evidence.location?.label || 'Project Site Coordinates'}</span>
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3 text-brand-500" />
              <span>{evidence.fileMeta?.fileName || 'evidence-asset.dat'} ({evidence.fileMeta?.sizeKb || 0} KB)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidencePreview;

