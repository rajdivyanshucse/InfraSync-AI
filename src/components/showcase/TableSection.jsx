import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';
import { Dropdown } from '../ui/Dropdown';
import { IconButton } from '../ui/IconButton';
import { MoreVertical, FileText, Activity, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

const mockActivities = [
  {
    id: '1',
    code: 'ACT-104-PIL',
    name: 'Cast-in-Situ Bored Piling (1200mm dia)',
    chainage: 'CH:12+200 — CH:12+800',
    contractor: 'L&T Heavy Civil',
    plannedDate: '2026-08-15',
    forecastDate: '2026-08-12',
    varianceDays: 3,
    actualProgress: 100,
    plannedProgress: 100,
    status: 'completed',
  },
  {
    id: '2',
    code: 'ACT-105-CAP',
    name: 'Pier Cap Prestressing & Grouting',
    chainage: 'CH:13+450',
    contractor: 'Afcons Infrastructure',
    plannedDate: '2026-09-30',
    forecastDate: '2026-09-28',
    varianceDays: 2,
    actualProgress: 78.5,
    plannedProgress: 75.0,
    status: 'onTrack',
  },
  {
    id: '3',
    code: 'ACT-106-SEG',
    name: 'Segment Launching via Girder Crane #3',
    chainage: 'CH:14+100 — CH:14+600',
    contractor: 'NCC Urban Infra',
    plannedDate: '2026-10-15',
    forecastDate: '2026-10-29',
    varianceDays: -14,
    actualProgress: 42.0,
    plannedProgress: 64.0,
    status: 'delayed',
  },
  {
    id: '4',
    code: 'ACT-107-DEK',
    name: 'Viaduct Deck Waterproofing & Mastic',
    chainage: 'CH:11+000 — CH:12+000',
    contractor: 'Tata Projects',
    plannedDate: '2026-11-05',
    forecastDate: '2026-11-10',
    varianceDays: -5,
    actualProgress: 15.0,
    plannedProgress: 22.0,
    status: 'atRisk',
  },
  {
    id: '5',
    code: 'ACT-108-AUD',
    name: 'Quality Assurance Core Strength Testing',
    chainage: 'CH:13+000 (Lab 2)',
    contractor: 'RITES QA Inspection',
    plannedDate: '2026-09-25',
    forecastDate: '2026-09-25',
    varianceDays: 0,
    actualProgress: 0,
    plannedProgress: 0,
    status: 'pending',
  },
];

export const TableSection = () => {
  const [sortColumn, setSortColumn] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Work Package Execution & Critical Path Table</CardTitle>
            <p className="text-2xs text-slate-400 mt-0.5">
              High-density tabular foundation with sortable columns, variance tracking, and actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary">
              Export Schedule (CSV)
            </Button>
            <Button size="sm" variant="primary">
              Filter Active Path
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={sortColumn === 'code' ? sortDirection : null}
                onSort={() => handleSort('code')}
              >
                Activity Code
              </TableHead>
              <TableHead
                sortable
                sortDirection={sortColumn === 'name' ? sortDirection : null}
                onSort={() => handleSort('name')}
              >
                Activity Name & Contractor
              </TableHead>
              <TableHead>Chainage / Location</TableHead>
              <TableHead>Baseline Date</TableHead>
              <TableHead>Forecast Date</TableHead>
              <TableHead
                sortable
                sortDirection={sortColumn === 'variance' ? sortDirection : null}
                onSort={() => handleSort('variance')}
              >
                Schedule Variance
              </TableHead>
              <TableHead className="w-36">Physical Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((act) => (
              <TableRow key={act.id}>
                <TableCell className="font-mono font-medium text-slate-200">
                  {act.code}
                </TableCell>

                <TableCell>
                  <div className="font-medium text-slate-100">{act.name}</div>
                  <div className="text-2xs text-slate-500">{act.contractor}</div>
                </TableCell>

                <TableCell className="font-mono text-2xs text-slate-300">
                  {act.chainage}
                </TableCell>

                <TableCell className="font-mono text-2xs text-slate-400">
                  {act.plannedDate}
                </TableCell>

                <TableCell className="font-mono text-2xs text-slate-300 font-medium">
                  {act.forecastDate}
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-mono font-semibold ${
                      act.varianceDays < 0
                        ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30'
                        : act.varianceDays > 0
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : 'text-slate-400 bg-surface-subtle border border-border'
                    }`}
                  >
                    {act.varianceDays > 0 ? `+${act.varianceDays}d` : `${act.varianceDays}d`}
                  </span>
                </TableCell>

                <TableCell>
                  <Progress
                    value={act.actualProgress}
                    plannedValue={act.plannedProgress}
                    size="xs"
                    showLabel
                  />
                </TableCell>

                <TableCell>
                  <StatusBadge status={act.status} size="sm" pulseDot={act.status === 'delayed'} />
                </TableCell>

                <TableCell className="text-right">
                  <Dropdown
                    trigger={
                      <IconButton aria-label="More actions" size="sm" variant="ghost">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </IconButton>
                    }
                    items={[
                      { id: 'view', label: 'View Drawing / BIM', icon: <Eye className="w-3.5 h-3.5" /> },
                      { id: 'telemetry', label: 'Live IoT Telemetry', icon: <Activity className="w-3.5 h-3.5" /> },
                      { id: 'docs', label: 'Inspection Report', icon: <FileText className="w-3.5 h-3.5" /> },
                      { type: 'divider' },
                      { id: 'flag', label: 'Flag Schedule Risk', icon: <AlertTriangle className="w-3.5 h-3.5" />, danger: true },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
