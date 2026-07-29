import React, { useState, useEffect } from 'react';
import { Student, Supervisor, Attendance, TaskReport } from '@/types';
import {
  getStoredStudents,
  getStoredSupervisors,
  getStoredAttendance,
  getStoredTaskReports,
} from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TaskReportReview } from '@/components/admin/TaskReportReview';
import { AttendanceManagement } from '@/components/admin/AttendanceManagement';
import { StudentRoster } from '@/components/admin/StudentRoster';
import { StudentManagement } from '@/components/admin/StudentManagement';
import { SystemDocumentation } from '@/components/admin/SystemDocumentation';

const Admin: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [taskReports, setTaskReports] = useState<TaskReport[]>([]);

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeSupervisor, setActiveSupervisor] = useState<Supervisor | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const loadData = () => {
    const stds = getStoredStudents();
    const sups = getStoredSupervisors();
    const atts = getStoredAttendance();
    const reps = getStoredTaskReports();

    setStudents(stds);
    setSupervisors(sups);
    setAttendance(atts);
    setTaskReports(reps);

    const foundCurrentSupervisor = sups.find((s) => s.email === user?.email);
    setActiveSupervisor(foundCurrentSupervisor || sups[0]);
    if (stds.length > 0) setActiveStudent(stds[0]);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!activeStudent || !activeSupervisor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading Supervisor Portal...
      </div>
    );
  }

  return (
    <AppLayout
      students={students}
      supervisors={supervisors}
      activeStudent={activeStudent}
      activeSupervisor={activeSupervisor}
      onSelectStudent={setActiveStudent}
      onSelectSupervisor={setActiveSupervisor}
      onDataReset={loadData}
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

      {activeTab === 'system-docs' && (
        <SystemDocumentation />
      )}
    </AppLayout>
  );
};

export default Admin;
