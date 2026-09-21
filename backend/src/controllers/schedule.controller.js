import { scheduleService } from '../services/schedule.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class ScheduleController {
  async getSchedule(req, res, next) {
    try {
      const { projectId } = req.params;
      const schedule = await scheduleService.getSchedule(projectId);
      return successResponse(res, schedule);
    } catch (err) {
      next(err);
    }
  }

  async getMilestones(req, res, next) {
    try {
      const { projectId } = req.params;
      const milestones = await scheduleService.getMilestones(projectId);
      return successResponse(res, milestones);
    } catch (err) {
      next(err);
    }
  }

  async getActivities(req, res, next) {
    try {
      const { projectId } = req.params;
      const activities = await scheduleService.getActivities(projectId);
      return successResponse(res, activities);
    } catch (err) {
      next(err);
    }
  }
}

export const scheduleController = new ScheduleController();
