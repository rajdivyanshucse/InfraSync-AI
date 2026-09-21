import { evidenceRepository } from '../repositories/evidence.repository.js';
import { scheduleRepository } from '../repositories/schedule.repository.js';
import { executionRepository } from '../repositories/execution.repository.js';

/**
 * InfraSync AI — AI Context Builder Service (Phase 21)
 * Retrieves and normalizes domain entities (evidence, schedule, micro-activities)
 * into a structured context payload for the Python schedule-linking engine.
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

    // 2. Retrieve Schedule
    const schedule = await scheduleRepository.getScheduleByProjectId(resolvedProjectId);
    if (!schedule) {
      const err = new Error(`Project schedule not found for project: ${resolvedProjectId}`);
      err.code = 'PROJECT_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    // 3. Retrieve Execution Data (Micro-activities & Execution Units)
    const execution = await executionRepository.getExecutionByProjectId(resolvedProjectId);
    const allMicroActivities = execution?.microActivities || [];

    // 4. Flatten & normalize Schedule Activities with attached Micro-activities
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
            plannedProgress: act.plannedProgress || 0,
            actualProgress: act.actualProgress || 0,
            status: act.status || 'notStarted',
            criticalPath: Boolean(act.criticalPath),
            zoneId: act.zoneId || null,
            stationingRange: act.stationingRange || null,
            microActivities: matchingMicros.map((m) => ({
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
              actualProgress: m.actualProgress,
              status: m.status,
            })),
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
