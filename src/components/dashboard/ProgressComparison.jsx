import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { CalendarRange, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProgressComparison = ({ progressHistory, interpretation, variance }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG Chart Dimensions
  const width = 700;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = 100;

  const getX = (index) => padding.left + (index / (progressHistory.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - (val / maxVal) * chartHeight;

  // Generate SVG path for planned line
  const plannedPath = progressHistory.reduce((acc, point, index) => {
    const x = getX(index);
    const y = getY(point.planned);
    return `${acc} ${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }, '');

  // Generate SVG path for actual line
  const actualPath = progressHistory.reduce((acc, point, index) => {
    const x = getX(index);
    const y = getY(point.actual);
    return `${acc} ${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }, '');

  // Generate SVG Area between actual and baseline
  const actualAreaPath = `${actualPath} L ${getX(progressHistory.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  const isPositiveVariance = variance >= 0;

  return (
    <Card className="bg-surface border-border shadow-panel flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <CardTitle>Planned vs Actual Progress Timeline</CardTitle>
          </div>
          <p className="text-2xs text-foreground-muted">
            Cumulative WBS baseline vs ground execution progress over 8-week lookback
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-2xs font-mono">
          <div className="flex items-center gap-1.5 text-foreground-muted">
            <div className="w-3.5 h-0.5 border-t-2 border-dashed border-sky-500" />
            <span>Planned Baseline</span>
          </div>

          <div className="flex items-center gap-1.5 text-foreground">
            <div className="w-3.5 h-1 rounded bg-emerald-600 dark:bg-emerald-500" />
            <span>Actual Reported</span>
          </div>

          <StatusBadge
            status={isPositiveVariance ? 'onTrack' : variance <= -8 ? 'delayed' : 'warning'}
            label={`${isPositiveVariance ? '+' : ''}${variance}% Variance`}
            size="sm"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* SVG Interactive Chart */}
        <div className="relative w-full overflow-x-auto select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    className="stroke-border"
                    strokeDasharray={val === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-3xs font-mono fill-foreground-muted"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Area Fill under actual curve */}
            <path
              d={actualAreaPath}
              fill={isPositiveVariance ? 'url(#actualGradient)' : 'url(#varianceGradient)'}
            />

            {/* Planned Line (Dashed) */}
            <path
              d={plannedPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Actual Line (Solid) */}
            <path
              d={actualPath}
              fill="none"
              stroke={isPositiveVariance ? '#16a34a' : '#d97706'}
              strokeWidth="2.5"
            />

            {/* Interactive Data Points & Hover Triggers */}
            {progressHistory.map((point, index) => {
              const px = getX(index);
              const pyPlanned = getY(point.planned);
              const pyActual = getY(point.actual);
              const isHovered = hoveredPoint === index;

              return (
                <g key={index}>
                  {/* Vertical Guide Line on Hover */}
                  {isHovered && (
                    <line
                      x1={px}
                      y1={padding.top}
                      x2={px}
                      y2={height - padding.bottom}
                      className="stroke-foreground-muted"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Planned Point */}
                  <circle
                    cx={px}
                    cy={pyPlanned}
                    r={isHovered ? 4.5 : 3}
                    className="fill-surface stroke-sky-500"
                    strokeWidth="2"
                  />

                  {/* Actual Point */}
                  <circle
                    cx={px}
                    cy={pyActual}
                    r={isHovered ? 5.5 : 3.5}
                    className={cn(
                      'fill-surface',
                      isPositiveVariance ? 'stroke-emerald-600 dark:stroke-emerald-400' : 'stroke-amber-600 dark:stroke-amber-400'
                    )}
                    strokeWidth="2.5"
                  />

                  {/* X-Axis Label */}
                  <text
                    x={px}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className={cn(
                      'text-3xs font-mono transition-colors',
                      isHovered ? 'fill-foreground font-bold' : 'fill-foreground-muted'
                    )}
                  >
                    {point.period}
                  </text>

                  {/* Large Hover Hitbox */}
                  <rect
                    x={px - 20}
                    y={padding.top}
                    width="40"
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Overlay */}
          {hoveredPoint !== null && (
            <div
              className="absolute pointer-events-none z-20 top-2 bg-surface-elevated border border-border p-2.5 rounded-lg shadow-panel-lg text-2xs space-y-1 font-mono backdrop-blur-md"
              style={{
                left: `${Math.min(Math.max(getX(hoveredPoint) - 60, 20), width - 150)}px`,
              }}
            >
              <div className="font-bold text-foreground text-xs border-b border-border/80 pb-1 flex items-center justify-between gap-3">
                <span>{progressHistory[hoveredPoint].period}</span>
                <span className={cn(
                  progressHistory[hoveredPoint].variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                )}>
                  {progressHistory[hoveredPoint].variance >= 0 ? '+' : ''}{progressHistory[hoveredPoint].variance}% Delta
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-foreground-muted">
                <span className="text-sky-600 dark:text-sky-400">Planned:</span>
                <span className="font-semibold text-foreground">{progressHistory[hoveredPoint].planned}%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-foreground-muted">
                <span className="text-emerald-600 dark:text-emerald-400">Actual:</span>
                <span className="font-semibold text-foreground">{progressHistory[hoveredPoint].actual}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Executive Interpretation Callout */}
        <div className="p-3 rounded-lg bg-surface-subtle border border-border flex items-start gap-2.5 text-xs">
          <div className="p-1 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 shrink-0 mt-0.5">
            {isPositiveVariance ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="space-y-0.5">
            <span className="font-mono text-2xs font-semibold uppercase text-brand-700 dark:text-brand-400 block">
              Executive Variance Analysis
            </span>
            <p className="text-foreground leading-relaxed text-2xs sm:text-xs">
              {interpretation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
