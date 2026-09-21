import { aiConfig } from '../config/ai.js';

/**
 * InfraSync AI — AI Service Client
 * Handles communication with the isolated Python FastAPI AI service.
 * Enforces timeouts, error handling, and safe error normalization.
 */
export class AiService {
  constructor(config = aiConfig) {
    this.serviceUrl = config.serviceUrl;
    this.timeoutMs = config.timeoutMs;
  }

  /**
   * Health check proxy to Python AI service
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(`${this.serviceUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`AI service responded with status ${response.status}`);
      }

      const body = await response.json();
      if (!body || !body.data) {
        throw new Error('Malformed AI service health response');
      }

      return body.data;
    } catch (err) {
      const isTimeout = err.name === 'AbortError' || err.code === 'ABORT_ERR';
      const customError = new Error(
        isTimeout ? 'AI analysis service request timed out' : 'AI analysis service is unavailable'
      );
      customError.code = 'AI_SERVICE_UNAVAILABLE';
      customError.statusCode = 503;
      throw customError;
    }
  }

  /**
   * Request evidence analysis from Python AI service
   * @param {Object} payload - { evidenceId, projectId, fileKey, activityId, microActivityId }
   */
  async analyzeEvidence(payload) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(`${this.serviceUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          evidenceId: payload.evidenceId,
          projectId: payload.projectId,
          fileKey: payload.fileKey || null,
          activityId: payload.activityId || null,
          microActivityId: payload.microActivityId || null,
          evidenceContext: payload.evidenceContext || null,
          scheduleContext: payload.scheduleContext || [],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 422) {
          const validationErr = new Error('Invalid analysis request payload');
          validationErr.code = 'VALIDATION_ERROR';
          validationErr.statusCode = 400;
          throw validationErr;
        }
        throw new Error(`AI service returned HTTP ${response.status}`);
      }

      const body = await response.json();
      if (!body || !body.data) {
        throw new Error('Malformed AI service analysis response');
      }

      return body.data;
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        throw err;
      }
      const isTimeout = err.name === 'AbortError' || err.code === 'ABORT_ERR';
      const customError = new Error(
        isTimeout ? 'AI analysis service request timed out' : 'AI analysis service is unavailable'
      );
      customError.code = 'AI_SERVICE_UNAVAILABLE';
      customError.statusCode = 503;
      throw customError;
    }
  }
}

export const aiService = new AiService();
