import { alertService } from '../services/alert.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class AlertController {
  async getProjectAlerts(req, res, next) {
    try {
      const { projectId } = req.params;
      const alerts = await alertService.getAlertsByProjectId(projectId);
      return successResponse(res, alerts);
    } catch (err) {
      next(err);
    }
  }

  async getAlertById(req, res, next) {
    try {
      const { alertId } = req.params;
      const alert = await alertService.getAlertById(alertId);
      return successResponse(res, alert);
    } catch (err) {
      next(err);
    }
  }
}

export const alertController = new AlertController();
