import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Save, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const DEFAULT_PARAMS = {
  scheduleVarianceThreshold: '5',
  costVarianceThreshold: '3.5',
  aiConfidenceThreshold: '85',
  syncIntervalHours: '24',
};

export const ParametersSection = () => {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Operational Tolerance & Automated Risk Thresholds
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calibrate early warning trigger sensitivities, AI confidence scores, and telemetry polling windows.
              </p>
            </div>
          </div>

          <span className="font-mono text-3xs px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-slate-600 dark:text-slate-300">
            Rule Engine: <strong className="text-blue-600 dark:text-blue-400">Deterministic CPM Model</strong>
          </span>
        </div>

        {/* Parameters Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Schedule Slippage Alert Threshold (Days)"
              type="number"
              value={params.scheduleVarianceThreshold}
              onChange={(e) =>
                setParams({ ...params, scheduleVarianceThreshold: e.target.value })
              }
              helperText="Activities with slippage exceeding this value are automatically flagged as At Risk in schedule views."
              leftIcon={<Sliders className="w-4 h-4" />}
            />

            <Input
              label="Cost & Bill-of-Quantities Variance Tolerance (%)"
              type="number"
              step="0.1"
              value={params.costVarianceThreshold}
              onChange={(e) =>
                setParams({ ...params, costVarianceThreshold: e.target.value })
              }
              helperText="Deviations between planned Bill of Quantities (BOQ) and actual ground installations that trigger warnings."
              leftIcon={<TrendingUp className="w-4 h-4" />}
            />

            <Input
              label="AI Evidence Schedule-Link Auto-Candidate Score (%)"
              type="number"
              value={params.aiConfidenceThreshold}
              onChange={(e) =>
                setParams({ ...params, aiConfidenceThreshold: e.target.value })
              }
              helperText="Confidence score required before presenting schedule linking suggestions to human verifiers."
              leftIcon={<Cpu className="w-4 h-4" />}
            />

            <Input
              label="Field Telemetry Sensor Batch Sync Window (Hours)"
              type="number"
              value={params.syncIntervalHours}
              onChange={(e) =>
                setParams({ ...params, syncIntervalHours: e.target.value })
              }
              helperText="Interval for continuous background batch aggregation from field drone and LiDAR survey nodes."
              leftIcon={<Clock className="w-4 h-4" />}
            />
          </div>

          {savedSuccess && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Operational threshold parameters successfully calibrated and applied.</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleReset}
              className="text-3xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Factory Defaults</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Update Thresholds</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
