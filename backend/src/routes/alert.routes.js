import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/projects/:projectId/alerts', validateParams(['projectId']), (req, res, next) => alertController.getProjectAlerts(req, res, next));
router.get('/alerts/:alertId', validateParams(['alertId']), (req, res, next) => alertController.getAlertById(req, res, next));

export default router;
