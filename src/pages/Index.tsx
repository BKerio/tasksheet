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
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { AttendanceTracker } from '@/components/student/AttendanceTracker';
import { TaskReportSubmitter } from '@/components/student/TaskReportSubmitter';
import { StudentProfile } from '@/components/student/StudentProfile';

// Used when the signed-in student has no record in the local roster yet.
const profileFromAccount = (user: PrismaUser | null): Student | null => {
  if (!user || user.role !== 'STUDENT') return null;

  return {
    id: user.id,
    registrationNo: user.registrationNo || '',
    name: user.name,
    email: user.email,
    course: user.course || 'DICT 240',
    department: user.department || '',
    organization: user.organization || '',
    supervisorName: user.supervisorName || '',
    startDate: user.startDate || '',
    endDate: user.endDate || '',
  };
};

const Index: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [taskReports, setTaskReports] = useState<TaskReport[]>([]);
  
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeSupervisor, setActiveSupervisor] = useState<Supervisor | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
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

    const linkedStudent = stds.find(
      (s) =>
        s.email.toLowerCase() === user?.email.toLowerCase() ||
        (!!user?.registrationNo && s.registrationNo === user.registrationNo)
    );

    setActiveStudent(linkedStudent || profileFromAccount(user));
    setActiveSupervisor(sups[0] || null);
    setReady(true);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading Student Attachment System...
      </div>
    );
  }

  // Staff accounts have no student record; send them to their own portal.
  if (!activeStudent) {
    const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';
    return <Navigate to={isStaff ? '/admin' : '/login'} replace />;
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <StudentDashboard
          student={activeStudent}
          attendance={attendance}
          taskReports={taskReports}
          onNavigateToTab={setActiveTab}
        />
      )}

      {activeTab === 'attendance' && (
        <AttendanceTracker
          student={activeStudent}
          attendanceList={attendance}
          onAttendanceUpdated={loadData}
        />
      )}

      {activeTab === 'logbook' && (
        <TaskReportSubmitter
          student={activeStudent}
          taskReports={taskReports}
          onReportSubmitted={loadData}
        />
      )}

      {activeTab === 'profile' && (
        <StudentProfile student={activeStudent} />
      )}
    </AppLayout>
  );
};

export default Index;
