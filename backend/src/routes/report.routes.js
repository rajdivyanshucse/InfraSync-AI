import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/reports/summary', validateParams(['projectId']), (req, res, next) => reportController.getSummary(req, res, next));

export default router;
