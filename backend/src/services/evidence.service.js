import { evidenceRepository } from '../repositories/evidence.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { storageService } from '../storage/storage.service.js';
import { getCategoryForMimeType } from '../storage/storage.types.js';
import { systemAuditService } from './systemAudit.service.js';

export class EvidenceService {
  async getEvidenceByProjectId(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }
    return await evidenceRepository.findByProjectId(projectId);
  }

  async getEvidenceById(evidenceId) {
    const evidence = await evidenceRepository.findById(evidenceId);
    if (!evidence) {
      const error = new Error(`Evidence record not found: ${evidenceId}`);
      error.statusCode = 404;
      error.code = 'EVIDENCE_NOT_FOUND';
      throw error;
    }
    return evidence;
  }

  /**
   * Uploads file to storage and creates Evidence record with rollback on failure
   */
  async createEvidenceWithFile(projectId, file, formData = {}, userContext = null) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    if (!file) {
      const error = new Error('No file uploaded. Evidence creation requires an evidence file.');
      error.statusCode = 400;
      error.code = 'FILE_REQUIRED';
      throw error;
    }

    // 1. Save file to storage
    const storageMeta = await storageService.saveEvidenceFile(file);

    // 2. Build domain model
    const evidenceId = formData.id || `EV-${Date.now().toString().slice(-6)}`;
    const inferredType = getCategoryForMimeType(file.mimetype);

    const evidencePayload = {
      id: evidenceId,
      projectId,
      title: formData.title || file.originalname || 'Uploaded Field Evidence',
      description: formData.description || `Field capture uploaded on ${new Date().toLocaleDateString()}`,
      microActivityId: formData.microActivityId || undefined,
      activityId: formData.activityId || undefined,
      zoneId: formData.zoneId || undefined,
      evidenceType: inferredType,
      captureSource: formData.captureSource || 'MANUAL_UPLOAD',
      verificationStatus: 'pendingReview',
      capturedAt: formData.capturedAt || new Date().toISOString(),
      capturedBy: userContext?.name || formData.capturedBy || 'Site Operator',
      metadata: {
        stationing: formData.stationing || formData.metadata?.stationing || undefined,
        gpsCoords: formData.gpsCoords || formData.metadata?.gpsCoords || undefined,
        qualityScore: parseInt(formData.qualityScore || '90', 10),
      },
      storage: storageMeta,
    };

    // 3. Persist metadata with orphan file cleanup rollback
    try {
      const result = await evidenceRepository.create(evidencePayload);

      await systemAuditService.logEvent({
        action: 'FILE_UPLOAD',
        actor: userContext || { userId: 'USR-UPLOAD', role: 'site_engineer', name: 'Site Operator' },
        target: { type: 'evidence', id: evidenceId, projectId },
        message: `Uploaded evidence file: ${file.originalname} (${storageMeta.sizeBytes} bytes)`,
        metadata: { checksum: storageMeta.checksum, mimeType: storageMeta.mimeType },
      });

      return result;
    } catch (dbErr) {
      console.warn(`[EvidenceService] Database metadata save failed. Cleaning up orphan storage file: ${storageMeta.key}`);
      await storageService.deleteEvidenceFile(storageMeta.key);
      throw dbErr;
    }
  }

  /**
   * Retrieves file stream for evidence download/preview
   */
  async getEvidenceFile(evidenceId, userContext = null) {
    const evidence = await this.getEvidenceById(evidenceId);

    // Scope check: If user context is provided, ensure permitted project scope
    if (userContext && evidence.projectId) {
      const role = (userContext.role || '').toLowerCase().trim();
      if (!['project_authority', 'admin', 'administrator'].includes(role)) {
        const permitted = userContext.permittedProjects || [];
        if (!permitted.includes(evidence.projectId)) {
          const error = new Error(`Access denied: User not authorized to download files for project '${evidence.projectId}'.`);
          error.statusCode = 403;
          error.code = 'PROJECT_ACCESS_DENIED';
          throw error;
        }
      }
    }

    if (!evidence.storage || !evidence.storage.key) {
      const error = new Error(`No physical file is associated with prototype evidence: ${evidenceId}`);
      error.statusCode = 404;
      error.code = 'EVIDENCE_FILE_NOT_AVAILABLE';
      throw error;
    }

    const stream = await storageService.getEvidenceStream(evidence.storage.key);
    if (!stream) {
      const error = new Error(`Physical evidence file not found on disk: ${evidence.storage.key}`);
      error.statusCode = 404;
      error.code = 'EVIDENCE_FILE_NOT_FOUND';
      throw error;
    }

    await systemAuditService.logEvent({
      action: 'FILE_DOWNLOAD',
      actor: userContext || { userId: 'ANONYMOUS', role: 'viewer', name: 'Evidence Viewer' },
      target: { type: 'evidence_file', id: evidenceId, projectId: evidence.projectId },
      message: `Streamed file for evidence ${evidenceId}`,
      metadata: { key: evidence.storage.key },
    });

    return {
      stream,
      mimeType: evidence.storage.mimeType || 'application/octet-stream',
      filename: evidence.storage.originalName || `${evidenceId}.bin`,
      sizeBytes: evidence.storage.sizeBytes,
      checksum: evidence.storage.checksum,
    };
  }
}

export const evidenceService = new EvidenceService();
export default evidenceService;
