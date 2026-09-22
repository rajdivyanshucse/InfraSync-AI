import React, { useState, useCallback } from 'react';
import { ProjectContext } from './projectContextInstance';
import { mockProjects } from '../data/mockData';

const PROJECT_STORAGE_KEY = 'infrasync_selected_project_id';

export const ProjectProvider = ({ children }) => {
  const [projects] = useState(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (stored && mockProjects.some((p) => p.id === stored)) {
          return stored;
        }
      }
    } catch {
      // Safe fallback on storage read error
    }
    return mockProjects[0].id;
  });

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const selectProject = useCallback((id) => {
    if (!id) return;
    const exists = mockProjects.some((p) => p.id === id);
    if (exists) {
      setSelectedProjectId(id);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(PROJECT_STORAGE_KEY, id);
        }
      } catch (e) {
        console.warn('[ProjectContext] Failed to persist project selection:', e);
      }
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        selectProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
