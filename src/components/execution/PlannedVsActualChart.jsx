import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const PlannedVsActualChart = ({
  timelinePoints = [],
  variance = 0,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!timelinePoints || timelinePoints.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card/80 p-8 text-center text-slate-400">
        No schedule timeline checkpoints available for this project.
      </div>
    );
  }

  // SVG dimensions
  const width = 800;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const pointCount = timelinePoints.length;
  const stepX = pointCount > 1 ? chartWidth / (pointCount - 1) : chartWidth;

  // Coordinate mapper
  const getX = (index) => paddingLeft + index * stepX;
  const getY = (val) => paddingTop + chartHeight - (val / 100) * chartHeight;

  // Build SVG path strings
  const plannedPathD = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.plannedProgress)}`)
    .join(' ');

  const actualPathD = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.actualProgress)}`)
    .join(' ');

  // Variance area path between planned and actual
  const varianceAreaD = `${plannedPathD} ${[...timelinePoints]
    .reverse()
    .map((p, i) => `L ${getX(timelinePoints.length - 1 - i)} ${getY(p.actualProgress)}`)
    .join(' ')} Z`;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 p-5 shadow-lg backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Planned Baseline vs Actual Progress Timeline (S-Curve)
            </h3>
          </div>
          <p className="mt-0.5 text-3xs text-slate-400">
            Cumulative progress progression along contractual milestones and reporting checkpoints.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-2xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            <span className="text-slate-300">Planned Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-emerald-300">Actual Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/20 border border-amber-500/40" />
            <span className="text-slate-400">Variance Gap</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-surface-subtle/50 p-2 border border-surface-border/60">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
        >
          <defs>
            {/* Gradient for variance area */}
            <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>

            {/* Glow filters */}
            <filter id="glowPlanned" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.5" />
            </filter>
            <filter id="glowActual" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10b981" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines (Horizontal 0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = getY(pct);
            return (
              <g key={pct}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-500"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* Variance Shaded Area */}
          <path d={varianceAreaD} fill="url(#varianceGradient)" />

          {/* Planned Line (Dashed Blue) */}
          <path
            d={plannedPathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            filter="url(#glowPlanned)"
          />

          {/* Actual Line (Solid Emerald) */}
          <path
            d={actualPathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glowActual)"
          />

          {/* Data Points on checkpoints */}
          {timelinePoints.map((pt, idx) => {
            const cx = getX(idx);
            const cyPlan = getY(pt.plannedProgress);
            const cyAct = getY(pt.actualProgress);
            const isHovered = hoveredPoint?.id === pt.id;

            return (
              <g key={pt.id}>
                {/* Vertical guide line */}
                <line
                  x1={cx}
                  y1={paddingTop}
                  x2={cx}
                  y2={paddingTop + chartHeight}
                  stroke={isHovered ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.08)'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                />

                {/* Planned point marker */}
                <circle
                  cx={cx}
                  cy={cyPlan}
                  r={isHovered ? 5 : 3.5}
                  fill="#1e293b"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Actual point marker */}
                <circle
                  cx={cx}
                  cy={cyAct}
                  r={isHovered ? 6 : 4.5}
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                />

                {/* Current reporting point badge if applicable */}
                {pt.isReportingPoint && (
                  <g>
                    <circle cx={cx} cy={cyAct} r="10" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                    <rect
                      x={cx - 30}
                      y={cyAct - 24}
                      width="60"
                      height="16"
                      rx="3"
                      fill="#047857"
                      fillOpacity="0.9"
                    />
                    <text
                      x={cx}
                      y={cyAct - 12}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-white"
                    >
                      CURRENT
                    </text>
                  </g>
                )}

                {/* X-axis Labels */}
                <text
                  x={cx}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  className={`text-[9.5px] font-mono ${isHovered ? 'fill-emerald-300 font-bold' : 'fill-slate-400'}`}
                >
                  {pt.date || `P${idx + 1}`}
                </text>

                <text
                  x={cx}
                  y={paddingTop + chartHeight + 28}
                  textAnchor="middle"
                  className="text-[8.5px] fill-slate-500 max-w-[60px] truncate"
                >
                  {pt.code || pt.label?.slice(0, 10)}
                </text>

                {/* Transparent hit area for hover */}
                <rect
                  x={cx - stepX / 2}
                  y={paddingTop}
                  width={stepX}
                  height={chartHeight + 35}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip HUD on Hover */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 z-10 w-72 rounded-lg border border-surface-border bg-surface-card/95 p-3 shadow-xl backdrop-blur-md animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-1.5">
              <span className="font-mono text-3xs font-bold text-brand-300">
                {hoveredPoint.code || hoveredPoint.id}
              </span>
              <span className="text-3xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {hoveredPoint.date}
              </span>
            </div>

            <p className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
              {hoveredPoint.label}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-surface-border/60 text-center font-mono">
              <div className="rounded bg-surface/80 p-1.5 border border-surface-border">
                <span className="text-3xs text-slate-400 block">Planned</span>
                <span className="text-xs font-bold text-blue-400">
                  {hoveredPoint.plannedProgress}%
                </span>
              </div>
              <div className="rounded bg-surface/80 p-1.5 border border-surface-border">
                <span className="text-3xs text-slate-400 block">Actual</span>
                <span className="text-xs font-bold text-emerald-400">
                  {hoveredPoint.actualProgress}%
                </span>
              </div>
              <div className="rounded bg-surface/80 p-1.5 border border-surface-border">
                <span className="text-3xs text-slate-400 block">Variance</span>
                <span className={`text-xs font-bold ${
                  hoveredPoint.variance < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {hoveredPoint.variance > 0 ? `+${hoveredPoint.variance}%` : `${hoveredPoint.variance}%`}
                </span>
              </div>
            </div>

            {hoveredPoint.criticalPath && (
              <div className="mt-2 flex items-center gap-1.5 text-3xs font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                <AlertCircle className="h-3 w-3" />
                Critical Path Milestone
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Footer Commentary */}
      <div className="flex flex-col gap-2 rounded-lg bg-surface-subtle/40 p-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between border border-surface-border/50">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>
            Current project execution is{' '}
            <strong className={variance < -5 ? 'text-rose-400 font-mono' : variance > 5 ? 'text-emerald-400 font-mono' : 'text-slate-200 font-mono'}>
              {Math.abs(variance)} percentage points {variance < 0 ? 'behind' : 'ahead of'}
            </strong>{' '}
            the approved Primavera P6 schedule baseline.
          </span>
        </div>
        <div className="font-mono text-3xs text-slate-500">
          Baseline S-Curve Integration
        </div>
      </div>
    </div>
  );
};
