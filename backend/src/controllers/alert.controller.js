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

  async updateIntervention(req, res, next) {
    try {
      const { alertId } = req.params;
      const projectId = req.params.projectId || req.body.projectId;
      const actor = req.user || req.body.actor;
      const updated = await alertService.updateAlertIntervention(projectId, alertId, req.body, actor);
      return successResponse(res, updated, 200);
    } catch (err) {
      next(err);
    }
  }

  async signoffAlert(req, res, next) {
    try {
      const { alertId } = req.params;
      const projectId = req.params.projectId || req.body.projectId;
      const actor = req.user || req.body.actor;
      const updated = await alertService.signoffAlert(projectId, alertId, req.body, actor);
      return successResponse(res, updated, 200);
    } catch (err) {
      next(err);
    }
  }
}

export const alertController = new AlertController();
