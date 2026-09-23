import { alertRepository } from '../repositories/alert.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { systemAuditService } from './systemAudit.service.js';

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

  async updateAlertIntervention(projectId, alertId, payload, actor = null) {
    let alert = await alertRepository.findById(alertId);
    const timestamp = new Date().toISOString();

    const intervention = {
      assignedTo: payload.assignedTo || payload.intervention?.assignedTo || alert?.intervention?.assignedTo || 'Unassigned',
      contractorContact: payload.contractorContact || payload.intervention?.contractorContact || alert?.intervention?.contractorContact,
      actionPlan: payload.actionPlan || payload.intervention?.actionPlan || alert?.intervention?.actionPlan,
      targetDate: payload.targetDate || payload.intervention?.targetDate || alert?.intervention?.targetDate,
      remarks: payload.remarks || payload.intervention?.remarks || alert?.intervention?.remarks,
      updatedAt: timestamp,
      updatedBy: actor?.name || actor?.userId || 'Authorized User',
    };

    const newStatus = payload.status || (alert?.status === 'new' ? 'in_progress' : alert?.status || 'in_progress');
    const existingHistory = Array.isArray(alert?.workflowHistory) ? alert.workflowHistory : [];

    const newHistoryEntry = {
      action: payload.historyAction || 'INTERVENTION_UPDATED',
      actor: actor?.name || actor?.userId || 'Authorized User',
      timestamp,
      note: payload.remarks || payload.actionPlan || 'Operational intervention updated.',
    };

    const updates = {
      status: newStatus,
      intervention,
      workflowHistory: [newHistoryEntry, ...existingHistory],
    };

    if (payload.escalationLevel) {
      updates.escalationLevel = payload.escalationLevel;
    }

    const updatedAlert = await alertRepository.update(alertId, updates);

    // Immutable system audit log
    await systemAuditService.logEvent({
      action: 'ALERT_INTERVENTION_UPDATED',
      actor: {
        userId: actor?.userId || 'USR-AUTH',
        name: actor?.name || 'Authorized User',
        role: actor?.role || 'project_manager',
      },
      target: {
        projectId: projectId || alert?.projectId,
        entityType: 'ALERT',
        entityId: alertId,
      },
      message: `Operational alert ${alertId} intervention updated by ${actor?.name || 'Authorized User'}.`,
      metadata: {
        previousStatus: alert?.status,
        newStatus,
        intervention,
      },
    });

    return updatedAlert;
  }

  async signoffAlert(projectId, alertId, payload, actor = null) {
    const alert = await alertRepository.findById(alertId);
    const timestamp = new Date().toISOString();

    const signoff = {
      signedOffBy: actor?.name || actor?.userId || payload.signedOffBy || 'Project Authority',
      role: actor?.role || payload.role || 'project_authority',
      timestamp,
      notes: payload.notes || payload.remarks || 'Intervention sign-off completed successfully.',
    };

    const existingHistory = Array.isArray(alert?.workflowHistory) ? alert.workflowHistory : [];
    const newHistoryEntry = {
      action: 'INTERVENTION_RESOLVED',
      actor: signoff.signedOffBy,
      timestamp,
      note: signoff.notes,
    };

    const updates = {
      status: 'resolved',
      signoff,
      workflowHistory: [newHistoryEntry, ...existingHistory],
    };

    const updatedAlert = await alertRepository.update(alertId, updates);

    // Immutable system audit log
    await systemAuditService.logEvent({
      action: 'ALERT_RESOLVED_SIGNOFF',
      actor: {
        userId: actor?.userId || 'USR-AUTH',
        name: signoff.signedOffBy,
        role: signoff.role,
      },
      target: {
        projectId: projectId || alert?.projectId,
        entityType: 'ALERT',
        entityId: alertId,
      },
      message: `Operational alert ${alertId} sign-off and closure recorded.`,
      metadata: { signoff },
    });

    return updatedAlert;
  }
}

export const alertService = new AlertService();
