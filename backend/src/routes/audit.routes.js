import { Router } from 'express';
import { auditController } from '../controllers/audit.controller.js';

const router = Router();

router.get('/audit-logs', (req, res, next) => auditController.getAuditLogs(req, res, next));
router.post('/audit-logs', (req, res, next) => auditController.logClientEvent(req, res, next));

export default router;
