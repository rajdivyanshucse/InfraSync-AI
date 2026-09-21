import React from 'react';
import { 
  Eye, 
  Printer, 
  FileText, 
  FileSpreadsheet 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ReportExportActions = ({
  onOpenPreview,
  onPrint,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. Preview Full Dossier */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onOpenPreview}
        className="gap-1.5 text-xs text-sky-300 hover:text-white"
      >
        <Eye className="h-3.5 w-3.5 text-sky-400" />
        <span>Preview Dossier</span>
      </Button>

      {/* 2. Print Report */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-1.5 text-xs text-slate-300 hover:text-white"
      >
        <Printer className="h-3.5 w-3.5 text-slate-400" />
        <span>Print Report</span>
      </Button>

      {/* 3. Export PDF (Prototype planned state) */}
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-1.5 text-xs text-slate-500 border-surface-border cursor-not-allowed opacity-60"
        >
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          <span>Export PDF</span>
        </Button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 whitespace-nowrap rounded bg-slate-900 border border-surface-border px-2 py-1 text-3xs font-mono text-slate-300 shadow-lg">
          Planned for backend report service (Phase 17+)
        </div>
      </div>

      {/* 4. Export CSV (Prototype planned state) */}
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-1.5 text-xs text-slate-500 border-surface-border cursor-not-allowed opacity-60"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
          <span>Export CSV</span>
        </Button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 whitespace-nowrap rounded bg-slate-900 border border-surface-border px-2 py-1 text-3xs font-mono text-slate-300 shadow-lg">
          Tabular data export planned for backend integration
        </div>
      </div>
    </div>
  );
};
