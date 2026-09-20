import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Camera, Smartphone, Compass, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const EvidenceSnapshot = ({ evidence }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-brand-400" />
          <CardTitle>Site Evidence Stream</CardTitle>
        </div>
        <Link
          to="/site-evidence"
          className="text-2xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
        >
          Full Evidence Gallery →
        </Link>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {evidence.map((item) => {
            const isCamera = item.type === 'camera';
            const isDrone = item.type === 'drone';

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface-subtle/60 border border-border/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
              >
                {/* Visual Thumbnail Placeholder with Tech Scan overlay */}
                <div className="h-28 rounded-lg bg-surface-base border border-border relative overflow-hidden flex flex-col items-center justify-center p-3 text-center group-hover:border-slate-600 transition-colors">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <div className="relative z-10 space-y-1">
                    <div className="w-7 h-7 mx-auto rounded-full bg-brand-950/80 border border-brand-500/40 flex items-center justify-center text-brand-400">
                      {isDrone ? (
                        <Compass className="w-3.5 h-3.5" />
                      ) : isCamera ? (
                        <Camera className="w-3.5 h-3.5" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="font-mono text-3xs text-slate-400 block truncate max-w-[180px]">
                      {item.source}
                    </span>
                  </div>

                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-3xs font-mono text-slate-400">
                    <span className="bg-surface-elevated/90 px-1.5 py-0.5 rounded border border-border">
                      {item.wbsCode}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {/* Evidence Metadata */}
                <div className="space-y-1.5">
                  <span className="font-bold text-xs text-slate-100 block leading-tight line-clamp-1">
                    {item.title}
                  </span>

                  <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="truncate max-w-[140px]">{item.location}</span>
                    </div>

                    <span
                      className={cn(
                        'text-3xs font-semibold px-1.5 py-0.2 rounded border flex items-center gap-1',
                        item.verified
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                      )}
                    >
                      {item.verified ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <AlertCircle className="w-2.5 h-2.5" />
                      )}
                      <span>{item.verified ? 'Verified' : 'Pending'}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
