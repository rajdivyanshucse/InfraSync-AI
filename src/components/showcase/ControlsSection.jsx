import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SearchField } from '../ui/SearchField';
import { Tabs, TabsList, TabTrigger, TabPanel } from '../ui/Tabs';
import {
  Download,
  Filter,
  Plus,
  RefreshCw,
  Trash2,
  Calendar,
  Layers,
  Settings2,
} from 'lucide-react';

export const ControlsSection = () => {
  const [searchValue, setSearchValue] = useState('Pier Cap 104');
  const [inputValue, setInputValue] = useState('Highway Bypass Package 4');
  const [isLoading, setIsLoading] = useState(false);
  const [tabVariant, setTabVariant] = useState('underline');

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Buttons Showcase */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Button Primitives & Interactive States</CardTitle>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={triggerLoading}
            >
              Test Loading States
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variants */}
          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase text-slate-400 block">Variants</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Create Milestone
              </Button>
              <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
                Filter Chainage
              </Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                Export Baseline
              </Button>
              <Button variant="ghost" leftIcon={<Settings2 className="w-4 h-4" />}>
                Config
              </Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                Delete Log
              </Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase text-slate-400 block">Size Scale</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="secondary">
                Small (28px)
              </Button>
              <Button size="md" variant="secondary">
                Medium (36px / Default)
              </Button>
              <Button size="lg" variant="secondary">
                Large (40px)
              </Button>
            </div>
          </div>

          {/* States: Loading & Disabled */}
          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase text-slate-400 block">Loading & Disabled States</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading={isLoading}>
                {isLoading ? 'Syncing...' : 'Live Sync'}
              </Button>
              <Button variant="secondary" disabled>
                Disabled Action
              </Button>
              <Button variant="outline" disabled leftIcon={<Download className="w-4 h-4" />}>
                Disabled Export
              </Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase text-slate-400 block">Accessible Icon Buttons</span>
            <div className="flex items-center gap-2">
              <IconButton aria-label="Refresh" variant="secondary" size="sm">
                <RefreshCw className="w-3.5 h-3.5" />
              </IconButton>
              <IconButton aria-label="Add" variant="primary" size="md">
                <Plus className="w-4 h-4" />
              </IconButton>
              <IconButton aria-label="Settings" variant="outline" size="md">
                <Settings2 className="w-4 h-4" />
              </IconButton>
              <IconButton aria-label="Delete" variant="danger" size="md">
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Controls Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Form Controls & Data Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Work Package Identifier"
              placeholder="e.g. WP-CORRIDOR-04"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              showClear
              onClear={() => setInputValue('')}
              helperText="Official government contract code"
              leftIcon={<Layers className="w-4 h-4" />}
            />

            <Input
              label="Target Commissioning Date"
              type="date"
              defaultValue="2026-12-31"
              leftIcon={<Calendar className="w-4 h-4" />}
              helperText="Critical path baseline completion"
            />

            <Input
              label="Quality Inspection Milestone"
              defaultValue="Invalid Chainage Coordinate"
              error="Chainage must follow format CH:XX+XXX"
              leftIcon={<Layers className="w-4 h-4" />}
            />

            <Select
              label="Supervising Authority / PMC"
              defaultValue="nhai"
              options={[
                { value: 'nhai', label: 'National Highway Authority (NHAI)' },
                { value: 'dmrc', label: 'Delhi Metro Rail Corp (DMRC)' },
                { value: 'mrrda', label: 'State Rural Road Authority' },
                { value: 'epc', label: 'Independent Engineering Consultant' },
              ]}
              helperText="Assigned review & approval board"
            />

            <Select
              label="Geotechnical Risk Level"
              defaultValue="high"
              options={[
                { value: 'low', label: 'Low — Stable Basalt Bedrock' },
                { value: 'medium', label: 'Medium — Silt with High Water Table' },
                { value: 'high', label: 'High — Deep Alluvial Fault Line' },
              ]}
              helperText="Geotech survey classification"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300 select-none">
                Interactive Global Search
              </label>
              <SearchField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder="Search drawings, chainages, activities..."
              />
              <p className="text-2xs text-slate-400">Filter with shortcut or direct keyword</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs & Segment Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle>Tab Navigation Variants</CardTitle>
            <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-md border border-border text-xs">
              <span className="text-2xs text-slate-400 px-1 font-mono uppercase">Style:</span>
              {['underline', 'pill', 'segment'].map((v) => (
                <button
                  key={v}
                  onClick={() => setTabVariant(v)}
                  className={`px-2 py-0.5 rounded text-2xs font-medium capitalize transition-colors ${
                    tabVariant === v ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activities" variant={tabVariant}>
            <TabsList>
              <TabTrigger value="activities" badge="18">
                Execution Activities
              </TabTrigger>
              <TabTrigger value="rfis" badge="3">
                Open RFIs
              </TabTrigger>
              <TabTrigger value="machinery" badge="12">
                Heavy Equipment
              </TabTrigger>
              <TabTrigger value="safety">
                Safety Logs
              </TabTrigger>
            </TabsList>

            <TabPanel value="activities">
              <div className="p-4 rounded-lg bg-surface-subtle/40 border border-border/60 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Execution Activities Panel</p>
                <p className="text-slate-400 mt-1">
                  Displays active civil work packages, daily target progress, and machine utilization rates.
                </p>
              </div>
            </TabPanel>

            <TabPanel value="rfis">
              <div className="p-4 rounded-lg bg-surface-subtle/40 border border-border/60 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Requests for Information (RFIs)</p>
                <p className="text-slate-400 mt-1">
                  3 critical design clarifications pending structural consultant approval for Package 4 pier caps.
                </p>
              </div>
            </TabPanel>

            <TabPanel value="machinery">
              <div className="p-4 rounded-lg bg-surface-subtle/40 border border-border/60 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Heavy Plant & Equipment</p>
                <p className="text-slate-400 mt-1">
                  12 active units (Piling rigs, Tower cranes, Concrete batching plant) operating at 94% telemetry uptime.
                </p>
              </div>
            </TabPanel>

            <TabPanel value="safety">
              <div className="p-4 rounded-lg bg-surface-subtle/40 border border-border/60 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Site Safety & Compliance</p>
                <p className="text-slate-400 mt-1">
                  Zero lost-time incidents (LTI) in the last 180 continuous work shifts.
                </p>
              </div>
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
