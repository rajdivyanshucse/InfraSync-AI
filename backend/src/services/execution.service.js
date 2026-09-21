import { executionRepository } from '../repositories/execution.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class ExecutionService {
  async getExecution(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    const execution = await executionRepository.getExecutionByProjectId(projectId);
    if (!execution) {
      return {
        projectId,
        summary: {
          totalMicroActivities: 0,
          totalExecutionUnits: 0,
          plannedQuantity: 0,
          completedQuantity: 0,
          remainingQuantity: 0,
          plannedProgress: 0,
          actualProgress: 0,
          variance: 0,
          blockedUnits: 0,
          delayedUnits: 0,
          awaitingInspection: 0,
        },
        microActivities: [],
        executionUnits: [],
      };
    }
    return execution;
  }

  async getMicroActivities(projectId) {
    await this.getExecution(projectId);
    return await executionRepository.getMicroActivitiesByProjectId(projectId);
  }

  async getExecutionUnits(projectId) {
    await this.getExecution(projectId);
    return await executionRepository.getExecutionUnitsByProjectId(projectId);
  }
}

export const executionService = new ExecutionService();
