import { aiService } from '../services/ai.service.js';
import { aiContextService } from '../services/aiContext.service.js';
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
    return successResponse(res, data, 200);
  } catch (err) {
    const statusCode = err.statusCode || 503;
    const code = err.code || 'AI_SERVICE_UNAVAILABLE';
    return errorResponse(res, err.message, code, statusCode);
  }
};
