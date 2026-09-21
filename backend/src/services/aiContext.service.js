import { evidenceRepository } from '../repositories/evidence.repository.js';
import { scheduleRepository } from '../repositories/schedule.repository.js';
import { executionRepository } from '../repositories/execution.repository.js';

/**
 * InfraSync AI — AI Context Builder Service (Phase 21 & 22)
 * Retrieves and normalizes domain entities (evidence, schedule, micro-activities, execution units, milestones)
 * into a structured context payload for the Python schedule-linking & delay/risk analysis engine.
 */
export class AiContextService {
  /**
   * Build complete analysis context for a given evidence record
   * @param {string} projectId
   * @param {string} evidenceId
   * @param {Object} [overrideScope] - Optional explicit activityId / microActivityId
   */
  async buildAnalysisContext(projectId, evidenceId, overrideScope = {}) {
    // 1. Retrieve Evidence
    const evidence = await evidenceRepository.findById(evidenceId);
    if (!evidence) {
      const err = new Error(`Evidence not found: ${evidenceId}`);
      err.code = 'EVIDENCE_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    if (projectId && evidence.projectId && evidence.projectId !== projectId) {
      const err = new Error(`Evidence ${evidenceId} does not belong to project ${projectId}`);
      err.code = 'EVIDENCE_PROJECT_MISMATCH';
      err.statusCode = 400;
      throw err;
    }

    const resolvedProjectId = projectId || evidence.projectId;

    // 2. Retrieve Schedule & Milestones
    const schedule = await scheduleRepository.getScheduleByProjectId(resolvedProjectId);
    if (!schedule) {
      const err = new Error(`Project schedule not found for project: ${resolvedProjectId}`);
      err.code = 'PROJECT_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }
    const allMilestones = schedule.milestones || [];

    // 3. Retrieve Execution Data (Micro-activities & Execution Units)
    const execution = await executionRepository.getExecutionByProjectId(resolvedProjectId);
    const allMicroActivities = execution?.microActivities || [];
    const allExecutionUnits = execution?.executionUnits || [];

    // 4. Flatten & normalize Schedule Activities with attached Micro-activities and Milestones
    const scheduleContext = [];
    const phases = schedule.phases || [];

    for (const phase of phases) {
      const wbsNodes = phase.wbsNodes || [];
      for (const wbs of wbsNodes) {
        const activities = wbs.activities || [];
        for (const act of activities) {
          // Find matching micro-activities for this activity
          const matchingMicros = allMicroActivities.filter(
            (m) => m.activityId === act.id || m.wbsId === wbs.id
          );

          const primaryMicro = matchingMicros[0];

          // Compute planned vs actual variance
          const plannedProgress = typeof act.plannedProgress === 'number' ? act.plannedProgress : 0;
          const actualProgress = typeof act.actualProgress === 'number' ? act.actualProgress : 0;
          const variance = typeof act.variance === 'number' ? act.variance : Math.round((actualProgress - plannedProgress) * 10) / 10;

          // Find associated milestones (by WBS matching)
          const matchingMilestones = allMilestones.filter(
            (ms) => ms.wbsId === wbs.id || ms.wbsId === phase.id
          ).map((ms) => ({
            id: ms.id,
            name: ms.name,
            targetDate: ms.targetDate,
            status: ms.status || 'onTrack',
            wbsId: ms.wbsId,
          }));

          scheduleContext.push({
            activityId: act.id,
            activityName: act.name,
            wbsId: wbs.id,
            wbsName: wbs.name,
            phaseId: phase.id,
            phaseName: phase.name,
            discipline: act.discipline || primaryMicro?.discipline || null,
            contractor: act.contractor || primaryMicro?.contractor || null,
            plannedStart: act.plannedStart || null,
            plannedFinish: act.plannedFinish || null,
            plannedProgress,
            actualProgress,
            variance,
            totalFloat: typeof act.totalFloat === 'number' ? act.totalFloat : 0,
            status: act.status || 'notStarted',
            criticalPath: Boolean(act.criticalPath),
            zoneId: act.zoneId || null,
            stationingRange: act.stationingRange || null,
            milestones: matchingMilestones,
            microActivities: matchingMicros.map((m) => {
              // Calculate unit health metrics from executionUnits
              const linkedUnits = allExecutionUnits.filter((u) => u.microActivityId === m.id);
              const blockedUnits = linkedUnits.filter((u) => u.status === 'blocked').length;
              const delayedUnits = linkedUnits.filter((u) => u.status === 'delayed').length;
              const awaitingInspection = linkedUnits.filter((u) => u.status === 'awaitingInspection').length;

              const mPlanned = typeof m.plannedProgress === 'number' ? m.plannedProgress : 0;
              const mActual = typeof m.actualProgress === 'number' ? m.actualProgress : 0;
              const mVariance = typeof m.variance === 'number' ? m.variance : Math.round((mActual - mPlanned) * 10) / 10;

              return {
                microActivityId: m.id,
                activityId: m.activityId,
                name: m.name,
                wbsId: m.wbsId,
                phaseId: m.phaseId,
                discipline: m.discipline,
                contractor: m.contractor,
                unit: m.unitOfMeasure || m.unit,
                plannedQuantity: m.plannedQuantity,
                completedQuantity: m.completedQuantity,
                plannedProgress: mPlanned,
                actualProgress: mActual,
                variance: mVariance,
                status: m.status,
                evidenceCount: typeof m.evidenceCount === 'number' ? m.evidenceCount : (m.evidenceStatus === 'verified' ? 2 : 0),
                blockedUnits: blockedUnits || (m.status === 'blocked' ? 1 : 0),
                delayedUnits: delayedUnits || (m.status === 'delayed' ? 1 : 0),
                awaitingInspection: awaitingInspection || (m.status === 'awaitingInspection' ? 1 : 0),
              };
            }),
          });
        }
      }
    }

    // 5. Structure Evidence Context
    const evidenceContext = {
      evidenceId: evidence.id,
      projectId: resolvedProjectId,
      evidenceType: evidence.evidenceType || 'PHOTO',
      captureSource: evidence.captureSource || null,
      capturedAt: evidence.capturedAt || null,
      capturedBy: evidence.capturedBy || null,
      title: evidence.title || '',
      description: evidence.description || '',
      zoneId: evidence.zoneId || null,
      stationing: evidence.metadata?.stationing || null,
      gpsCoords: evidence.metadata?.gpsCoords || null,
      qualityScore: evidence.metadata?.qualityScore || null,
      tags: evidence.tags || [],
      explicitActivityId: overrideScope.activityId || evidence.activityId || null,
      explicitMicroActivityId: overrideScope.microActivityId || evidence.microActivityId || null,
      explicitWbsId: evidence.wbsId || null,
      explicitPhaseId: evidence.phaseId || null,
      fileKey: evidence.storage?.key || null,
    };

    return {
      evidenceId: evidence.id,
      projectId: resolvedProjectId,
      fileKey: evidence.storage?.key || null,
      activityId: overrideScope.activityId || evidence.activityId || null,
      microActivityId: overrideScope.microActivityId || evidence.microActivityId || null,
      evidenceContext,
      scheduleContext,
    };
  }
}

export const aiContextService = new AiContextService();
