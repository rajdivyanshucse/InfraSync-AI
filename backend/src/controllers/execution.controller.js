import { executionService } from '../services/execution.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class ExecutionController {
  async getExecution(req, res, next) {
    try {
      const { projectId } = req.params;
      const execution = await executionService.getExecution(projectId);
      return successResponse(res, execution);
    } catch (err) {
      next(err);
    }
  }

  async getMicroActivities(req, res, next) {
    try {
      const { projectId } = req.params;
      const microActivities = await executionService.getMicroActivities(projectId);
      return successResponse(res, microActivities);
    } catch (err) {
      next(err);
    }
  }

  async getExecutionUnits(req, res, next) {
    try {
      const { projectId } = req.params;
      const executionUnits = await executionService.getExecutionUnits(projectId);
      return successResponse(res, executionUnits);
    } catch (err) {
      next(err);
    }
  }
}

export const executionController = new ExecutionController();
