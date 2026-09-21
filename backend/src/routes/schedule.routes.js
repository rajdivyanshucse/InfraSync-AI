import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/schedule', validateParams(['projectId']), (req, res, next) => scheduleController.getSchedule(req, res, next));
router.get('/:projectId/milestones', validateParams(['projectId']), (req, res, next) => scheduleController.getMilestones(req, res, next));
router.get('/:projectId/activities', validateParams(['projectId']), (req, res, next) => scheduleController.getActivities(req, res, next));

export default router;
