import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/shell/AppShell';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SchedulePage } from './pages/SchedulePage';
import { ProgressPage } from './pages/ProgressPage';
import { SiteEvidencePage } from './pages/SiteEvidencePage';
import { SiteViewPage } from './pages/SiteViewPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { AlertsPage } from './pages/AlertsPage';
import { ContractorsPage } from './pages/ContractorsPage';
import { DisciplinesPage } from './pages/DisciplinesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />

            {/* Protected Application Workspace */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/site-evidence" element={<SiteEvidencePage />} />
                <Route path="/site-view" element={<SiteViewPage />} />
                <Route path="/risk-intelligence" element={<RiskIntelligencePage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/contractors" element={<ContractorsPage />} />
                <Route path="/disciplines" element={<DisciplinesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
              </Route>
            </Route>

            {/* Fallback to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
