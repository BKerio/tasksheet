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
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { AttendanceTracker } from '@/components/student/AttendanceTracker';
import { TaskReportSubmitter } from '@/components/student/TaskReportSubmitter';
import { StudentProfile } from '@/components/student/StudentProfile';

const Index: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [taskReports, setTaskReports] = useState<TaskReport[]>([]);
  
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeSupervisor, setActiveSupervisor] = useState<Supervisor | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const loadData = () => {
    const stds = getStoredStudents();
    const sups = getStoredSupervisors();
    const atts = getStoredAttendance();
    const reps = getStoredTaskReports();

    setStudents(stds);
    setSupervisors(sups);
    setAttendance(atts);
    setTaskReports(reps);

    // If user logged in as a student, pick that student
    const foundCurrentStudent = stds.find((s) => s.email === user?.email || s.registrationNo === user?.registrationNo);
    setActiveStudent(foundCurrentStudent || stds[0]);
    if (sups.length > 0) setActiveSupervisor(sups[0]);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!activeStudent || !activeSupervisor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Loading Student Attachment System...
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
