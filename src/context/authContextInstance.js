import { createContext } from 'react';

export const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  selectedRole: null,
  login: () => {},
  loginAsRole: () => {},
  logout: () => {},
  hasAccess: () => false,
});
