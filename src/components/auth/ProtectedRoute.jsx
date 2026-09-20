import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Skeleton } from '../ui/Skeleton';
import { HardHat } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles = null, children }) => {
  const { isAuthenticated, isLoading, currentUser, hasAccess } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-950 border border-brand-500/40 text-brand-400 animate-pulse">
          <HardHat className="h-6 w-6 text-brand-400" />
        </div>
        <div className="space-y-2 text-center max-w-xs w-full">
          <div className="text-xs font-mono text-slate-400">Verifying session credentials...</div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific allowed roles if explicitly passed, otherwise check route permission
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  // Check general route permission from centralized config
  if (!hasAccess(location.pathname)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
};
