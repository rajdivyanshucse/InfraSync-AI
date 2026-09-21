import { evidenceRepository } from '../repositories/evidence.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { storageService } from '../storage/storage.service.js';
import { getCategoryForMimeType } from '../storage/storage.types.js';

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
  async createEvidenceWithFile(projectId, file, formData = {}) {
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
      evidenceType: formData.evidenceType || inferredType,
      captureSource: formData.captureSource || 'Direct Upload',
      verificationStatus: formData.verificationStatus || 'pendingReview',
      capturedAt: formData.capturedAt || new Date().toISOString(),
      capturedBy: formData.capturedBy || 'Authorized Field User',
      metadata: {
        stationing: formData.stationing || formData.metadata?.stationing || undefined,
        gpsCoords: formData.gpsCoords || formData.metadata?.gpsCoords || undefined,
        qualityScore: parseInt(formData.qualityScore || '90', 10),
      },
      storage: storageMeta,
    };

    // 3. Persist metadata with orphan file cleanup rollback
    try {
      return await evidenceRepository.create(evidencePayload);
    } catch (dbErr) {
      console.warn(`[EvidenceService] Database metadata save failed. Cleaning up orphan storage file: ${storageMeta.key}`);
      await storageService.deleteEvidenceFile(storageMeta.key);
      throw dbErr;
    }
  }

  /**
   * Retrieves file stream for evidence download/preview
   */
  async getEvidenceFile(evidenceId) {
    const evidence = await this.getEvidenceById(evidenceId);

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
