import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Student, Supervisor, Attendance, TaskReport } from '@/types';
import {
  getStoredStudents,
  getStoredSupervisors,
  getStoredAttendance,
  getStoredTaskReports,
} from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { PrismaUser } from '@/lib/prismaService';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TaskReportReview } from '@/components/admin/TaskReportReview';
import { AttendanceManagement } from '@/components/admin/AttendanceManagement';
import { StudentRoster } from '@/components/admin/StudentRoster';
import { SystemReport } from '@/components/admin/SystemReport';
import { StudentManagement } from '@/components/admin/StudentManagement';
import { SupervisorManagement } from '@/components/admin/SupervisorManagement';
import { SystemDocumentation } from '@/components/admin/SystemDocumentation';

// Used when the signed-in staff member has no record in the local roster yet.
const profileFromAccount = (user: PrismaUser | null): Supervisor | null => {
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR')) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    department: user.department || '',
    title: user.title || (user.role === 'ADMIN' ? 'Administrator' : 'Supervisor'),
    role: user.role,
  };
};

const Admin: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [taskReports, setTaskReports] = useState<TaskReport[]>([]);

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeSupervisor, setActiveSupervisor] = useState<Supervisor | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [ready, setReady] = useState(false);

  const loadData = () => {
    const stds = getStoredStudents();
    const sups = getStoredSupervisors();
    const atts = getStoredAttendance();
    const reps = getStoredTaskReports();

    setStudents(stds);
    setSupervisors(sups);
    setAttendance(atts);
    setTaskReports(reps);

    const linkedSupervisor = sups.find(
      (s) => s.email.toLowerCase() === user?.email.toLowerCase()
    );

    setActiveSupervisor(linkedSupervisor || profileFromAccount(user));
    setActiveStudent(stds[0] || null);
    setReady(true);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading Supervisor Portal...
      </div>
    );
  }

  if (!activeSupervisor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <AdminDashboard
          students={students}
          supervisors={supervisors}
          attendanceList={attendance}
          taskReports={taskReports}
          activeSupervisor={activeSupervisor}
          onNavigateToTab={setActiveTab}
        />
      )}

      {activeTab === 'student-management' && (
        <StudentManagement
          students={students}
          onStudentsUpdated={loadData}
        />
      )}

      {activeTab === 'supervisor-management' && (
        <SupervisorManagement
          supervisors={supervisors}
          currentUserEmail={user?.email}
          onSupervisorsUpdated={loadData}
        />
      )}

      {activeTab === 'task-reviews' && (
        <TaskReportReview
          students={students}
          taskReports={taskReports}
          activeSupervisor={activeSupervisor}
          onReportReviewed={loadData}
        />
      )}

      {activeTab === 'attendance-monitoring' && (
        <AttendanceManagement
          students={students}
          attendanceList={attendance}
          onAttendanceUpdated={loadData}
        />
      )}

      {activeTab === 'student-roster' && (
        <StudentRoster
          students={students}
          attendanceList={attendance}
          taskReports={taskReports}
        />
      )}

      {activeTab === 'system-report' && (
        <SystemReport
          students={students}
          supervisors={supervisors}
          attendanceList={attendance}
          taskReports={taskReports}
        />
      )}

      {activeTab === 'system-docs' && (
        <SystemDocumentation />
      )}
    </AppLayout>
  );
};

export default Admin;
