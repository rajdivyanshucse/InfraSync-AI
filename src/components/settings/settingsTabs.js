import {
  User,
  Shield,
  Palette,
  Bell,
  Building2,
  Sliders,
  Cpu,
  History,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile & Account', icon: User, code: 'SEC-ACC' },
  { id: 'role-access', label: 'Role & Governance', icon: Shield, code: 'SEC-GOV' },
  { id: 'appearance', label: 'Appearance & Theme', icon: Palette, code: 'SEC-UI' },
  { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, code: 'SEC-NOTIF' },
  { id: 'project-context', label: 'Project Workspace', icon: Building2, code: 'SEC-PRJ' },
  { id: 'parameters', label: 'Operational Thresholds', icon: Sliders, code: 'SEC-PARM' },
  { id: 'system-status', label: 'System Health & Engines', icon: Cpu, code: 'SEC-ENG' },
  { id: 'audit-log', label: 'Audit & Activity Log', icon: History, code: 'SEC-AUDIT' },
  { id: 'help-guide', label: 'Help & Architecture', icon: HelpCircle, code: 'SEC-DOCS' },
  { id: 'danger-zone', label: 'Danger Zone', icon: AlertTriangle, code: 'SEC-DANG', danger: true },
];
