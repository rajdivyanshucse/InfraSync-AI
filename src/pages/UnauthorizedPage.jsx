import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ShieldAlert, LayoutDashboard, Home, UserCheck } from 'lucide-react';

export const UnauthorizedPage = () => {
  const { currentUser, selectedRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const attemptedPath = location.state?.attemptedPath || 'the requested module';

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      <div className="max-w-lg w-full space-y-6 relative z-10 text-center">
        {/* Shield Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-infra-delayed/10 border border-infra-delayed/30 flex items-center justify-center text-infra-delayed shadow-panel-md">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-rose-400">
            Authorization Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            You do not have permission to access <span className="text-slate-200 font-mono text-2xs px-1.5 py-0.5 rounded bg-surface border border-border">{attemptedPath}</span> with your current stakeholder role.
          </p>
        </div>

        {/* Active Role Metadata Card */}
        {currentUser && (
          <Card className="p-4 bg-surface-subtle/60 border-border text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase text-slate-400">Active Stakeholder</span>
              <StatusBadge status="warning" label="Restricted View" size="sm" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-100 block">{currentUser.name}</span>
                <span className="text-2xs text-slate-400 block">{currentUser.organization}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-brand-400 block">
                  {selectedRole?.displayName || currentUser.roleName}
                </span>
                <span className="text-2xs text-slate-500 block">{currentUser.id}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<LayoutDashboard className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<UserCheck className="w-4 h-4" />}
            onClick={() => navigate('/login')}
          >
            Switch Stakeholder Role
          </Button>

          <Button
            variant="ghost"
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </div>

        <p className="text-2xs text-slate-500 font-mono pt-4">
          InfraSync Execution Intelligence • Security Boundary Layer
        </p>
      </div>
    </div>
  );
};
