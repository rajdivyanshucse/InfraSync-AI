import { riskRepository } from '../repositories/risk.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { systemAuditService } from './systemAudit.service.js';

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

  async toggleAcknowledgement(projectId, riskId, acknowledged, actor = null) {
    const updated = await riskRepository.updateAcknowledgement(projectId, riskId, acknowledged, actor);

    // Immutable system audit log
    await systemAuditService.logEvent({
      action: acknowledged ? 'RISK_ACKNOWLEDGED' : 'RISK_UNACKNOWLEDGED',
      actor: {
        userId: actor?.userId || 'USR-AUTH',
        name: actor?.name || 'Authorized User',
        role: actor?.role || 'project_manager',
      },
      target: {
        projectId,
        entityType: 'RISK_EVENT',
        entityId: riskId,
      },
      message: `Early warning risk event ${riskId} was ${acknowledged ? 'acknowledged' : 'unacknowledged'} by ${actor?.name || 'Authorized User'}.`,
      metadata: {
        acknowledged,
        riskId,
      },
    });

    return updated;
  }
}

export const riskService = new RiskService();
