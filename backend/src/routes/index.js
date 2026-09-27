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
import verificationRoutes from './verification.routes.js';
import auditRoutes from './audit.routes.js';
import { successResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';
import { getDatabaseStatus } from '../config/database.js';

const router = Router();

// Liveness Check Endpoint (Process is alive)
router.get('/health', (req, res) => {
  const dbStatus = getDatabaseStatus();

  return successResponse(res, {
    service: 'infrasync-api',
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Readiness Check Endpoint (Can process live requests)
router.get('/ready', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isDbReady = config.dataSource === 'mock' || dbStatus.status === 'connected';

  const readinessData = {
    service: 'infrasync-api',
    status: isDbReady ? 'ready' : 'not_ready',
    environment: config.nodeEnv,
    dataSource: config.dataSource,
    database: dbStatus,
    storage: {
      provider: config.storageProvider,
      root: config.storageRoot,
    },
    ready: isDbReady,
    timestamp: new Date().toISOString(),
  };

  if (!isDbReady) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_NOT_READY',
        message: 'Persistent database dependency is not connected',
        details: readinessData,
      },
    });
  }

  return successResponse(res, readinessData);
});

// Domain Routes (Mounted under /api)
router.use('/ai', aiRoutes);       // /ai/health, /ai/analyze
router.use('/', auditRoutes);     // /audit-logs
router.use('/', evidenceRoutes); // /projects/:projectId/evidence, /evidence/:evidenceId
router.use('/', alertRoutes);    // /projects/:projectId/alerts, /alerts/:alertId
router.use('/', verificationRoutes); // /projects/:projectId/verifications, /verifications/:verificationId
router.use('/projects', scheduleRoutes);
router.use('/projects', executionRoutes);
router.use('/projects', siteViewRoutes);
router.use('/projects', riskRoutes);
router.use('/projects', reportRoutes);
router.use('/projects', projectRoutes); // /projects, /projects/:projectId

export default router;

