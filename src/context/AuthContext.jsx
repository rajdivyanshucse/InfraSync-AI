import React, { useState, useCallback, useMemo } from 'react';
import { AuthContext } from './authContextInstance';
import { mockUsers, getDefaultUserForRole, getUserByEmail } from '../data/mockUsers';
import { getRole, canAccessRoute } from '../config/roles';

const STORAGE_KEY = 'infrasync_prototype_auth';

export const AuthProvider = ({ children }) => {
  // Initialize mock auth state from non-sensitive localStorage for prototype persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.userId) {
          const user = mockUsers.find((u) => u.id === parsed.userId) || getDefaultUserForRole(parsed.role);
          if (user) return user;
        }
      }
    } catch (e) {
      console.warn('Failed to initialize mock auth state from storage:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Prototype login via email/password or role selection
   */
  const login = useCallback(async ({ email, password: _password, roleId }) => {
    setIsLoading(true);
    // Simulate short network delay for realistic UX feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    let userToSet = null;

    if (roleId) {
      userToSet = getDefaultUserForRole(roleId);
    } else if (email) {
      userToSet = getUserByEmail(email) || {
        id: 'usr-custom',
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: 'project_authority',
        roleName: 'Project Authority',
        organization: 'Infrastructure Consortium',
        title: 'Stakeholder Representative',
        initials: email.substring(0, 2).toUpperCase(),
        location: 'Field Office',
      };
    } else {
      userToSet = mockUsers[0];
    }

    setCurrentUser(userToSet);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userId: userToSet.id,
          role: userToSet.role,
          authenticatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Failed to persist mock auth state:', e);
    }

    setIsLoading(false);
    return userToSet;
  }, []);

  /**
   * Safe one-click prototype login as a specific role
   */
  const loginAsRole = useCallback(async (roleId) => {
    return login({ roleId });
  }, [login]);

  /**
   * Logout and clear prototype session
   */
  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear mock auth state:', e);
    }
  }, []);

  /**
   * Helper to check if current user can access a route path
   */
  const hasAccess = useCallback((routePath) => {
    if (!currentUser) return false;
    return canAccessRoute(currentUser.role, routePath);
  }, [currentUser]);

  const selectedRole = useMemo(() => {
    if (!currentUser) return null;
    return getRole(currentUser.role);
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      selectedRole,
      login,
      loginAsRole,
      logout,
      hasAccess,
    }),
    [currentUser, isLoading, selectedRole, login, loginAsRole, logout, hasAccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
