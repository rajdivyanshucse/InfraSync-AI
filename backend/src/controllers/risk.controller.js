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
}

export const riskController = new RiskController();
