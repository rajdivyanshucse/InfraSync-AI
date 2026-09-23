import crypto from 'crypto';
import { aiService } from '../services/ai.service.js';
import { aiContextService } from '../services/aiContext.service.js';
import { verificationRepository } from '../repositories/verification.repository.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Controller for AI Service proxy endpoints (Phase 21)
 */
export const getAiHealth = async (req, res) => {
  try {
    const data = await aiService.checkHealth();
    return successResponse(res, data, 200);
  } catch (err) {
    const statusCode = err.statusCode || 503;
    const code = err.code || 'AI_SERVICE_UNAVAILABLE';
    return errorResponse(res, err.message, code, statusCode);
  }
};

export const analyzeEvidence = async (req, res) => {
  try {
    const { evidenceId, projectId, activityId, microActivityId, evidenceContext, scheduleContext } = req.body || {};

    if (!evidenceId || typeof evidenceId !== 'string' || !evidenceId.trim()) {
      return errorResponse(
        res,
        'Field "evidenceId" is required and must be a non-empty string',
        'VALIDATION_ERROR',
        400
      );
    }

    if (!projectId || typeof projectId !== 'string' || !projectId.trim()) {
      return errorResponse(
        res,
        'Field "projectId" is required and must be a non-empty string',
        'VALIDATION_ERROR',
        400
      );
    }

    let payload;
    if (evidenceContext && scheduleContext) {
      // Direct context provided (e.g., in low-level unit / contract tests)
      payload = {
        evidenceId,
        projectId,
        fileKey: req.body.fileKey || null,
        activityId: activityId || null,
        microActivityId: microActivityId || null,
        evidenceContext,
        scheduleContext,
      };
    } else {
      // Build full structured domain context from repositories
      payload = await aiContextService.buildAnalysisContext(projectId, evidenceId, {
        activityId,
        microActivityId,
      });
    }

    const data = await aiService.analyzeEvidence(payload);

    // Register candidate verification proposal for human review if candidate exists
    if (data?.scheduleLink?.activityId) {
      const targetId = data.scheduleLink.activityId;
      const existing = await verificationRepository.findByTarget(projectId, evidenceId, 'schedule_link', targetId);
      if (!existing) {
        const verificationId = `VER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        await verificationRepository.create({
          verificationId,
          projectId,
          evidenceId,
          sourceAnalysisId: data.analysisId,
          targetType: 'schedule_link',
          targetId,
          status: data.scheduleLink.status === 'candidate' ? 'candidate' : 'needs_review',
          decision: null,
          reviewer: null,
          reason: null,
          candidateContext: {
            activityId: data.scheduleLink.activityId,
            activityName: data.scheduleLink.activityName,
            microActivityId: data.scheduleLink.microActivityId,
            microActivityName: data.scheduleLink.microActivityName,
            confidence: data.scheduleLink.confidence,
            confidenceBand: data.scheduleLink.confidenceBand,
            reasons: data.scheduleLink.reasons || [],
            linkType: data.scheduleLink.linkType || 'inferred',
          },
          auditHistory: [
            {
              eventId: `AUD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
              action: 'INITIALIZE_CANDIDATE',
              previousStatus: null,
              newStatus: data.scheduleLink.status === 'candidate' ? 'candidate' : 'needs_review',
              reviewer: {
                userId: 'SYSTEM',
                name: 'AI Schedule Linker Engine',
                role: 'system',
              },
              reason: 'Automated candidate proposal generated from field evidence analysis.',
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }

    // Register any candidate risk signals
    if (Array.isArray(data?.riskSignals) && data.riskSignals.length > 0) {
      for (const signal of data.riskSignals) {
        const targetId = signal.signalType;
        const existing = await verificationRepository.findByTarget(projectId, evidenceId, 'risk_signal', targetId);
        if (!existing) {
          const verificationId = `VER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          await verificationRepository.create({
            verificationId,
            projectId,
            evidenceId,
            sourceAnalysisId: data.analysisId,
            targetType: 'risk_signal',
            targetId,
            status: 'candidate',
            decision: null,
            reviewer: null,
            reason: null,
            candidateContext: {
              signalType: signal.signalType,
              severity: signal.severity,
              title: signal.title,
              triggerCondition: signal.triggerCondition,
              reasons: signal.contributingFactors || [signal.explanation],
            },
            auditHistory: [
              {
                eventId: `AUD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
                action: 'INITIALIZE_CANDIDATE',
                previousStatus: null,
                newStatus: 'candidate',
                reviewer: {
                  userId: 'SYSTEM',
                  name: 'AI Risk Analyzer Engine',
                  role: 'system',
                },
                reason: `Deterministic signal: ${signal.triggerCondition}`,
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }
      }
    }

    return successResponse(res, data, 200);
  } catch (err) {
    const statusCode = err.statusCode || 503;
    const code = err.code || 'AI_SERVICE_UNAVAILABLE';
    return errorResponse(res, err.message, code, statusCode);
  }
};
