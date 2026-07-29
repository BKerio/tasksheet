export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day' | 'Late' | 'On Leave';
export type WorkMode = 'On-site' | 'Remote';
export type TaskCategory = 'Software Development' | 'System Maintenance' | 'Database Management' | 'Documentation & Testing' | 'IT Support & Networking' | 'Other';
export type ReportStatus = 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected';

export interface Student {
  id: string;
  registrationNo: string;
  name: string;
  email: string;
  course: string;
  department: string;
  organization: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  role: 'SUPERVISOR' | 'ADMIN';
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  workMode: WorkMode;
  location?: string;
  notes?: string;
  verifiedBySupervisor: boolean;
}

export interface TaskReport {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  category: TaskCategory;
  hoursSpent: number;
  learnings: string;
  challenges?: string;
  status: ReportStatus;
  feedback?: string;
  rating?: number; // 1-100 or 1-5
  reviewedAt?: string;
  supervisorName?: string;
}

export interface SystemStats {
  totalStudents: number;
  todayAttendanceRate: number;
  pendingTaskReports: number;
  averageRating: number;
  totalHoursLogged: number;
}
