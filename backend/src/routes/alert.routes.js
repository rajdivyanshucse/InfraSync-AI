import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/projects/:projectId/alerts', validateParams(['projectId']), (req, res, next) => alertController.getProjectAlerts(req, res, next));
router.get('/alerts/:alertId', validateParams(['alertId']), (req, res, next) => alertController.getAlertById(req, res, next));
router.put('/alerts/:alertId', validateParams(['alertId']), (req, res, next) => alertController.updateIntervention(req, res, next));
router.post('/alerts/:alertId/intervention', validateParams(['alertId']), (req, res, next) => alertController.updateIntervention(req, res, next));
router.post('/alerts/:alertId/signoff', validateParams(['alertId']), (req, res, next) => alertController.signoffAlert(req, res, next));

export default router;
