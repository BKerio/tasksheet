import { Student, Supervisor } from '@/types';

// Storage keys for local persistence & Prisma sync
const KEYS = {
  USERS: 'taskapp_prisma_users',
  ATTENDANCE: 'taskapp_prisma_attendance',
  TASK_REPORTS: 'taskapp_prisma_task_reports',
  CURRENT_USER: 'taskapp_prisma_current_user',
};

export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'STUDENT' | 'SUPERVISOR' | 'ADMIN';
  registrationNo?: string;
  course?: string;
  department?: string;
  organization?: string;
  title?: string;
  supervisorName?: string;
  startDate?: string;
  endDate?: string;
}

export const INITIAL_PRISMA_USERS: PrismaUser[] = [
  {
    id: 'user-admin-1',
    name: 'System Administrator',
    email: 'admin@university.ac.ke',
    password: 'admin123',
    role: 'ADMIN',
    department: 'Attachment Coordination Office',
    title: 'System Administrator',
  },
  {
    id: 'user-std-1',
    name: 'Ian Kipkorir Metto',
    email: 'ian.metto@student.university.ac.ke',
    password: 'password123',
    role: 'STUDENT',
    registrationNo: '24-3769',
    course: 'DICT 240 – Software Project Proposal',
    department: 'Department of Information Technology',
    organization: 'FinTech Innovations Lab',
    supervisorName: 'Dr. Sarah Wambui',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'user-std-2',
    name: 'Faith Chebet',
    email: 'faith.chebet@student.university.ac.ke',
    password: 'password123',
    role: 'STUDENT',
    registrationNo: '24-3810',
    course: 'DICT 240 – Software Project Proposal',
    department: 'Department of Computer Science',
    organization: 'Nairobi Data Systems',
    supervisorName: 'Dr. Sarah Wambui',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'user-sup-1',
    name: 'Dr. Sarah Wambui',
    email: 'sarah.wambui@university.ac.ke',
    password: 'adminpassword',
    role: 'SUPERVISOR',
    department: 'Information Technology',
    title: 'Senior Industrial Supervisor',
  },
  {
    id: 'user-sup-2',
    name: 'Prof. David Kamau',
    email: 'david.kamau@university.ac.ke',
    password: 'adminpassword',
    role: 'ADMIN',
    department: 'Computer Science',
    title: 'Head of Attachment Coordination',
  },
];

export const getPrismaUsers = (): PrismaUser[] => {
  const data = localStorage.getItem(KEYS.USERS);
  if (!data) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_PRISMA_USERS));
    return INITIAL_PRISMA_USERS;
  }

  const parsed: PrismaUser[] = JSON.parse(data);
  const hasAdmin = parsed.some((u) => u.email === 'admin@university.ac.ke');
  if (!hasAdmin) {
    const merged = [
      INITIAL_PRISMA_USERS.find((u) => u.email === 'admin@university.ac.ke')!,
      ...parsed.map(({ avatar: _avatar, ...rest }: PrismaUser & { avatar?: string }) => rest),
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(merged));
    return merged;
  }

  return parsed.map(({ avatar: _avatar, ...rest }: PrismaUser & { avatar?: string }) => rest);
};

export const getPrismaStudents = (): Student[] => {
  const users = getPrismaUsers();
  return users
    .filter((u) => u.role === 'STUDENT')
    .map((u) => ({
      id: u.id,
      registrationNo: u.registrationNo || '',
      name: u.name,
      email: u.email,
      course: u.course || 'DICT 240',
      department: u.department || '',
      organization: u.organization || '',
      supervisorName: u.supervisorName || 'Dr. Sarah Wambui',
      startDate: u.startDate || '2026-06-01',
      endDate: u.endDate || '2026-08-31',
    }));
};

export const getPrismaSupervisors = (): Supervisor[] => {
  const users = getPrismaUsers();
  return users
    .filter((u) => u.role === 'SUPERVISOR' || u.role === 'ADMIN')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      department: u.department || 'Information Technology',
      title: u.title || 'Supervisor',
      role: u.role as 'SUPERVISOR' | 'ADMIN',
    }));
};

export { KEYS };
