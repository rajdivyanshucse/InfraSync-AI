import { Router } from 'express';
import projectRoutes from './project.routes.js';
import scheduleRoutes from './schedule.routes.js';
import executionRoutes from './execution.routes.js';
import evidenceRoutes from './evidence.routes.js';
import siteViewRoutes from './siteView.routes.js';
import riskRoutes from './risk.routes.js';
import alertRoutes from './alert.routes.js';
import reportRoutes from './report.routes.js';
import aiRoutes from './ai.routes.js';
import { successResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';
import { getDatabaseStatus } from '../config/database.js';

const router = Router();

// Health Check Endpoint (Exposes safe database state)
router.get('/health', (req, res) => {
  const dbStatus = getDatabaseStatus();

  return successResponse(res, {
    service: 'infrasync-api',
    status: 'ok',
    environment: config.nodeEnv,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Domain Routes (Mounted under /api)
router.use('/ai', aiRoutes);       // /ai/health, /ai/analyze
router.use('/', evidenceRoutes); // /projects/:projectId/evidence, /evidence/:evidenceId
router.use('/', alertRoutes);    // /projects/:projectId/alerts, /alerts/:alertId
router.use('/projects', scheduleRoutes);
router.use('/projects', executionRoutes);
router.use('/projects', siteViewRoutes);
router.use('/projects', riskRoutes);
router.use('/projects', reportRoutes);
router.use('/projects', projectRoutes); // /projects, /projects/:projectId

export default router;
