import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/', (req, res, next) => projectController.getProjects(req, res, next));
router.get('/:projectId', validateParams(['projectId']), (req, res, next) => projectController.getProjectById(req, res, next));

export default router;
