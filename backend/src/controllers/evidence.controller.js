import { evidenceService } from '../services/evidence.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class EvidenceController {
  async getProjectEvidence(req, res, next) {
    try {
      const { projectId } = req.params;
      const evidence = await evidenceService.getEvidenceByProjectId(projectId);
      return successResponse(res, evidence);
    } catch (err) {
      next(err);
    }
  }

  async getEvidenceById(req, res, next) {
    try {
      const { evidenceId } = req.params;
      const evidence = await evidenceService.getEvidenceById(evidenceId);
      return successResponse(res, evidence);
    } catch (err) {
      next(err);
    }
  }

  async uploadEvidence(req, res, next) {
    try {
      const { projectId } = req.params;
      const file = req.file;
      const formData = req.body;

      const createdEvidence = await evidenceService.createEvidenceWithFile(projectId, file, formData, req.user);
      return successResponse(res, createdEvidence, 201);
    } catch (err) {
      next(err);
    }
  }

  async getEvidenceFile(req, res, next) {
    try {
      const { evidenceId } = req.params;
      const { stream, mimeType, filename, sizeBytes, checksum } = await evidenceService.getEvidenceFile(evidenceId, req.user);

      res.setHeader('Content-Type', mimeType);
      if (sizeBytes) {
        res.setHeader('Content-Length', sizeBytes);
      }
      if (checksum) {
        res.setHeader('ETag', `"${checksum}"`);
      }
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);

      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }
}

export const evidenceController = new EvidenceController();
