import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Phone, 
  Shield, 
  CheckCircle2, 
  Save, 
  Lock 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ProfileSection = ({
  currentUser,
  selectedRole,
  currentProject,
}) => {
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Authorized Engineer',
    email: currentUser?.email || 'engineer@infrasync.ai',
    organization: currentUser?.organization || 'National Highways Authority of India (NHAI)',
    title: currentUser?.title || 'Senior Infrastructure Control Specialist',
    location: currentUser?.location || 'Central Corridor Command Center',
    phone: currentUser?.phone || '+91 98765 43210',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Profile Overview Header */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border-2 border-blue-500/40 font-mono text-xl font-bold text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
              {currentUser?.initials || 'IS'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profileData.name}
                </h3>
                <span className="rounded-md border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-3xs font-mono font-bold text-blue-700 dark:text-blue-300">
                  {selectedRole?.displayName || currentUser?.roleName || 'Project Engineer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profileData.title} • {profileData.organization}
              </p>
            </div>
          </div>

          <div className="text-right text-3xs font-mono text-slate-500 dark:text-slate-400 space-y-0.5 border-t sm:border-t-0 border-surface-border pt-2 sm:pt-0">
            <div>User ID: <span className="text-slate-900 dark:text-white font-bold">{currentUser?.id || 'USR-LOCAL-01'}</span></div>
            <div>Account Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Verified</span></div>
            <div>Active Project: <span className="text-sky-600 dark:text-sky-400">{currentProject?.name || 'All Packages'}</span></div>
          </div>
        </div>
      </div>

      {/* 2. Profile Details Form */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <span>Identity & Professional Credentials</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review your employer authority details, project jurisdiction, and official contact specifications.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Official Email Address"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Employer Authority / Consortium"
              value={profileData.organization}
              onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
              leftIcon={<Building2 className="h-4 w-4" />}
            />

            <Input
              label="Designation / Official Title"
              value={profileData.title}
              onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
              leftIcon={<Shield className="h-4 w-4" />}
            />

            <Input
              label="Assigned Office / Station Location"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            <Input
              label="Contact / Direct Line"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>

          {savedSuccess && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Profile preferences successfully updated in active session state.</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Preferences</span>
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Session & Security Information */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span>Session & Authentication Context</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic identity and session boundary parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Authentication Mode</span>
            <strong className="text-slate-900 dark:text-white block">Enterprise Role Context (SSO/JWT)</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Session Scope</span>
            <strong className="text-emerald-600 dark:text-emerald-400 block">Encrypted Browser Storage</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Access Control Boundary</span>
            <strong className="text-sky-600 dark:text-sky-400 block">Role-Based Access (RBAC)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
