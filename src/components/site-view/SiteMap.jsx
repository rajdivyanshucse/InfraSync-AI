import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui/Button';

export const SiteMap = ({
  siteZones = [],
  capturePoints = [],
  zoneSummaries = [],
  selectedZoneId,
  onSelectZone,
  selectedCapturePointId,
  onSelectCapturePoint,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getPointColor = (status, isSelected) => {
    if (isSelected) return { ring: 'ring-white', fill: 'fill-sky-400', stroke: 'stroke-white', text: 'text-white' };
    switch (status) {
      case 'online':
        return { ring: 'ring-emerald-500/50', fill: 'fill-emerald-500', stroke: 'stroke-emerald-400', text: 'text-emerald-500' };
      case 'offline':
        return { ring: 'ring-rose-500/50', fill: 'fill-rose-500', stroke: 'stroke-rose-400', text: 'text-rose-500' };
      case 'maintenance':
        return { ring: 'ring-amber-500/50', fill: 'fill-amber-500', stroke: 'stroke-amber-400', text: 'text-amber-500' };
      case 'standby':
        return { ring: 'ring-sky-500/50', fill: 'fill-sky-500', stroke: 'stroke-sky-400', text: 'text-sky-500' };
      default:
        return { ring: 'ring-slate-500/50', fill: 'fill-slate-400', stroke: 'stroke-slate-300', text: 'text-slate-400' };
    }
  };

  const getZoneStyling = (zone) => {
    const summary = zoneSummaries.find((zs) => zs.zoneId === zone.id);
    const isSelected = selectedZoneId === zone.id;
    const warningCount = summary?.warnings?.length || 0;
    const isCritical = summary?.zoneStatus?.statusKey === 'critical';
    const isBehind = summary?.zoneStatus?.statusKey === 'behind';

    if (isSelected) {
      return {
        fill: '#0284c7',
        fillOpacity: '0.25',
        stroke: '#0284c7',
        strokeWidth: '0.9',
        textColor: '#0284c7',
        badgeBg: '#0369a1',
      };
    }

    if (isCritical) {
      return {
        fill: '#f43f5e',
        fillOpacity: '0.15',
        stroke: '#f43f5e',
        strokeWidth: '0.6',
        textColor: '#e11d48',
        badgeBg: '#881337',
      };
    }

    if (isBehind || warningCount > 0) {
      return {
        fill: '#f59e0b',
        fillOpacity: '0.12',
        stroke: '#f59e0b',
        strokeWidth: '0.5',
        textColor: '#d97706',
        badgeBg: '#78350f',
      };
    }

    return {
      fill: '#0ea5e9',
      fillOpacity: '0.08',
      stroke: '#0ea5e9',
      strokeWidth: '0.4',
      textColor: '#0284c7',
      badgeBg: '#0f172a',
    };
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface shadow-sm flex flex-col h-[560px]">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface/95 px-3 py-1.5 shadow-sm backdrop-blur-md pointer-events-auto">
          <Compass className="h-4 w-4 text-brand dark:text-sky-400" />
          <span className="font-mono text-xs font-bold text-foreground">
            Corridor Site Plan
          </span>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            WGS84 Datum
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface/95 p-1 shadow-sm backdrop-blur-md pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`h-7 px-2 text-[11px] font-mono gap-1 ${
              showBoundaries ? 'text-brand dark:text-sky-300 bg-brand/10 dark:bg-brand/20' : 'text-foreground-muted'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Zones</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            className={`h-7 px-2 text-[11px] font-mono gap-1 ${
              showLabels ? 'text-brand dark:text-sky-300 bg-brand/10 dark:bg-brand/20' : 'text-foreground-muted'
            }`}
          >
            <span>Labels</span>
          </Button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="rounded p-1 text-foreground-muted hover:text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="rounded p-1 text-foreground-muted hover:text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="rounded p-1 text-foreground-muted hover:text-foreground transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Schematic Map Canvas */}
      <div className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden flex items-center justify-center bg-surface-subtle/30">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-300 select-none"
          style={{ transform: `scale(${zoomLevel})` }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="siteGrid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" className="text-surface-border opacity-50" strokeWidth="0.15" />
            </pattern>
          </defs>

          <rect width="100" height="100" fill="url(#siteGrid)" />

          {/* Project Corridor Linear Alignment Backbone */}
          <path
            d="M 12 85 Q 35 65 50 50 T 88 15"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeDasharray="1.5 1.5"
            className="opacity-25"
          />
          <path
            d="M 12 85 Q 35 65 50 50 T 88 15"
            fill="none"
            stroke="#0284c7"
            strokeWidth="0.8"
            className="opacity-60"
          />

          {/* Chainage / Stationing Marks along Corridor */}
          <g className="opacity-40">
            <text x="8" y="90" fontSize="1.8" fontFamily="monospace" fill="currentColor" className="text-foreground-muted">CH 0+000</text>
            <text x="45" y="55" fontSize="1.8" fontFamily="monospace" fill="currentColor" className="text-foreground-muted">CH 7+000</text>
            <text x="84" y="12" fontSize="1.8" fontFamily="monospace" fill="currentColor" className="text-foreground-muted">CH 14+200</text>
          </g>

          {/* Site Zones Polygons / Bounding Enclosures */}
          {showBoundaries &&
            siteZones.map((zone) => {
              const bounds = zone.mapBounds || { x: 30, y: 30, width: 20, height: 20 };
              const isZoneSelected = selectedZoneId === zone.id;
              const style = getZoneStyling(zone);
              const summary = zoneSummaries.find((zs) => zs.zoneId === zone.id);
              const warningCount = summary?.warnings?.length || 0;
              const actualProgress = summary?.progress?.actualProgress ?? 0;

              return (
                <g
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  onMouseEnter={() => setHoveredZone({ zone, summary })}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    rx="2"
                    fill={style.fill}
                    fillOpacity={style.fillOpacity}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeDasharray={isZoneSelected ? 'none' : '1.5 1'}
                    className="transition-all duration-200 hover:fill-opacity-30"
                  />

                  {/* Zone Header Label */}
                  {showLabels && (
                    <g>
                      <text
                        x={bounds.x + 2}
                        y={bounds.y + 3.8}
                        fontSize="2.4"
                        fill={style.textColor}
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {zone.code}
                      </text>

                      {/* Progress Badge */}
                      <text
                        x={bounds.x + bounds.width - 2}
                        y={bounds.y + 3.8}
                        fontSize="2.0"
                        textAnchor="end"
                        fill="currentColor"
                        className="text-foreground-muted"
                        fontFamily="monospace"
                      >
                        {actualProgress}%
                      </text>

                      {/* Warning Dot Badge if active warnings */}
                      {warningCount > 0 && (
                        <g transform={`translate(${bounds.x + 2.5}, ${bounds.y + bounds.height - 2.5})`}>
                          <circle r="1.4" fill="#f59e0b" />
                          <text
                            y="0.6"
                            textAnchor="middle"
                            fontSize="1.6"
                            fill="#000000"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            !
                          </text>
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

          {/* Capture Points Markers */}
          {capturePoints.map((point) => {
            const coords = point.mapCoords || { x: 50, y: 50 };
            const isSelected = selectedCapturePointId === point.id;
            const style = getPointColor(point.status, isSelected);

            return (
              <g
                key={point.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCapturePoint(point);
                  if (point.zoneId) onSelectZone(siteZones.find((z) => z.id === point.zoneId));
                }}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                {/* Outer Pulsing Aura if selected */}
                {isSelected && (
                  <circle
                    r="5"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="0.4"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  r={isSelected ? '3.2' : '2.4'}
                  fill="#ffffff"
                  stroke={isSelected ? '#0284c7' : '#94a3b8'}
                  strokeWidth={isSelected ? '0.8' : '0.4'}
                  className="shadow-sm"
                />

                {/* Inner Core Status Dot */}
                <circle
                  r={isSelected ? '1.8' : '1.2'}
                  className={`${style.fill} ${style.stroke}`}
                  strokeWidth="0.2"
                />

                {/* Point Label Tag */}
                {showLabels && (
                  <text
                    x="0"
                    y="-3.8"
                    textAnchor="middle"
                    fontSize="2"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="currentColor"
                    className="pointer-events-none drop-shadow-sm text-foreground"
                  >
                    {point.code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hovered Point Floating HUD Card */}
        {hoveredPoint && (
          <div className="absolute bottom-12 left-4 z-30 pointer-events-none rounded-xl border border-surface-border bg-surface/95 p-3.5 shadow-xl backdrop-blur-md max-w-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-foreground">
                {hoveredPoint.code}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-brand dark:text-sky-400">
                {hoveredPoint.type}
              </span>
            </div>
            <div className="text-xs font-semibold text-foreground">
              {hoveredPoint.name}
            </div>
            <div className="font-mono text-[10px] text-foreground-muted">
              Zone: {hoveredPoint.zoneId} • {hoveredPoint.location?.label}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-surface-border text-[10px] font-mono">
              <span className="text-foreground-muted">Status: <strong className="text-emerald-600 dark:text-emerald-400">{hoveredPoint.status}</strong></span>
              <span className="text-brand dark:text-sky-300 font-bold">{hoveredPoint.linkedEvidenceIds?.length || 0} Evidence Links</span>
            </div>
          </div>
        )}

        {/* Hovered Zone Floating HUD Card */}
        {hoveredZone && !hoveredPoint && (
          <div className="absolute top-14 left-4 z-30 pointer-events-none rounded-xl border border-surface-border bg-surface/95 p-3.5 shadow-xl backdrop-blur-md max-w-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-brand dark:text-sky-400">
                {hoveredZone.zone.code}
              </span>
              <span className="text-[10px] font-mono text-foreground-muted">
                {hoveredZone.zone.phaseId}
              </span>
            </div>
            <div className="text-xs font-bold text-foreground leading-tight">
              {hoveredZone.zone.name}
            </div>
            {hoveredZone.summary && (
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-surface-border text-[10px] font-mono text-center">
                <div className="bg-surface-subtle p-1 rounded">
                  <span className="text-foreground-muted block">Actual</span>
                  <span className="text-brand dark:text-sky-400 font-bold">{hoveredZone.summary.progress?.actualProgress}%</span>
                </div>
                <div className="bg-surface-subtle p-1 rounded">
                  <span className="text-foreground-muted block">Evidence</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{hoveredZone.summary.evidenceCoverage?.coveragePercent}%</span>
                </div>
                <div className="bg-surface-subtle p-1 rounded">
                  <span className="text-foreground-muted block">Warnings</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{hoveredZone.summary.warnings?.length || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Map Disclaimer & Status Legend */}
      <div className="border-t border-surface-border bg-surface-subtle/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-foreground-muted">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Online Node
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Maintenance / Offline
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded border border-amber-500/80 bg-amber-500/20 inline-block" /> Warning in Sector
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded border border-brand/80 bg-brand/20 inline-block" /> Active Sector
          </span>
        </div>

        <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
          <Info className="h-3 w-3 shrink-0" />
          <span>Prototype site registry — not a live GPS feed.</span>
        </div>
      </div>
    </div>
  );
};
