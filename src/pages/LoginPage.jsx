import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROLES_LIST } from '../config/roles';
import { mockUsers } from '../data/mockUsers';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  HardHat,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';

export const LoginPage = () => {
  const { login, loginAsRole, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemoRole, setSelectedDemoRole] = useState('project_authority');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const targetPath = location.state?.from?.pathname || '/dashboard';

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login({ email: email || 'divyanshu.authority@infrasync.ai', password, roleId: selectedDemoRole });
      navigate(targetPath, { replace: true });
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRoleSelect = async (roleId) => {
    setSelectedDemoRole(roleId);
    setIsSubmitting(true);
    try {
      await loginAsRole(roleId);
      navigate(targetPath, { replace: true });
    } catch {
      setErrorMsg('Failed to initialize demo role session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-border/60 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 border border-brand-500/40 text-brand-400 group-hover:border-brand-500 transition-colors">
            <HardHat className="h-4 w-4 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">InfraSync</span>
              <span className="text-brand-400 font-mono text-2xs px-1 py-0.2 rounded bg-brand-950 border border-brand-500/30">
                AI
              </span>
            </div>
            <p className="text-2xs text-slate-400 font-medium">Execution Intelligence</p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium flex items-center gap-1"
        >
          <span>Return to Landing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (5 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
                Workstation Gateway
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Sign in to InfraSync AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enter your stakeholder credentials or select an authorized prototype role to access the project workspace.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-infra-delayed/15 border border-infra-delayed/40 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* Standard Login Card */}
            <Card className="p-6 bg-surface/90 border-border shadow-panel-md space-y-4">
              <form onSubmit={handleStandardSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Enterprise Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="name@infrasync.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-base border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Workstation Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotNotice(true)}
                      className="text-2xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-base border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border bg-surface-base text-brand-500 focus:ring-brand-500/20"
                    />
                    <span className="text-2xs text-slate-400">Remember this workstation</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign in to Project Workspace
                </Button>
              </form>

              {/* Forgot password placeholder modal/callout */}
              {showForgotNotice && (
                <div className="p-3 rounded-lg bg-surface-subtle border border-border/80 text-2xs text-slate-300 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-slate-100">
                    <Info className="w-3.5 h-3.5 text-brand-400" />
                    <span>Enterprise Identity Governance</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    InfraSync AI integrates with enterprise Active Directory / SAML SSO. In production, password recovery is governed by your organization administrator. For prototype testing, use the quick demo roles on the right.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(false)}
                    className="text-brand-400 font-medium hover:underline block pt-1"
                  >
                    Dismiss Notice
                  </button>
                </div>
              )}
            </Card>

            {/* Currently Logged In Banner if returning */}
            {isAuthenticated && currentUser && (
              <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-900 border border-brand-500/50 flex items-center justify-center font-mono font-bold text-2xs text-brand-200">
                    {currentUser.initials}
                  </div>
                  <div>
                    <span className="text-slate-200 font-semibold block">{currentUser.name}</span>
                    <span className="text-2xs text-brand-400 font-mono">{currentUser.roleName} active</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Resume
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Demo Role Selection (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Prototype Role Selector
                </h2>
              </div>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-surface-subtle text-slate-400 border border-border">
                Instant Access
              </span>
            </div>

            <p className="text-2xs text-slate-400 leading-relaxed">
              Click any infrastructure stakeholder persona below to instantly simulate that role's navigation, permissions, and execution workspace:
            </p>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES_LIST.map((role) => {
                const Icon = role.icon;
                const matchedUser = mockUsers.find((u) => u.role === role.id);
                const isSelected = selectedDemoRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleQuickRoleSelect(role.id)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left transition-all duration-150 space-y-2 relative group focus-visible:outline-none',
                      isSelected
                        ? 'bg-surface-elevated border-brand-500 ring-1 ring-brand-500/40 shadow-glow-brand'
                        : 'bg-surface/80 border-border/80 hover:border-slate-700 hover:bg-surface-subtle'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center border transition-colors',
                            isSelected
                              ? 'bg-brand-600 border-brand-400 text-white'
                              : 'bg-surface-muted border-border text-slate-400 group-hover:text-slate-200'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-100 block group-hover:text-white">
                            {role.displayName}
                          </span>
                          <span className="text-2xs text-slate-400 font-mono block">
                            {matchedUser?.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={role.badgeVariant} size="sm" />
                    </div>

                    <p className="text-2xs text-slate-400 leading-tight line-clamp-2">
                      {role.description}
                    </p>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-2xs text-slate-500 font-mono">
                      <span>{role.allowedRoutes.length} Modules</span>
                      <span className="text-brand-400 group-hover:underline flex items-center gap-0.5 font-sans font-medium">
                        Enter →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-lg bg-surface-subtle/60 border border-border/60 flex items-start gap-2 text-2xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-300">Prototype Environment Notice:</strong> Frontend role selection enables rapid stakeholder validation. Backend authentication and cryptographic JWT validation will be connected in subsequent phases.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border/60 text-center text-2xs text-slate-500 font-mono relative z-10">
        InfraSync AI • Planning-to-Execution Intelligence • Enterprise Workstation Authentication
      </footer>
    </div>
  );
};
