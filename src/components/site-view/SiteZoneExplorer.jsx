import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  X 
} from 'lucide-react';
import { SiteZoneCard } from './SiteZoneCard';

export const SiteZoneExplorer = ({
  siteZones = [],
  zoneSummaries = [],
  selectedZoneId,
  onSelectZone,
}) => {
  const [zoneSearch, setZoneSearch] = useState('');

  const filteredZones = useMemo(() => {
    if (!zoneSearch.trim()) return siteZones;
    const q = zoneSearch.toLowerCase();
    return siteZones.filter(
      (z) =>
        z.code.toLowerCase().includes(q) ||
        z.name.toLowerCase().includes(q) ||
        z.description?.toLowerCase().includes(q) ||
        z.phaseId?.toLowerCase().includes(q)
    );
  }, [siteZones, zoneSearch]);

  return (
    <div className="flex flex-col h-full rounded-xl border border-surface-border bg-surface-card shadow-sm overflow-hidden">
      {/* Explorer Header */}
      <div className="p-4 border-b border-surface-border bg-surface-subtle/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Site Sectors & Zones
            </h3>
          </div>
          <span className="font-mono text-3xs font-semibold text-slate-400 bg-surface px-2 py-0.5 rounded border border-surface-border">
            {siteZones.length} Zones
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter site sectors..."
            value={zoneSearch}
            onChange={(e) => setZoneSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface py-1.5 pl-8 pr-7 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
          {zoneSearch && (
            <button
              onClick={() => setZoneSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Zone Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[500px]">
        {filteredZones.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No site sectors match your search.
          </div>
        ) : (
          filteredZones.map((zone) => {
            const summary = zoneSummaries.find((zs) => zs.zoneId === zone.id);
            return (
              <SiteZoneCard
                key={zone.id}
                zone={zone}
                zoneSummary={summary}
                isSelected={selectedZoneId === zone.id}
                onSelectZone={onSelectZone}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
