import { riskRepository } from '../repositories/risk.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class RiskService {
  async getRiskEvents(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }
    return await riskRepository.getRiskEventsByProjectId(projectId);
  }
}

export const riskService = new RiskService();
