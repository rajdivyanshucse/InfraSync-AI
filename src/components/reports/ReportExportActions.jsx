import React from 'react';
import { 
  Eye, 
  Printer, 
  FileSpreadsheet, 
  FileCode
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ReportExportActions = ({
  onOpenPreview,
  onPrint,
  onExportCsv,
  onExportJson,
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
        className="gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-white border border-surface-border"
      >
        <Eye className="h-3.5 w-3.5 text-sky-500" />
        <span>Preview Dossier</span>
      </Button>

      {/* 2. Print Report */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
      >
        <Printer className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        <span>Print Report</span>
      </Button>

      {/* 3. Export CSV */}
      {onExportCsv && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          title="Download active report data as CSV spreadsheet"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Export CSV</span>
        </Button>
      )}

      {/* 4. Export JSON Snapshot */}
      {onExportJson && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportJson}
          className="gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hidden sm:inline-flex"
          title="Download structured JSON report snapshot"
        >
          <FileCode className="h-3.5 w-3.5 text-slate-500" />
          <span>JSON</span>
        </Button>
      )}
    </div>
  );
};

