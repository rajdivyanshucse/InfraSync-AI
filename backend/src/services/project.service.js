import { projectRepository } from '../repositories/project.repository.js';

export class ProjectService {
  async getAllProjects() {
    return await projectRepository.findAll();
  }

  async getProjectById(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }
    return project;
  }
}

export const projectService = new ProjectService();
