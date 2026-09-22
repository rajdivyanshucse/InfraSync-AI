import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useProject } from '../context/useProject';
import {
  SettingsHeader,
  SettingsNavigation,
  SETTINGS_TABS,
  ProfileSection,
  RoleAccessSection,
  AppearanceSection,
  NotificationSection,
  ProjectContextSection,
  ParametersSection,
  SystemStatusSection,
  AuditLogSection,
  HelpGuideSection,
  DangerZoneSection,
} from '../components/settings';

export const SettingsPage = () => {
  const { currentUser, selectedRole, loginAsRole, logout } = useAuth();
  const { currentProject } = useProject();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive active tab from URL search parameters or default to 'profile'
  const tabParam = searchParams.get('tab');
  const activeTab = useMemo(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.id === tabParam)) {
      return tabParam;
    }
    return 'profile';
  }, [tabParam]);

  const handleSelectTab = (tabId) => {
    setSearchParams((prev) => {
      prev.set('tab', tabId);
      return prev;
    });
  };

  const activeTabObj = useMemo(() => {
    return SETTINGS_TABS.find((t) => t.id === activeTab) || SETTINGS_TABS[0];
  }, [activeTab]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Command Header */}
      <SettingsHeader
        currentUser={currentUser}
        selectedRole={selectedRole}
        currentProject={currentProject}
        activeTabLabel={activeTabObj.label}
      />

      {/* 2. Navigation Ribbon */}
      <SettingsNavigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* 3. Tab Content Viewports */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <ProfileSection
            currentUser={currentUser}
            selectedRole={selectedRole}
            currentProject={currentProject}
          />
        )}

        {activeTab === 'role-access' && (
          <RoleAccessSection
            currentUser={currentUser}
            selectedRole={selectedRole}
            onSwitchRole={loginAsRole}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceSection />
        )}

        {activeTab === 'notifications' && (
          <NotificationSection />
        )}

        {activeTab === 'project-context' && (
          <ProjectContextSection />
        )}

        {activeTab === 'parameters' && (
          <ParametersSection />
        )}

        {activeTab === 'system-status' && (
          <SystemStatusSection />
        )}

        {activeTab === 'audit-log' && (
          <AuditLogSection />
        )}

        {activeTab === 'help-guide' && (
          <HelpGuideSection />
        )}

        {activeTab === 'danger-zone' && (
          <DangerZoneSection
            onLogout={logout}
          />
        )}
      </div>
    </div>
  );
};
