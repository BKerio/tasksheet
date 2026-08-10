import { Student, Supervisor, Attendance, TaskReport } from '@/types';

const STORAGE_KEYS = {
  STUDENTS: 'taskapp_students',
  SUPERVISORS: 'taskapp_supervisors',
  ATTENDANCE: 'taskapp_attendance',
  TASK_REPORTS: 'taskapp_task_reports',
  CURRENT_USER_ROLE: 'taskapp_current_user_role',
  CURRENT_STUDENT_ID: 'taskapp_current_student_id',
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    registrationNo: '24-3769',
    name: 'Ian Kipkorir Metto',
    email: 'ian.metto@student.university.ac.ke',
    course: 'DICT 240 – Software Project Proposal',
    department: 'Department of Information Technology',
    organization: 'FinTech Innovations Lab',
    supervisorName: 'Dr. Sarah Wambui',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'std-2',
    registrationNo: '24-3810',
    name: 'Faith Chebet',
    email: 'faith.chebet@student.university.ac.ke',
    course: 'DICT 240 – Software Project Proposal',
    department: 'Department of Computer Science',
    organization: 'Nairobi Data Systems',
    supervisorName: 'Dr. Sarah Wambui',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'std-3',
    registrationNo: '24-3945',
    name: 'Kevin Ochieng',
    email: 'kevin.ochieng@student.university.ac.ke',
    course: 'DICT 240 – Software Project Proposal',
    department: 'Department of Information Technology',
    organization: 'CloudNet Solutions',
    supervisorName: 'Prof. David Kamau',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup-admin',
    name: 'System Administrator',
    email: 'admin@university.ac.ke',
    department: 'Attachment Coordination Office',
    title: 'System Administrator',
    role: 'ADMIN',
  },
  {
    id: 'sup-1',
    name: 'Dr. Sarah Wambui',
    email: 'sarah.wambui@university.ac.ke',
    department: 'Information Technology',
    title: 'Senior Industrial Supervisor',
    role: 'SUPERVISOR',
  },
  {
    id: 'sup-2',
    name: 'Prof. David Kamau',
    email: 'david.kamau@university.ac.ke',
    department: 'Computer Science',
    title: 'Head of Attachment Coordination',
    role: 'ADMIN',
  },
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'att-1',
    studentId: 'std-1',
    date: '2026-07-27',
    status: 'Present',
    checkInTime: '08:15 AM',
    checkOutTime: '05:00 PM',
    workMode: 'On-site',
    location: 'Head Office - Room 3B',
    notes: 'Signed physical register and completed morning Standup.',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-2',
    studentId: 'std-1',
    date: '2026-07-26',
    status: 'Present',
    checkInTime: '08:30 AM',
    checkOutTime: '05:15 PM',
    workMode: 'On-site',
    location: 'Head Office - Room 3B',
    notes: 'On time for system maintenance sprint.',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-3',
    studentId: 'std-1',
    date: '2026-07-25',
    status: 'Present',
    checkInTime: '08:00 AM',
    checkOutTime: '04:45 PM',
    workMode: 'Remote',
    location: 'Home Office / Virtual VPN',
    notes: 'Worked remotely on database indexing tasks.',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-4',
    studentId: 'std-1',
    date: '2026-07-24',
    status: 'Late',
    checkInTime: '09:15 AM',
    checkOutTime: '05:30 PM',
    workMode: 'On-site',
    notes: 'Delayed due to traffic congestion on Mombasa Road.',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-5',
    studentId: 'std-1',
    date: '2026-07-23',
    status: 'Present',
    checkInTime: '08:10 AM',
    checkOutTime: '05:00 PM',
    workMode: 'On-site',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-6',
    studentId: 'std-2',
    date: '2026-07-27',
    status: 'Present',
    checkInTime: '08:20 AM',
    checkOutTime: '05:05 PM',
    workMode: 'On-site',
    verifiedBySupervisor: true,
  },
  {
    id: 'att-7',
    studentId: 'std-3',
    date: '2026-07-27',
    status: 'On Leave',
    workMode: 'Remote',
    notes: 'Approved medical leave day.',
    verifiedBySupervisor: true,
  },
];

export const INITIAL_TASK_REPORTS: TaskReport[] = [
  {
    id: 'rep-1',
    studentId: 'std-1',
    date: '2026-07-27',
    title: 'Designed Database Schema for Attachment System & ERD Verification',
    description: 'Constructed PostgreSQL schema tables for Student, Supervisor, Attendance, and Task_Report models as specified in DICT 240 proposal document. Created relations and primary/foreign keys.',
    category: 'Software Development',
    hoursSpent: 7.5,
    learnings: 'Gained hands-on experience with relational database normalisation, ERD translation to SQL scripts, and foreign key constraint validation.',
    challenges: 'Ensuring cascading deletes don\'t compromise student attendance archive records.',
    status: 'Pending',
  },
  {
    id: 'rep-2',
    studentId: 'std-1',
    date: '2026-07-26',
    title: 'REST API Authentication & User Role Middleware Implementation',
    description: 'Integrated JWT token-based auth middleware to separate Student user routes from Supervisor Admin endpoints. Built role verification guards.',
    category: 'Software Development',
    hoursSpent: 8.0,
    learnings: 'Understood bearer token validation and security practices for Web applications.',
    challenges: 'Handling token expiration gracefully in frontend React state.',
    status: 'Approved',
    feedback: 'Excellent work, Ian! The endpoint separation is clean and matches industry best practices.',
    rating: 95,
    reviewedAt: '2026-07-26 17:30',
    supervisorName: 'Dr. Sarah Wambui',
  },
  {
    id: 'rep-3',
    studentId: 'std-1',
    date: '2026-07-25',
    title: 'Data Flow Diagram (DFD Level 0 & Level 1) Technical Documentation',
    description: 'Mapped system processes from physical logbooks to web-based automated attendance and task submission flows for supervisor review.',
    category: 'Documentation & Testing',
    hoursSpent: 6.0,
    learnings: 'Learned standardized IEEE software documentation guidelines and DFD symbol representations.',
    status: 'Approved',
    feedback: 'Clear DFD structures. Ready for incorporation into the final project report.',
    rating: 90,
    reviewedAt: '2026-07-25 16:45',
    supervisorName: 'Dr. Sarah Wambui',
  },
  {
    id: 'rep-4',
    studentId: 'std-1',
    date: '2026-07-24',
    title: 'Front-End UI Prototyping for Daily Logbook Submissions',
    description: 'Designed responsive form components for students to record daily tasks, select activity categories, log hours, and state challenges encountered.',
    category: 'Software Development',
    hoursSpent: 7.0,
    learnings: 'Mastered Tailwind CSS layout utilities and Shadcn UI component composition.',
    challenges: 'Designing dynamic responsive layouts across mobile and desktop devices.',
    status: 'Needs Revision',
    feedback: 'Form looks clean, but please add validation for negative work hours and mandatory challenge fields when hours exceed 8.',
    rating: 75,
    reviewedAt: '2026-07-24 18:00',
    supervisorName: 'Dr. Sarah Wambui',
  },
  {
    id: 'rep-5',
    studentId: 'std-2',
    date: '2026-07-27',
    title: 'Server Infrastructure Monitoring and Log Analytics',
    description: 'Configured automated monitoring scripts to aggregate server logs and detect network bottlenecks.',
    category: 'IT Support & Networking',
    hoursSpent: 7.0,
    learnings: 'Mastered syslog parsing and Grafana dashboard visualization.',
    status: 'Pending',
  },
];

// Helper functions for LocalStorage management
export const getStoredStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  return JSON.parse(data);
};

export const getStoredSupervisors = (): Supervisor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SUPERVISORS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(INITIAL_SUPERVISORS));
    return INITIAL_SUPERVISORS;
  }

  // Older builds cached a list without the coordination-office admin, so add
  // any seeded staff account that is missing instead of stranding the login.
  const stored: Supervisor[] = JSON.parse(data);
  const missing = INITIAL_SUPERVISORS.filter(
    (seed) => !stored.some((s) => s.email.toLowerCase() === seed.email.toLowerCase())
  );

  if (missing.length === 0) return stored;

  const merged = [...missing, ...stored];
  localStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(merged));
  return merged;
};

export const getStoredAttendance = (): Attendance[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    return INITIAL_ATTENDANCE;
  }
  return JSON.parse(data);
};

export const saveAttendance = (attendanceList: Attendance[]) => {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceList));
};

export const getStoredTaskReports = (): TaskReport[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASK_REPORTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TASK_REPORTS, JSON.stringify(INITIAL_TASK_REPORTS));
    return INITIAL_TASK_REPORTS;
  }
  return JSON.parse(data);
};

export const saveTaskReports = (reports: TaskReport[]) => {
  localStorage.setItem(STORAGE_KEYS.TASK_REPORTS, JSON.stringify(reports));
};

export const addAttendanceRecord = (record: Omit<Attendance, 'id' | 'verifiedBySupervisor'>): Attendance => {
  const current = getStoredAttendance();
  const newRecord: Attendance = {
    ...record,
    id: `att-${Date.now()}`,
    verifiedBySupervisor: false,
  };
  const updated = [newRecord, ...current];
  saveAttendance(updated);
  return newRecord;
};

export const addTaskReport = (report: Omit<TaskReport, 'id' | 'status'>): TaskReport => {
  const current = getStoredTaskReports();
  const newReport: TaskReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: 'Pending',
  };
  const updated = [newReport, ...current];
  saveTaskReports(updated);
  return newReport;
};

export const reviewTaskReport = (
  reportId: string,
  status: TaskReport['status'],
  feedback: string,
  rating: number,
  supervisorName: string
): TaskReport | null => {
  const current = getStoredTaskReports();
  let updatedReport: TaskReport | null = null;
  const updated = current.map((r) => {
    if (r.id === reportId) {
      updatedReport = {
        ...r,
        status,
        feedback,
        rating,
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        supervisorName,
      };
      return updatedReport;
    }
    return r;
  });
  saveTaskReports(updated);
  return updatedReport;
};

export const deleteTaskReport = (reportId: string): void => {
  const current = getStoredTaskReports();
  const updated = current.filter((r) => r.id !== reportId);
  saveTaskReports(updated);
};

export const resetToInitialData = () => {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.SUPERVISORS, JSON.stringify(INITIAL_SUPERVISORS));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  localStorage.setItem(STORAGE_KEYS.TASK_REPORTS, JSON.stringify(INITIAL_TASK_REPORTS));
};
