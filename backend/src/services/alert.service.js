import { alertRepository } from '../repositories/alert.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class AlertService {
  async getAlertsByProjectId(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }
    return await alertRepository.findByProjectId(projectId);
  }

  async getAlertById(alertId) {
    const alert = await alertRepository.findById(alertId);
    if (!alert) {
      const error = new Error(`Alert record not found: ${alertId}`);
      error.statusCode = 404;
      error.code = 'ALERT_NOT_FOUND';
      throw error;
    }
    return alert;
  }
}

export const alertService = new AlertService();
