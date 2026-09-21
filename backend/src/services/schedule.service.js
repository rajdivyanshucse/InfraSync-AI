import { scheduleRepository } from '../repositories/schedule.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class ScheduleService {
  async getSchedule(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    const schedule = await scheduleRepository.getScheduleByProjectId(projectId);
    if (!schedule) {
      return {
        projectId,
        baselineId: 'BL-P6-DEFAULT',
        milestones: [],
        phases: [],
        activities: [],
      };
    }
    return schedule;
  }

  async getMilestones(projectId) {
    await this.getSchedule(projectId); // Ensures project exists
    return await scheduleRepository.getMilestonesByProjectId(projectId);
  }

  async getActivities(projectId) {
    await this.getSchedule(projectId); // Ensures project exists
    return await scheduleRepository.getActivitiesByProjectId(projectId);
  }
}

export const scheduleService = new ScheduleService();
