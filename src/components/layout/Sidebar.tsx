import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ClipboardList,
  LayoutDashboard,
  CalendarCheck,
  FileCheck,
  User,
  Users,
  UserCheck,
  ShieldCheck,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isAdminView = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
    { id: 'logbook', label: 'Task Logbook', icon: FileCheck },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck },
    { id: 'student-management', label: 'Student Management', icon: UserCheck },
    { id: 'task-reviews', label: 'Logbook Reviews', icon: FileCheck },
    { id: 'attendance-monitoring', label: 'Attendance Logs', icon: CalendarCheck },
    { id: 'student-roster', label: 'Student Roster', icon: Users },
    { id: 'system-docs', label: 'DFD & ERD Specs', icon: BookOpen },
  ];

  const currentNavItems = isAdminView ? adminNavItems : studentNavItems;
  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div>
        <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-soft">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display font-semibold text-sm tracking-tight text-sidebar-foreground block leading-tight">
                  AttachTrack
                </span>
                <span className="text-[9px] uppercase tracking-widest text-sidebar-foreground/50">
                  {isAdminView ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
              <ClipboardList className="h-4 w-4" />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-7 w-7 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </Button>
        </div>

        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold text-sidebar-foreground/45 uppercase tracking-widest">
              {isAdminView ? 'Supervisor Hub' : 'Student Hub'}
            </p>
          )}

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-soft'
                    : 'text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sidebar-primary' : ''}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-sidebar-border">
        {user && (
          <div className={`flex items-center gap-2 p-1.5 rounded-lg ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent text-sidebar-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-sidebar-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-sidebar-foreground/50 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogoutDialog(true)}
              className="h-7 w-7 text-sidebar-foreground/55 hover:text-rose-300 hover:bg-rose-500/10"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen. Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};
