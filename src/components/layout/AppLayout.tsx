import React, { useState } from 'react';
import { Student, Supervisor } from '@/types';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  students: Student[];
  supervisors: Supervisor[];
  activeStudent: Student | null;
  activeSupervisor: Supervisor | null;
  onSelectStudent: (student: Student) => void;
  onSelectSupervisor: (supervisor: Supervisor) => void;
  onDataReset: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  students,
  supervisors,
  activeStudent,
  activeSupervisor,
  onSelectStudent,
  onSelectSupervisor,
  onDataReset,
  activeTab,
  onTabChange,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-foreground flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Header
          students={students}
          supervisors={supervisors}
          activeStudent={activeStudent}
          activeSupervisor={activeSupervisor}
          onSelectStudent={onSelectStudent}
          onSelectSupervisor={onSelectSupervisor}
          onDataReset={onDataReset}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-up">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>

        <footer className="border-t border-border/50 py-4 px-6 text-center text-xs text-muted-foreground bg-card/60">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 AttachTrack · Attachment Attendance & Task Reporting</span>
            <span className="font-semibold text-primary">DICT 240</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
