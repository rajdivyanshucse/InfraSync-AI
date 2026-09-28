/**
 * InfraSync AI — Authentication & Authorization Middleware (Phase 24)
 * Supports both prototype/demo role-headers and production identity tokens.
 */

import { errorResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export const ALL_ROLES = [
  'project_authority',
  'project_manager',
  'site_engineer',
  'discipline_manager',
  'contractor',
  'administrator',
  'admin',
];

/**
 * Parses and extracts claims from Bearer token
 */
function parseBearerToken(token) {
  if (!token) return null;

  // Handle Demo tokens in non-production environments
  if (token.startsWith('demo-')) {
    const role = token.replace('demo-', '').replace('-', '_').toLowerCase().trim();
    if (ALL_ROLES.includes(role)) {
      return {
        userId: `USR-${role.toUpperCase()}`,
        name: `Demo ${role.replace('_', ' ').toUpperCase()}`,
        role,
        permittedProjects: role === 'contractor' ? ['proj-1'] : ['proj-1', 'proj-2'],
        isDemo: true,
      };
    }
  }

  // Handle standard JWT structure (header.payload.signature)
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      const payload = JSON.parse(payloadJson);
      if (payload && (payload.role || payload.sub)) {
        const role = (payload.role || 'viewer').toLowerCase().trim();
        return {
          userId: payload.sub || payload.userId || 'USR-JWT',
          name: payload.name || 'Enterprise User',
          role,
          permittedProjects: Array.isArray(payload.permittedProjects) ? payload.permittedProjects : ['proj-1', 'proj-2'],
          isDemo: false,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Extracts and establishes user identity and role from request headers
 */
export const authenticate = (req, res, next) => {
  const isProduction = (config.nodeEnv || process.env.NODE_ENV) === 'production';
  const authHeader = req.headers['authorization'];
  const roleHeader = req.headers['x-user-role'];
  const userIdHeader = req.headers['x-user-id'];
  const userNameHeader = req.headers['x-user-name'];
  const permittedProjectsHeader = req.headers['x-permitted-projects'];

  // In PRODUCTION: prototype role headers and demo tokens are strictly rejected to prevent role escalation
  if (isProduction) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (!token.startsWith('demo-')) {
        const parsedUser = parseBearerToken(token);
        if (parsedUser) {
          req.user = parsedUser;
          return next();
        }
      }
    }

    // Unauthenticated in production without valid bearer token
    req.user = null;
    return next();
  }

  // NON-PRODUCTION (development, staging, test): Allow role headers and demo tokens for simulation
  let role = 'project_manager';
  let userId = 'USR-PM-01';
  let name = 'Project Manager';
  let permittedProjects = ['proj-1', 'proj-2'];
  let isDemo = true;

  if (roleHeader) {
    role = roleHeader.toLowerCase().trim();
    userId = userIdHeader || `USR-${role.toUpperCase()}`;
    name = userNameHeader || `${role.replace('_', ' ').toUpperCase()}`;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const parsedUser = parseBearerToken(token);
    if (parsedUser) {
      role = parsedUser.role;
      userId = parsedUser.userId;
      name = parsedUser.name;
      permittedProjects = parsedUser.permittedProjects;
      isDemo = parsedUser.isDemo;
    } else {
      isDemo = false;
      userId = 'USR-PROD';
      name = 'Authenticated User';
    }
  } else if (req.body && req.body.reviewer && typeof req.body.reviewer === 'object') {
    if (req.body.reviewer.role) role = req.body.reviewer.role.toLowerCase().trim();
    if (req.body.reviewer.userId) userId = req.body.reviewer.userId;
    if (req.body.reviewer.name) name = req.body.reviewer.name;
  }

  if (permittedProjectsHeader) {
    permittedProjects = permittedProjectsHeader.split(',').map((p) => p.trim());
  } else if (role === 'contractor') {
    permittedProjects = ['proj-1'];
  }

  req.user = {
    userId,
    name,
    role,
    permittedProjects,
    isDemo,
  };

  next();
};

/**
 * Role-Based Access Control (RBAC) Guard
 * @param  {...string} allowedRoles
 */
export const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Authentication required before role authorization.', 'UNAUTHENTICATED', 401);
    }

    const userRole = req.user.role.toLowerCase().trim();

    // Portfolio Authority and Admin have superuser authority
    if (['project_authority', 'admin', 'administrator'].includes(userRole)) {
      return next();
    }

    if (!normalizedAllowed.includes(userRole)) {
      return errorResponse(
        res,
        `Role '${req.user.role}' is not authorized to perform this operation. Allowed roles: ${allowedRoles.join(', ')}`,
        'FORBIDDEN_ROLE',
        403
      );
    }

    next();
  };
};

/**
 * Project-Scope Access Guard
 * Ensures user is assigned to the requested project scope
 */
export const authorizeProjectScope = (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId || req.query.projectId;

  if (!projectId) {
    return next(); // Non-project-scoped route
  }

  if (!req.user) {
    return errorResponse(res, 'Authentication required before scope authorization.', 'UNAUTHENTICATED', 401);
  }

  const userRole = (req.user.role || '').toLowerCase().trim();

  // Portfolio roles have global access
  if (['project_authority', 'admin', 'administrator'].includes(userRole)) {
    return next();
  }

  const permitted = req.user.permittedProjects || [];
  if (!permitted.includes(projectId)) {
    return errorResponse(
      res,
      `Access denied: User does not have authorization for project '${projectId}'.`,
      'PROJECT_ACCESS_DENIED',
      403
    );
  }

  next();
};
