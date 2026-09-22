import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Tabs, TabsList, TabTrigger, TabPanel } from '../components/ui/Tabs';
import { useTheme } from '../context/useTheme';
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Building2,
  Sliders,
  Cpu,
  Save,
  CheckCircle2,
  HardHat,
  Network,
  Zap,
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states for prototype settings
  const [orgSettings, setOrgSettings] = useState({
    orgName: 'National Highways Authority of India (NHAI)',
    division: 'Northern Corridor Infrastructure Directorate',
    jurisdiction: 'Delhi-Amritsar-Katra Expressway (Package-4)',
    timezone: 'Asia/Kolkata (IST, UTC+5:30)',
  });

  const [paramSettings, setParamSettings] = useState({
    scheduleVarianceThreshold: '5',
    costVarianceThreshold: '3.5',
    aiConfidenceThreshold: '85',
    syncIntervalHours: '24',
  });

  const handleSaveParams = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const appearanceOptions = [
    {
      id: 'light',
      title: 'Light Mode',
      badge: 'Default',
      description: 'Crisp white workspace with high-contrast navy navigation. Ideal for standard daylight operational environments.',
      icon: Sun,
      preview: {
        bg: 'bg-slate-50',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-white border-slate-200 shadow-sm',
        text: 'text-slate-800',
        accent: 'bg-blue-600',
      },
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      badge: 'Pro Mode',
      description: 'Deep navy and charcoal surfaces with reduced eye strain. Engineered for control rooms and low-light field monitoring.',
      icon: Moon,
      preview: {
        bg: 'bg-[#070b14]',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-[#0f172a] border-slate-800 shadow-sm',
        text: 'text-slate-200',
        accent: 'bg-blue-500',
      },
    },
    {
      id: 'system',
      title: 'System Synchronized',
      badge: 'Auto',
      description: 'Automatically adapts between Light and Dark based on your device OS appearance preferences.',
      icon: Laptop,
      preview: {
        bg: 'bg-gradient-to-r from-slate-100 to-[#070b14]',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-800',
        text: 'text-slate-700 dark:text-slate-200',
        accent: 'bg-blue-600',
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Settings & Administration"
        tagline="Manage system appearance, enterprise organization profile, operational thresholds, and telemetry connections."
        badge={<StatusBadge status="verified" label="System Active" size="sm" />}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabsList className="mb-6">
          <TabTrigger value="appearance" badge="Theme">
            Appearance
          </TabTrigger>
          <TabTrigger value="organization">
            Organization Profile
          </TabTrigger>
          <TabTrigger value="parameters">
            Operational Parameters
          </TabTrigger>
          <TabTrigger value="integrations">
            System & Engine Health
          </TabTrigger>
        </TabsList>

        {/* TAB 1: APPEARANCE */}
        <TabPanel value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interface Appearance & Visual Theme</CardTitle>
                  <CardDescription>
                    Select your preferred visual style. Settings are automatically saved to your browser session.
                  </CardDescription>
                </div>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-surface-subtle border border-border text-foreground-muted">
                  Active: <strong className="text-brand-600 dark:text-brand-400 capitalize">{theme} ({resolvedTheme})</strong>
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Option Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appearanceOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-surface border-brand-500 ring-2 ring-brand-500/20 shadow-panel-md'
                          : 'bg-surface-subtle/50 border-border hover:border-border-subtle hover:bg-surface-subtle'
                      }`}
                    >
                      {/* Selection Checkmark */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-2 rounded-lg border ${
                              isSelected
                                ? 'bg-brand-600 text-white border-brand-500'
                                : 'bg-surface text-foreground-muted border-border'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{opt.title}</h4>
                            <span className="text-2xs font-mono text-foreground-muted">{opt.badge}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-brand-600 border-brand-600 text-white'
                              : 'border-border-subtle bg-surface'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Mini Visual Preview Mockup */}
                      <div className={`w-full h-24 rounded-lg p-2 border border-border/70 mb-4 overflow-hidden flex gap-1.5 ${opt.preview.bg}`}>
                        {/* Mini Sidebar */}
                        <div className={`w-1/4 h-full rounded-xs flex flex-col gap-1 p-1 ${opt.preview.sidebar}`}>
                          <div className="w-full h-1.5 bg-blue-500/60 rounded-xs" />
                          <div className="w-3/4 h-1 bg-slate-500/40 rounded-xs" />
                          <div className="w-4/5 h-1 bg-slate-500/40 rounded-xs" />
                        </div>
                        {/* Mini Content Area */}
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="w-full h-2 bg-slate-300/40 dark:bg-slate-700/40 rounded-xs" />
                          <div className={`flex-1 rounded-xs p-1.5 flex flex-col justify-between ${opt.preview.card}`}>
                            <div className="w-1/2 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-xs" />
                            <div className={`w-1/3 h-1.5 rounded-xs ${opt.preview.accent}`} />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-foreground-muted leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Theme Details Banner */}
              <div className="p-4 rounded-lg bg-surface-subtle border border-border flex items-start gap-3">
                <HardHat className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground">
                    Infrastructure Design System Standards
                  </h4>
                  <p className="text-2xs text-foreground-muted leading-relaxed">
                    InfraSync AI enforces a high-density, technical color palette designed specifically for highway, railway, and civil construction projects. Color indicators (Green = Healthy, Amber = Risk, Red = Delayed/Critical) remain consistent across both light and dark themes to guarantee immediate decision-making clarity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 2: ORGANIZATION PROFILE */}
        <TabPanel value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Authority Profile</CardTitle>
              <CardDescription>
                Review organizational authority credentials and project jurisdiction metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Authority / Employer Name"
                  value={orgSettings.orgName}
                  onChange={(e) => setOrgSettings({ ...orgSettings, orgName: e.target.value })}
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
                <Input
                  label="Infrastructure Directorate"
                  value={orgSettings.division}
                  onChange={(e) => setOrgSettings({ ...orgSettings, division: e.target.value })}
                />
                <Input
                  label="Assigned Project Corridor"
                  value={orgSettings.jurisdiction}
                  onChange={(e) => setOrgSettings({ ...orgSettings, jurisdiction: e.target.value })}
                />
                <Input
                  label="System Operations Timezone"
                  value={orgSettings.timezone}
                  onChange={(e) => setOrgSettings({ ...orgSettings, timezone: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveParams}>
                  Save Organization Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 3: OPERATIONAL PARAMETERS */}
        <TabPanel value="parameters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Risk Tolerance Thresholds</CardTitle>
              <CardDescription>
                Configure automated risk detection rules and AI evidence-matching sensitivity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveParams} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Schedule Slippage Alert Threshold (Days)"
                    type="number"
                    value={paramSettings.scheduleVarianceThreshold}
                    onChange={(e) =>
                      setParamSettings({ ...paramSettings, scheduleVarianceThreshold: e.target.value })
                    }
                    helperText="Activities with slippage exceeding this value are automatically flagged as At Risk."
                    leftIcon={<Sliders className="w-4 h-4" />}
                  />
                  <Input
                    label="Cost Variance Tolerance Threshold (%)"
                    type="number"
                    step="0.1"
                    value={paramSettings.costVarianceThreshold}
                    onChange={(e) =>
                      setParamSettings({ ...paramSettings, costVarianceThreshold: e.target.value })
                    }
                    helperText="Deviations between planned and actual bill of quantities that trigger warnings."
                  />
                  <Input
                    label="AI Evidence Schedule-Link Auto-Candidate Score (%)"
                    type="number"
                    value={paramSettings.aiConfidenceThreshold}
                    onChange={(e) =>
                      setParamSettings({ ...paramSettings, aiConfidenceThreshold: e.target.value })
                    }
                    helperText="Confidence score required before presenting schedule linking suggestions to human verifiers."
                    leftIcon={<Cpu className="w-4 h-4" />}
                  />
                  <Input
                    label="Field Telemetry Sync Window (Hours)"
                    type="number"
                    value={paramSettings.syncIntervalHours}
                    onChange={(e) =>
                      setParamSettings({ ...paramSettings, syncIntervalHours: e.target.value })
                    }
                    helperText="Interval for continuous background batch aggregation from field survey devices."
                  />
                </div>

                {savedSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Operational parameters successfully saved and synchronized.</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                    Update Thresholds
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 4: SYSTEM & ENGINE HEALTH */}
        <TabPanel value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <CardTitle>Python AI Intelligence Engine</CardTitle>
                  </div>
                  <StatusBadge status="verified" label="FastAPI 0.115" size="sm" />
                </div>
                <CardDescription>
                  Isolated computer vision, schedule linking, and risk prediction microservice.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-foreground-muted">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span>Endpoint Status:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">http://127.0.0.1:8000 (Healthy)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span>Execution Mode:</span>
                  <span className="font-mono text-foreground font-medium">Deterministic Rule + Demo Proxy</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Human Verification Layer:</span>
                  <span className="font-mono text-foreground font-medium">Enforced (HITL Active)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-brand-500" />
                    <CardTitle>Express API Backend & Storage</CardTitle>
                  </div>
                  <StatusBadge status="onTrack" label="Node v20.x" size="sm" />
                </div>
                <CardDescription>
                  Core application router, authentication, and audit history ledger.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-foreground-muted">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span>API Proxy Server:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">http://127.0.0.1:5000 (Ready)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span>Database Layer:</span>
                  <span className="font-mono text-foreground font-medium">MongoDB Persistent / In-Memory Mock</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Role-Based Access:</span>
                  <span className="font-mono text-foreground font-medium">Authority, PMC, Contractor, Auditor</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
