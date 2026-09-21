import { projectRepository } from './project.repository.js';
import { scheduleRepository } from './schedule.repository.js';
import { executionRepository } from './execution.repository.js';
import { evidenceRepository } from './evidence.repository.js';
import { riskRepository } from './risk.repository.js';
import { alertRepository } from './alert.repository.js';
import { siteViewRepository } from './siteView.repository.js';

export class ReportRepository {
  async getProjectReportSummary(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) return null;

    const schedule = (await scheduleRepository.getScheduleByProjectId(projectId)) || {};
    const execution = (await executionRepository.getExecutionByProjectId(projectId)) || {};
    const evidences = (await evidenceRepository.findByProjectId(projectId)) || [];
    const risks = (await riskRepository.getRiskEventsByProjectId(projectId)) || [];
    const alerts = (await alertRepository.findByProjectId(projectId)) || [];
    const siteView = (await siteViewRepository.getSiteViewByProjectId(projectId)) || {};

    const verifiedEvidenceCount = evidences.filter((e) => e.verificationStatus === 'verified').length;
    const evidenceCoverage = evidences.length > 0 ? Math.round((verifiedEvidenceCount / evidences.length) * 100) : 0;
    const openAlerts = alerts.filter((a) => a.status !== 'resolved' && a.status !== 'dismissed').length;

    return {
      projectId: project.id,
      projectName: project.name,
      projectCode: project.code,
      generatedAt: new Date().toISOString(),
      reportStatus: 'Prototype API Summary',
      kpis: {
        plannedProgress: project.kpis?.plannedProgress || 0,
        actualProgress: project.kpis?.actualProgress || 0,
        scheduleVariance: project.kpis?.variance || 0,
        evidenceCoveragePercent: evidenceCoverage,
        activeEarlyWarnings: risks.length,
        openInterventions: openAlerts,
      },
      scheduleSummary: {
        baselineId: schedule.baselineId || 'BL-P6-DEFAULT',
        totalActivities: schedule.totalActivities || 0,
        milestonesTotal: (schedule.milestones || []).length,
        milestonesCompleted: (schedule.milestones || []).filter((m) => m.status === 'completed').length,
      },
      executionSummary: execution.summary || {},
      evidenceSummary: {
        totalRecords: evidences.length,
        verifiedRecords: verifiedEvidenceCount,
        pendingReview: evidences.filter((e) => e.verificationStatus === 'pendingReview').length,
      },
      spatialSummary: {
        totalZones: (siteView.zones || []).length,
        totalCapturePoints: (siteView.capturePoints || []).length,
      },
      attentionCount: risks.length + openAlerts,
    };
  }
}

export const reportRepository = new ReportRepository();
