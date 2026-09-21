import { siteViewService } from '../services/siteView.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class SiteViewController {
  async getSiteView(req, res, next) {
    try {
      const { projectId } = req.params;
      const siteView = await siteViewService.getSiteView(projectId);
      return successResponse(res, siteView);
    } catch (err) {
      next(err);
    }
  }

  async getZones(req, res, next) {
    try {
      const { projectId } = req.params;
      const zones = await siteViewService.getZones(projectId);
      return successResponse(res, zones);
    } catch (err) {
      next(err);
    }
  }

  async getCapturePoints(req, res, next) {
    try {
      const { projectId } = req.params;
      const capturePoints = await siteViewService.getCapturePoints(projectId);
      return successResponse(res, capturePoints);
    } catch (err) {
      next(err);
    }
  }
}

export const siteViewController = new SiteViewController();
