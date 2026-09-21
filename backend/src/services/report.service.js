import { reportRepository } from '../repositories/report.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class ReportService {
  async getSummary(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    return await reportRepository.getProjectReportSummary(projectId);
  }
}

export const reportService = new ReportService();
