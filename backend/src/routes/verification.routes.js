import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller.js';

const router = Router();

// Project-scoped list endpoint
router.get('/projects/:projectId/verifications', (req, res, next) => {
  verificationController.getVerifications(req, res, next);
});

// Single verification retrieval
router.get('/verifications/:verificationId', (req, res, next) => {
  verificationController.getVerificationById(req, res, next);
});

// Decision endpoints
router.post('/verifications/verify', (req, res, next) => {
  verificationController.verifyFinding(req, res, next);
});

router.post('/verifications/reject', (req, res, next) => {
  verificationController.rejectFinding(req, res, next);
});

// Parameterized decision endpoints
router.post('/verifications/:targetType/:targetId/verify', (req, res, next) => {
  verificationController.verifyTargetParam(req, res, next);
});

router.post('/verifications/:targetType/:targetId/reject', (req, res, next) => {
  verificationController.rejectTargetParam(req, res, next);
});

export default router;
