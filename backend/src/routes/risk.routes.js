import { Router } from 'express';
import { riskController } from '../controllers/risk.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/risk-events', validateParams(['projectId']), (req, res, next) => riskController.getRiskEvents(req, res, next));

export default router;
