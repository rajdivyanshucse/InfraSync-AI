import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { Activity, Clock, DollarSign, MapPin, ShieldAlert, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';

export const MetricsSection = () => {
  return (
    <div className="space-y-6">
      {/* Top Level Infrastructure KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Physical Progress (Earned Value)"
          value="61.2"
          unit="%"
          plannedValue="68.4%"
          variance={{ value: '-7.2%', trend: 'negative', label: 'vs baseline' }}
          status="warning"
          icon={<Activity className="w-4 h-4" />}
        />

        <MetricCard
          label="Critical Path Schedule Variance"
          value="-14"
          unit="Days"
          plannedValue="0 Days"
          variance={{ value: '-14d', trend: 'negative', label: 'Delay' }}
          status="critical"
          icon={<Clock className="w-4 h-4" />}
        />

        <MetricCard
          label="Cost Performance Index (CPI)"
          value="0.96"
          plannedValue="1.00"
          variance={{ value: '-0.04', trend: 'neutral', label: 'Marginal' }}
          status="warning"
          icon={<DollarSign className="w-4 h-4" />}
        />

        <MetricCard
          label="Active Construction Chainage"
          value="18.4"
          unit="km"
          plannedValue="22.0 km"
          variance={{ value: '+2.1km', trend: 'positive', label: 'This month' }}
          status="healthy"
          icon={<MapPin className="w-4 h-4" />}
        />

        <MetricCard
          label="Open Quality Non-Conformance (NCR)"
          value="2"
          unit="Items"
          subtitle="Minor rebar spacing variance at Pier 108"
          status="healthy"
          icon={<ShieldAlert className="w-4 h-4" />}
        />

        <MetricCard
          label="Machinery IoT Telemetry Uptime"
          value="96.8"
          unit="%"
          plannedValue="95.0%"
          variance={{ value: '+1.8%', trend: 'positive', label: 'Optimal' }}
          status="healthy"
          icon={<Cpu className="w-4 h-4" />}
        />
      </div>

      {/* Progress Bars & Planned vs Actual Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle>Dual-Track Planned vs Actual Execution Gauges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Progress
              label="Package 01 — Substructure & Bored Piling (CH:0+000 to CH:8+500)"
              value={94.5}
              plannedValue={92.0}
              showLabel
              size="md"
            />
            <p className="text-2xs text-slate-400 font-mono -mt-2">
              Status: <span className="text-emerald-400 font-semibold">Ahead of Schedule (+2.5%)</span> · Concrete pour certified
            </p>
          </div>

          <div className="space-y-4">
            <Progress
              label="Package 02 — Pier Caps & Superstructure Girders (CH:8+500 to CH:14+200)"
              value={58.0}
              plannedValue={69.0}
              showLabel
              size="md"
            />
            <p className="text-2xs text-slate-400 font-mono -mt-2">
              Status: <span className="text-rose-400 font-semibold">Delayed (-11.0%)</span> · Heavy launching gantry crane maintenance
            </p>
          </div>

          <div className="space-y-4">
            <Progress
              label="Package 03 — Elevated Viaduct Track Laying & Electrification"
              value={24.0}
              plannedValue={28.5}
              showLabel
              size="md"
            />
            <p className="text-2xs text-slate-400 font-mono -mt-2">
              Status: <span className="text-amber-400 font-semibold">Minor Risk (-4.5%)</span> · Steel rail procurement in transit
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
