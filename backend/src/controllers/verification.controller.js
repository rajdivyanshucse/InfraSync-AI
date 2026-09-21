import { verificationService } from '../services/verification.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class VerificationController {
  /**
   * GET /api/projects/:projectId/verifications
   */
  async getVerifications(req, res, next) {
    try {
      const { projectId } = req.params;
      const { status, targetType, evidenceId } = req.query;

      const data = await verificationService.getVerifications(projectId, {
        status,
        targetType,
        evidenceId,
      });

      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/verifications/:verificationId
   */
  async getVerificationById(req, res, next) {
    try {
      const { verificationId } = req.params;
      const data = await verificationService.getVerificationById(verificationId);
      return successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/verifications/verify
   */
  async verifyFinding(req, res, next) {
    try {
      const payload = req.body;
      const userContext = req.user || payload.reviewer || null;
      const data = await verificationService.verifyFinding(payload, userContext);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/verifications/reject
   */
  async rejectFinding(req, res, next) {
    try {
      const payload = req.body;
      const userContext = req.user || payload.reviewer || null;
      const data = await verificationService.rejectFinding(payload, userContext);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/verifications/:targetType/:targetId/verify
   */
  async verifyTargetParam(req, res, next) {
    try {
      const { targetType, targetId } = req.params;
      const payload = {
        ...req.body,
        targetType,
        targetId,
      };
      const userContext = req.user || payload.reviewer || null;
      const data = await verificationService.verifyFinding(payload, userContext);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/verifications/:targetType/:targetId/reject
   */
  async rejectTargetParam(req, res, next) {
    try {
      const { targetType, targetId } = req.params;
      const payload = {
        ...req.body,
        targetType,
        targetId,
      };
      const userContext = req.user || payload.reviewer || null;
      const data = await verificationService.rejectFinding(payload, userContext);
      return successResponse(res, data, 200);
    } catch (err) {
      next(err);
    }
  }
}

export const verificationController = new VerificationController();
export default verificationController;
