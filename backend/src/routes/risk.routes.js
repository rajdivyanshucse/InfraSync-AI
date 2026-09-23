import { Router } from 'express';
import { riskController } from '../controllers/risk.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/risk-events', validateParams(['projectId']), (req, res, next) => riskController.getRiskEvents(req, res, next));
router.post('/:projectId/risk-events/:riskId/acknowledge', validateParams(['projectId', 'riskId']), (req, res, next) => riskController.acknowledgeRisk(req, res, next));
router.put('/:projectId/risk-events/:riskId/acknowledge', validateParams(['projectId', 'riskId']), (req, res, next) => riskController.acknowledgeRisk(req, res, next));

export default router;
