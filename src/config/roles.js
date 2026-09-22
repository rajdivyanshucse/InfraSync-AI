import {
  Shield,
  Briefcase,
  HardHat,
  Truck,
  Layers,
  ShieldCheck,
} from 'lucide-react';

/**
 * Centralized Role Configuration for InfraSync AI
 * Supports 6 core infrastructure stakeholder roles.
 */
export const ROLES = {
  PROJECT_AUTHORITY: {
    id: 'project_authority',
    displayName: 'Project Authority',
    description: 'Executive oversight, regulatory compliance & overall project governance.',
    icon: ShieldCheck,
    badgeVariant: 'neutral',
    allowedRoutes: [
      '/dashboard',
      '/projects',
      '/schedule',
      '/progress',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/risk-intelligence',
      '/alerts',
      '/contractors',
      '/disciplines',
      '/reports',
      '/help',
      '/design-system',
    ],
  },
  PROJECT_MANAGER: {
    id: 'project_manager',
    displayName: 'Project Manager',
    description: 'Schedule management, risk resolution & executive reporting.',
    icon: Briefcase,
    badgeVariant: 'onTrack',
    allowedRoutes: [
      '/dashboard',
      '/projects',
      '/schedule',
      '/progress',
      '/contractors',
      '/disciplines',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/risk-intelligence',
      '/alerts',
      '/reports',
      '/help',
      '/design-system',
    ],
  },
  SITE_ENGINEER: {
    id: 'site_engineer',
    displayName: 'Site Engineer',
    description: 'Field inspection, ground evidence collection & progress verification.',
    icon: HardHat,
    badgeVariant: 'warning',
    allowedRoutes: [
      '/dashboard',
      '/schedule',
      '/progress',
      '/contractors',
      '/disciplines',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/risk-intelligence',
      '/alerts',
      '/reports',
      '/help',
      '/design-system',
    ],
  },
  CONTRACTOR: {
    id: 'contractor',
    displayName: 'Contractor',
    description: 'Work package execution, contractor logs & assigned milestone submission.',
    icon: Truck,
    badgeVariant: 'delayed',
    allowedRoutes: [
      '/dashboard',
      '/progress',
      '/contractors',
      '/disciplines',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/schedule',
      '/risk-intelligence',
      '/alerts',
      '/reports',
      '/help',
      '/design-system',
    ],
  },
  DISCIPLINE_MANAGER: {
    id: 'discipline_manager',
    displayName: 'Discipline Manager',
    description: 'Specialized package coordination (Civil, MEP, Structural) & QA reports.',
    icon: Layers,
    badgeVariant: 'neutral',
    allowedRoutes: [
      '/dashboard',
      '/progress',
      '/contractors',
      '/disciplines',
      '/schedule',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/risk-intelligence',
      '/alerts',
      '/reports',
      '/help',
      '/design-system',
    ],
  },
  ADMINISTRATOR: {
    id: 'administrator',
    displayName: 'Administrator',
    description: 'System configuration, user management & organization parameters.',
    icon: Shield,
    badgeVariant: 'neutral',
    allowedRoutes: [
      '/dashboard',
      '/projects',
      '/schedule',
      '/progress',
      '/contractors',
      '/disciplines',
      '/site-evidence',
      '/site-view',
      '/verification',
      '/risk-intelligence',
      '/alerts',
      '/reports',
      '/settings',
      '/help',
      '/design-system',
    ],
  },
};

export const ROLES_LIST = Object.values(ROLES);

/**
 * Returns role metadata by ID
 */
export const getRole = (roleId) => {
  return ROLES_LIST.find((r) => r.id === roleId) || ROLES.PROJECT_AUTHORITY;
};

/**
 * Check if a role can access a given route
 */
export const canAccessRoute = (roleId, routePath) => {
  if (!roleId) return false;
  const role = getRole(roleId);
  if (!role || !role.allowedRoutes) return false;

  // Base normalization
  const normalizedPath = routePath.split('?')[0].split('#')[0];
  if (role.allowedRoutes.includes(normalizedPath)) return true;

  // Support parameterized routes like /projects/proj-1
  if (normalizedPath.startsWith('/projects/')) {
    return role.allowedRoutes.includes('/projects');
  }

  return false;
};
