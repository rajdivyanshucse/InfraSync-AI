import { reportService } from '../services/report.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class ReportController {
  async getSummary(req, res, next) {
    try {
      const { projectId } = req.params;
      const summary = await reportService.getSummary(projectId);
      return successResponse(res, summary);
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();
