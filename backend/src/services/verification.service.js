import crypto from 'crypto';
import { verificationRepository } from '../repositories/verification.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { evidenceRepository } from '../repositories/evidence.repository.js';
import { systemAuditService } from './systemAudit.service.js';

const ALLOWED_VERIFICATION_ROLES = [
  'project_authority',
  'project_manager',
  'site_engineer',
  'discipline_manager',
  'administrator',
  'admin',
];

export class VerificationService {
  /**
   * List all verifications for a project with optional filters (status, targetType, evidenceId)
   */
  async getVerifications(projectId, filters = {}) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    return verificationRepository.findByProjectId(projectId, filters);
  }

  /**
   * Get single verification by ID
   */
  async getVerificationById(verificationId) {
    const verification = await verificationRepository.findById(verificationId);
    if (!verification) {
      const error = new Error(`Verification record not found: ${verificationId}`);
      error.statusCode = 404;
      error.code = 'VERIFICATION_NOT_FOUND';
      throw error;
    }
    return verification;
  }

  /**
   * Authoritative Verification Decision: VERIFY
   */
  async verifyFinding(payload, userContext = null) {
    return this._processDecision(payload, 'verified', userContext);
  }

  /**
   * Authoritative Verification Decision: REJECT
   */
  async rejectFinding(payload, userContext = null) {
    return this._processDecision(payload, 'rejected', userContext);
  }

  /**
   * Core Decision Processor
   */
  async _processDecision(payload, decision, userContext = null) {
    const {
      projectId,
      evidenceId,
      targetType,
      targetId,
      reason,
      sourceAnalysisId,
      candidateContext,
    } = payload;

    // 1. Mandatory Fields Validation
    if (!projectId || !evidenceId || !targetType || !targetId) {
      const error = new Error('Missing required fields: projectId, evidenceId, targetType, targetId are required.');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    if (!['schedule_link', 'risk_signal'].includes(targetType)) {
      const error = new Error(`Invalid targetType '${targetType}'. Must be 'schedule_link' or 'risk_signal'.`);
      error.statusCode = 400;
      error.code = 'INVALID_TARGET_TYPE';
      throw error;
    }

    // 2. Mandatory Reason Validation
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      const error = new Error('A valid, non-empty review justification reason is required to record a decision.');
      error.statusCode = 400;
      error.code = 'MISSING_REASON';
      throw error;
    }

    // 3. Resolve Reviewer Identity from authenticated user context or payload
    const reviewer = userContext || payload.reviewer || {
      userId: 'USR-DEFAULT',
      name: 'Authorized Reviewer',
      role: 'project_manager',
    };

    const roleNormalized = (reviewer.role || '').toLowerCase().trim();

    // 4. Role Authorization Enforcement
    if (!ALLOWED_VERIFICATION_ROLES.includes(roleNormalized)) {
      const error = new Error(
        `Role '${reviewer.role || 'unknown'}' is not authorized to verify or reject project findings. ` +
        `Only Project Authority, Project Manager, Site Engineer, or Discipline Manager can make authoritative decisions.`
      );
      error.statusCode = 403;
      error.code = 'FORBIDDEN_ROLE';
      throw error;
    }

    // 5. Verify Project Existence First
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    // Project-Scope Enforcement
    if (reviewer.permittedProjects && Array.isArray(reviewer.permittedProjects) && !['project_authority', 'admin', 'administrator'].includes(roleNormalized)) {
      if (!reviewer.permittedProjects.includes(projectId)) {
        const error = new Error(`Access denied: User not authorized to perform actions in project '${projectId}'.`);
        error.statusCode = 403;
        error.code = 'PROJECT_ACCESS_DENIED';
        throw error;
      }
    }

    const evidence = await evidenceRepository.findById(evidenceId);
    if (!evidence) {
      const error = new Error(`Evidence record not found: ${evidenceId}`);
      error.statusCode = 404;
      error.code = 'EVIDENCE_NOT_FOUND';
      throw error;
    }

    // 6. Find existing verification record or initialize a new one
    let record = await verificationRepository.findByTarget(projectId, evidenceId, targetType, targetId);
    const decidedAt = new Date().toISOString();
    const eventId = `AUD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    if (!record) {
      const verificationId = `VER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const previousStatus = 'candidate';
      const action = decision === 'verified' ? 'VERIFY' : 'REJECT';

      const initialAuditHistory = [
        {
          eventId: `AUD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          action: 'INITIALIZE_CANDIDATE',
          previousStatus: null,
          newStatus: 'candidate',
          reviewer: {
            userId: 'SYSTEM',
            name: 'AI Intelligence Service',
            role: 'system',
          },
          reason: 'Initial candidate generated by AI inference engine.',
          timestamp: decidedAt,
        },
        {
          eventId,
          action,
          previousStatus,
          newStatus: decision,
          reviewer: {
            userId: reviewer.userId || 'USR-AUTH',
            name: reviewer.name || 'Authorized Reviewer',
            role: roleNormalized,
          },
          reason: reason.trim(),
          timestamp: decidedAt,
        },
      ];

      const newRecordPayload = {
        verificationId,
        projectId,
        evidenceId,
        sourceAnalysisId: sourceAnalysisId || evidence.sourceAnalysisId || null,
        targetType,
        targetId,
        status: decision,
        decision,
        reviewer: {
          userId: reviewer.userId || 'USR-AUTH',
          name: reviewer.name || 'Authorized Reviewer',
          role: roleNormalized,
        },
        reason: reason.trim(),
        decidedAt,
        candidateContext: candidateContext || {},
        auditHistory: initialAuditHistory,
      };

      const created = await verificationRepository.create(newRecordPayload);
      try {
        await systemAuditService.recordEvent({
          eventType: action === 'VERIFY' ? 'VERIFICATION' : 'REJECTION',
          userId: reviewer.userId || 'USR-AUTH',
          role: roleNormalized,
          projectId,
          resourceType: 'verification',
          resourceId: created.verificationId,
          action: `${action}_${targetType.toUpperCase()}`,
          metadata: { targetId, reason },
        });
      } catch (auditErr) {
        console.warn('[Audit] Failed to log system audit:', auditErr.message);
      }
      return created;
    }

    // 7. Update existing record with append-only audit event
    const previousStatus = record.status || 'candidate';
    const action = decision === 'verified' ? 'VERIFY' : 'REJECT';

    const newAuditEvent = {
      eventId,
      action: previousStatus === decision ? 'OVERRIDE' : action,
      previousStatus,
      newStatus: decision,
      reviewer: {
        userId: reviewer.userId || record.reviewer?.userId || 'USR-AUTH',
        name: reviewer.name || record.reviewer?.name || 'Authorized Reviewer',
        role: roleNormalized,
      },
      reason: reason.trim(),
      timestamp: decidedAt,
    };

    const updatedAuditHistory = [...(record.auditHistory || []), newAuditEvent];

    const updates = {
      status: decision,
      decision,
      reviewer: {
        userId: reviewer.userId || 'USR-AUTH',
        name: reviewer.name || 'Authorized Reviewer',
        role: roleNormalized,
      },
      reason: reason.trim(),
      decidedAt,
      auditHistory: updatedAuditHistory,
    };

    if (candidateContext && Object.keys(candidateContext).length > 0) {
      updates.candidateContext = { ...record.candidateContext, ...candidateContext };
    }

    const updated = await verificationRepository.update(record.verificationId, updates);
    try {
      await systemAuditService.recordEvent({
        eventType: action === 'VERIFY' ? 'VERIFICATION' : 'REJECTION',
        userId: reviewer.userId || 'USR-AUTH',
        role: roleNormalized,
        projectId,
        resourceType: 'verification',
        resourceId: updated.verificationId,
        action: `${action}_${targetType.toUpperCase()}`,
        metadata: { targetId, reason },
      });
    } catch (auditErr) {
      console.warn('[Audit] Failed to log system audit:', auditErr.message);
    }
    return updated;
  }
}

export const verificationService = new VerificationService();
export default verificationService;
