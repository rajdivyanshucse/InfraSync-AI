import { Router } from 'express';
import { evidenceController } from '../controllers/evidence.controller.js';
import { validateParams } from '../middleware/validate.js';
import { handleSingleUpload } from '../middleware/upload.js';

const router = Router();

router.get('/projects/:projectId/evidence', validateParams(['projectId']), (req, res, next) => evidenceController.getProjectEvidence(req, res, next));
router.post('/projects/:projectId/evidence', validateParams(['projectId']), handleSingleUpload('file'), (req, res, next) => evidenceController.uploadEvidence(req, res, next));

router.get('/evidence/:evidenceId/file', validateParams(['evidenceId']), (req, res, next) => evidenceController.getEvidenceFile(req, res, next));
router.get('/evidence/:evidenceId', validateParams(['evidenceId']), (req, res, next) => evidenceController.getEvidenceById(req, res, next));
router.patch('/evidence/:evidenceId/review', validateParams(['evidenceId']), (req, res, next) => evidenceController.updateReviewStatus(req, res, next));
router.put('/evidence/:evidenceId/review', validateParams(['evidenceId']), (req, res, next) => evidenceController.updateReviewStatus(req, res, next));

export default router;
