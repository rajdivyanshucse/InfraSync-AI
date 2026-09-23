import { systemAuditService } from '../services/systemAudit.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class AuditController {
  async getAuditLogs(req, res, next) {
    try {
      const { action, projectId, limit } = req.query;
      const filters = {};
      if (action) filters.action = action;
      if (projectId) filters.projectId = projectId;
      if (limit) filters.limit = parseInt(limit, 10);

      const logs = await systemAuditService.getEvents(filters);
      return successResponse(res, logs);
    } catch (err) {
      next(err);
    }
  }

  async logClientEvent(req, res, next) {
    try {
      const { action, message, metadata, target } = req.body;
      const actor = req.user || req.body.actor || {
        userId: 'USR-CLIENT',
        name: 'Client User',
        role: 'user',
      };

      const record = await systemAuditService.logEvent({
        action: action || 'CLIENT_ACTION',
        actor,
        target: target || {},
        message: message || '',
        metadata: metadata || {},
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'InfraSync-Client',
      });

      return successResponse(res, record, 201, 'Audit log event recorded successfully.');
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();
export default auditController;
