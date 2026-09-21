import { projectService } from '../services/project.service.js';
import { successResponse } from '../utils/apiResponse.js';

export class ProjectController {
  async getProjects(req, res, next) {
    try {
      const projects = await projectService.getAllProjects();
      return successResponse(res, projects);
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { projectId } = req.params;
      const project = await projectService.getProjectById(projectId);
      return successResponse(res, project);
    } catch (err) {
      next(err);
    }
  }
}

export const projectController = new ProjectController();
