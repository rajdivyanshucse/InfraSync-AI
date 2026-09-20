import React, { useState } from 'react';
import { ProjectContext } from './projectContextInstance';
import { mockProjects } from '../data/mockData';

export const ProjectProvider = ({ children }) => {
  const [projects] = useState(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const selectProject = (id) => {
    setSelectedProjectId(id);
  };

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
