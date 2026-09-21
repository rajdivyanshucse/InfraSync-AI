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
        return { ring: 'ring-emerald-500/50', fill: 'fill-emerald-400', stroke: 'stroke-emerald-300', text: 'text-emerald-400' };
      case 'offline':
        return { ring: 'ring-rose-500/50', fill: 'fill-rose-400', stroke: 'stroke-rose-300', text: 'text-rose-400' };
      case 'maintenance':
        return { ring: 'ring-amber-500/50', fill: 'fill-amber-400', stroke: 'stroke-amber-300', text: 'text-amber-400' };
      case 'standby':
        return { ring: 'ring-sky-500/50', fill: 'fill-sky-400', stroke: 'stroke-sky-300', text: 'text-sky-400' };
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
        fillOpacity: '0.22',
        stroke: '#38bdf8',
        strokeWidth: '0.9',
        textColor: '#38bdf8',
        badgeBg: '#0369a1',
      };
    }

    if (isCritical) {
      return {
        fill: '#f43f5e',
        fillOpacity: '0.12',
        stroke: '#fb7185',
        strokeWidth: '0.6',
        textColor: '#fda4af',
        badgeBg: '#881337',
      };
    }

    if (isBehind || warningCount > 0) {
      return {
        fill: '#f59e0b',
        fillOpacity: '0.10',
        stroke: '#fbbf24',
        strokeWidth: '0.5',
        textColor: '#fde68a',
        badgeBg: '#78350f',
      };
    }

    return {
      fill: '#0ea5e9',
      fillOpacity: '0.06',
      stroke: '#38bdf8',
      strokeWidth: '0.4',
      textColor: '#94a3b8',
      badgeBg: '#0f172a',
    };
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-surface-border bg-gradient-to-b from-surface-card via-surface to-surface-card shadow-lg flex flex-col h-[560px]">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-lg border border-surface-border/80 bg-surface/90 px-3 py-1.5 shadow-md backdrop-blur-md pointer-events-auto">
          <Compass className="h-4 w-4 text-sky-400" />
          <span className="font-mono text-xs font-bold text-slate-200">
            Spatial Execution Map
          </span>
          <span className="text-3xs font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
            WGS84 Datum
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 rounded-lg border border-surface-border/80 bg-surface/90 p-1 shadow-md backdrop-blur-md pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`h-7 px-2 text-3xs font-mono gap-1 ${
              showBoundaries ? 'text-sky-300 bg-sky-500/10' : 'text-slate-400'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Zones</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            className={`h-7 px-2 text-3xs font-mono gap-1 ${
              showLabels ? 'text-sky-300 bg-sky-500/10' : 'text-slate-400'
            }`}
          >
            <span>Labels</span>
          </Button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="rounded p-1 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="rounded p-1 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="rounded p-1 text-slate-400 hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Schematic Map Canvas */}
      <div className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-300 select-none"
          style={{ transform: `scale(${zoomLevel})` }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="siteGrid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
            </pattern>
            <radialGradient id="mapVignette" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          <rect width="100" height="100" fill="url(#siteGrid)" />
          <rect width="100" height="100" fill="url(#mapVignette)" />

          {/* Project Corridor Linear Alignment Backbone */}
          <path
            d="M 12 85 Q 35 65 50 50 T 88 15"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeDasharray="1.5 1.5"
            className="opacity-40"
          />
          <path
            d="M 12 85 Q 35 65 50 50 T 88 15"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.8"
            className="opacity-70"
          />

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
                    rx="3"
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
                        fill="#cbd5e1"
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
                {/* Outer Pulsing Aura if selected or online */}
                {isSelected && (
                  <circle
                    r="5"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.4"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  r={isSelected ? '3.2' : '2.4'}
                  fill="#090d16"
                  stroke={isSelected ? '#ffffff' : '#38bdf8'}
                  strokeWidth={isSelected ? '0.8' : '0.4'}
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
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    className="pointer-events-none drop-shadow-md"
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
          <div className="absolute bottom-12 left-4 z-30 pointer-events-none rounded-xl border border-surface-border/90 bg-surface-card/95 p-3.5 shadow-2xl backdrop-blur-md max-w-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-white">
                {hoveredPoint.code}
              </span>
              <span className="text-3xs uppercase font-mono font-bold text-sky-400">
                {hoveredPoint.type}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {hoveredPoint.name}
            </div>
            <div className="font-mono text-3xs text-slate-400">
              Zone: {hoveredPoint.zoneId} • {hoveredPoint.location?.label}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-surface-border/60 text-3xs font-mono">
              <span className="text-slate-400">Status: <strong className="text-emerald-400">{hoveredPoint.status}</strong></span>
              <span className="text-sky-300 font-bold">{hoveredPoint.linkedEvidenceIds?.length || 0} Evidence Links</span>
            </div>
          </div>
        )}

        {/* Hovered Zone Floating HUD Card */}
        {hoveredZone && !hoveredPoint && (
          <div className="absolute top-14 left-4 z-30 pointer-events-none rounded-xl border border-surface-border/90 bg-surface-card/95 p-3.5 shadow-2xl backdrop-blur-md max-w-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-sky-400">
                {hoveredZone.zone.code}
              </span>
              <span className="text-3xs font-mono text-slate-400">
                {hoveredZone.zone.phaseId}
              </span>
            </div>
            <div className="text-xs font-bold text-white leading-tight">
              {hoveredZone.zone.name}
            </div>
            {hoveredZone.summary && (
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-surface-border/60 text-3xs font-mono text-center">
                <div className="bg-surface/80 p-1 rounded">
                  <span className="text-slate-400 block">Actual</span>
                  <span className="text-sky-400 font-bold">{hoveredZone.summary.progress?.actualProgress}%</span>
                </div>
                <div className="bg-surface/80 p-1 rounded">
                  <span className="text-slate-400 block">Evidence</span>
                  <span className="text-emerald-400 font-bold">{hoveredZone.summary.evidenceCoverage?.coveragePercent}%</span>
                </div>
                <div className="bg-surface/80 p-1 rounded">
                  <span className="text-slate-400 block">Warnings</span>
                  <span className="text-amber-400 font-bold">{hoveredZone.summary.warnings?.length || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Map Disclaimer & Status Legend */}
      <div className="border-t border-surface-border bg-surface-subtle/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-3xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Online Node
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" /> Maintenance / Offline
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded border border-amber-400/80 bg-amber-500/20 inline-block" /> Warning in Sector
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded border border-sky-400/80 bg-sky-500/20 inline-block" /> Active Sector
          </span>
        </div>

        <div className="flex items-center gap-1 text-amber-300">
          <Info className="h-3 w-3 shrink-0" />
          <span>Prototype spatial registry — not a real-time GPS feed.</span>
        </div>
      </div>
    </div>
  );
};
