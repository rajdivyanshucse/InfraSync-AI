import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Alert } from '../ui/Alert';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { Tooltip } from '../ui/Tooltip';
import { CheckCircle2, ShieldCheck, HelpCircle, HardHat, FileSpreadsheet } from 'lucide-react';

export const FeedbackSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <div className="space-y-6">
      {/* Alert & Feedback States */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Alerts & Status Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert
            variant="critical"
            title="Critical Path Delay Detected (Package 02)"
            action={
              <Button size="sm" variant="danger">
                Review Mitigation
              </Button>
            }
          >
            Girder launching crane #3 is experiencing hydraulic pressure drops at Chainage CH:14+200. Estimated impact: -14 Days slippage if unmitigated.
          </Alert>

          <Alert
            variant="warning"
            title="Material Supply Chain Risk"
          >
            Prestressing high-tensile steel strand delivery from Vizag rolling mill is delayed by 4 business days due to regional monsoon traffic.
          </Alert>

          <Alert
            variant="info"
            title="Quality Audit Handover Scheduled"
          >
            Independent Safety Consultant inspection for Pier Cap 102 through 108 is scheduled for tomorrow at 10:00 AM IST.
          </Alert>

          <Alert
            variant="success"
            title="Geotechnical Foundation Cleared"
          >
            All 48 test piles for Viaduct Sector 4 have successfully passed high-strain dynamic load testing (ASTM D4945).
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modal & Tooltip Interactive Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Dialog & Floating Tooltips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-3">
                Accessible dialogs with backdrop blur, keyboard trap, and responsive actions:
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Work Package Mitigation Modal
              </Button>
            </div>

            <div className="pt-4 border-t border-border/40">
              <p className="text-xs text-slate-400 mb-3">
                Hover / Focus Tooltip triggers:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip content="Physical Earned Value computed via ISO 21508 standards">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-subtle border border-border text-xs text-slate-300 hover:text-white">
                    <span>Earned Value Metric</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </Tooltip>

                <Tooltip content="Chainage 14+200: West Viaduct Pier Cap" position="bottom">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-subtle border border-border text-xs text-slate-300 hover:text-white">
                    <span>Chainage Pin</span>
                    <HardHat className="w-3.5 h-3.5 text-brand-400" />
                  </button>
                </Tooltip>

                <Tooltip content="Schedule variance computed against Baseline Rev 4.2" position="right">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-subtle border border-border text-xs text-slate-300 hover:text-white">
                    <span>Baseline Reference</span>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty States & Zero Data */}
        <Card>
          <CardHeader>
            <CardTitle>Zero Data & Empty State Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
              title="No Pending Non-Conformance Reports"
              description="All civil and structural elements in Package 03 currently comply with contractual engineering tolerances and quality checks."
              action={
                <Button size="sm" variant="secondary">
                  Log Routine Site Audit
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Skeleton Loading States */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Skeleton Loading Placeholders</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSkeleton(!showSkeleton)}
            >
              {showSkeleton ? 'Show Real Metrics' : 'Toggle Skeleton State'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showSkeleton ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="p-4 rounded bg-surface-subtle/30 border border-border text-xs text-slate-300">
              <p className="font-semibold text-slate-200">Loaded Content State</p>
              <p className="text-slate-400 mt-1">
                Click &quot;Toggle Skeleton State&quot; to preview asynchronous content placeholders and layout stability.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Mitigation Action Plan — WP-02"
        description="Review remedial actions and deploy auxiliary equipment to recover 14 days of critical path delay."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setIsModalOpen(false)}
            >
              Approve Mitigation Plan
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded bg-surface-subtle border border-border space-y-1">
            <span className="font-semibold text-slate-200">Proposed Recovery Sequence:</span>
            <p className="text-slate-400">
              Mobilize second shift for pier cap post-tensioning between Chainage CH:13+000 and CH:14+200. Projected completion normalized by 12 October 2026.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-surface-muted/40 border border-border">
              <span className="text-2xs text-slate-400 uppercase font-mono block">Estimated Cost</span>
              <span className="font-mono font-bold text-slate-100 text-sm">₹ 14.2 Lakhs</span>
            </div>
            <div className="p-2.5 rounded bg-surface-muted/40 border border-border">
              <span className="text-2xs text-slate-400 uppercase font-mono block">Schedule Recovery</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">+10 Days</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
