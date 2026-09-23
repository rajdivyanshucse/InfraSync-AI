import { riskService } from '../services/risk.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class RiskController {
  async getRiskEvents(req, res, next) {
    try {
      const { projectId } = req.params;
      const riskEvents = await riskService.getRiskEvents(projectId);
      return successResponse(res, riskEvents);
    } catch (err) {
      next(err);
    }
  }

  async acknowledgeRisk(req, res, next) {
    try {
      const { projectId, riskId } = req.params;
      const acknowledged = req.body.acknowledged !== undefined ? req.body.acknowledged : true;
      const actor = req.user || req.body.actor;
      const updated = await riskService.toggleAcknowledgement(projectId, riskId, acknowledged, actor);
      return successResponse(res, updated, 200);
    } catch (err) {
      next(err);
    }
  }
}

export const riskController = new RiskController();
