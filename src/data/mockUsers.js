/**
 * Isolated Mock Users for InfraSync AI Prototype
 * Each user is mapped to one of the 6 core infrastructure stakeholder roles.
 */
export const mockUsers = [
  {
    id: 'usr-auth-01',
    name: 'Divyanshu Sharma',
    email: 'divyanshu.authority@infrasync.ai',
    role: 'project_authority',
    roleName: 'Project Authority',
    organization: 'National Highways & Infrastructure Authority',
    title: 'Director of Infrastructure Delivery',
    avatar: '',
    initials: 'DS',
    phone: '+91 98765 43210',
    location: 'Central Headquarters, New Delhi',
  },
  {
    id: 'usr-pm-02',
    name: 'Rajesh Verma',
    email: 'rajesh.pm@infrasync.ai',
    role: 'project_manager',
    roleName: 'Project Manager',
    organization: 'Corridor Infra Project Works',
    title: 'Senior Project Manager — Package A',
    avatar: '',
    initials: 'RV',
    phone: '+91 98111 22334',
    location: 'Regional Site Office, Chandigarh',
  },
  {
    id: 'usr-site-03',
    name: 'Ananya Sen',
    email: 'ananya.site@infrasync.ai',
    role: 'site_engineer',
    roleName: 'Site Engineer',
    organization: 'InfraSync Field Operations',
    title: 'Lead Civil QA/QC Engineer',
    avatar: '',
    initials: 'AS',
    phone: '+91 97222 33445',
    location: 'Chainage 14+200 Field Office',
  },
  {
    id: 'usr-contractor-04',
    name: 'Vikram Singh',
    email: 'vikram.contractor@infrasync.ai',
    role: 'contractor',
    roleName: 'Contractor',
    organization: 'Larsen & Build JV Contractors',
    title: 'Subcontractor Lead — Structural Package',
    avatar: '',
    initials: 'VS',
    phone: '+91 96333 44556',
    location: 'Pier Yard 04, Site B',
  },
  {
    id: 'usr-discipline-05',
    name: 'Dr. Priya Nair',
    email: 'priya.discipline@infrasync.ai',
    role: 'discipline_manager',
    roleName: 'Discipline Manager',
    organization: 'Apex Engineering Consultants',
    title: 'Lead MEP & Tunneling Specialist',
    avatar: '',
    initials: 'PN',
    phone: '+91 95444 55667',
    location: 'Design & Engineering Office, Bengaluru',
  },
  {
    id: 'usr-admin-06',
    name: 'Amitabh Sen',
    email: 'admin@infrasync.ai',
    role: 'administrator',
    roleName: 'Administrator',
    organization: 'InfraSync AI Platform Systems',
    title: 'Enterprise System Administrator',
    avatar: '',
    initials: 'AS',
    phone: '+91 94555 66778',
    location: 'Operations Command Center',
  },
];

export const getDefaultUserForRole = (roleId) => {
  return mockUsers.find((u) => u.role === roleId) || mockUsers[0];
};

export const getUserByEmail = (email) => {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
};
