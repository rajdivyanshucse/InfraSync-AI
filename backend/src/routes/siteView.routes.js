import { Router } from 'express';
import { siteViewController } from '../controllers/siteView.controller.js';
import { validateParams } from '../middleware/validate.js';

const router = Router();

router.get('/:projectId/site-view', validateParams(['projectId']), (req, res, next) => siteViewController.getSiteView(req, res, next));
router.get('/:projectId/zones', validateParams(['projectId']), (req, res, next) => siteViewController.getZones(req, res, next));
router.get('/:projectId/capture-points', validateParams(['projectId']), (req, res, next) => siteViewController.getCapturePoints(req, res, next));

export default router;
