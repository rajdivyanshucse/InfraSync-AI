import { Router } from 'express';
import { executionController } from '../controllers/execution.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/execution', validateParams(['projectId']), (req, res, next) => executionController.getExecution(req, res, next));
router.get('/:projectId/micro-activities', validateParams(['projectId']), (req, res, next) => executionController.getMicroActivities(req, res, next));
router.get('/:projectId/execution-units', validateParams(['projectId']), (req, res, next) => executionController.getExecutionUnits(req, res, next));

export default router;
