import { siteViewRepository } from '../repositories/siteView.repository.js';
import { projectRepository } from '../repositories/project.repository.js';

export class SiteViewService {
  async getSiteView(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      const error = new Error(`Project not found: ${projectId}`);
      error.statusCode = 404;
      error.code = 'PROJECT_NOT_FOUND';
      throw error;
    }

    const siteView = await siteViewRepository.getSiteViewByProjectId(projectId);
    if (!siteView) {
      return {
        projectId,
        coordinateSystem: 'Prototype Spatial Coordinates',
        zones: [],
        capturePoints: [],
      };
    }
    return siteView;
  }

  async getZones(projectId) {
    await this.getSiteView(projectId);
    return await siteViewRepository.getZonesByProjectId(projectId);
  }

  async getCapturePoints(projectId) {
    await this.getSiteView(projectId);
    return await siteViewRepository.getCapturePointsByProjectId(projectId);
  }
}

export const siteViewService = new SiteViewService();
