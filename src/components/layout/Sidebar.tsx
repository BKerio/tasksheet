import React, { useEffect, useState } from 'react';
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
  ChevronRight,
} from 'lucide-react';
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
  /** Called whenever collapsed state changes so the parent can adjust its margin. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

type NavItem = { id: string; label: string; icon: React.ElementType };
type NavSection = { title?: string; items: NavItem[] };

const studentSections: NavSection[] = [
  {
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'My Work',
    items: [
      { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
      { id: 'logbook', label: 'Task Logbook', icon: FileCheck },
    ],
  },
  {
    title: 'Account',
    items: [{ id: 'profile', label: 'My Profile', icon: User }],
  },
];

const adminSections: NavSection[] = [
  {
    items: [{ id: 'overview', label: 'Overview', icon: ShieldCheck }],
  },
  {
    title: 'Management',
    items: [
      { id: 'student-management', label: 'Student Management', icon: UserCheck },
      { id: 'task-reviews', label: 'Logbook Reviews', icon: FileCheck },
      { id: 'attendance-monitoring', label: 'Attendance Logs', icon: CalendarCheck },
      { id: 'student-roster', label: 'Student Roster', icon: Users },
    ],
  },
  {
    title: 'System',
    items: [{ id: 'system-docs', label: 'DFD & ERD Specs', icon: BookOpen }],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onCollapsedChange }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const storageKey = 'taskapp_sidebar_collapsed';

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === 'true';
  });
  const [hovered, setHovered] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isExpanded = !collapsed || hovered;
  const isAdminView = location.pathname.startsWith('/admin');
  const sections = isAdminView ? adminSections : studentSections;

  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  useEffect(() => {
    localStorage.setItem(storageKey, String(collapsed));
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <>
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed top-0 left-0 bottom-0 z-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border
          flex flex-col transition-all duration-300 select-none
          ${collapsed ? 'w-16' : 'w-60'}
          ${collapsed && hovered ? 'w-60 shadow-2xl z-50' : ''}
        `}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border shrink-0">
          {isExpanded ? (
            <div className="flex items-center gap-2.5 px-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-soft shrink-0">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="font-display font-semibold text-sm tracking-tight text-sidebar-foreground block leading-tight truncate">
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

          {/* Toggle button — hidden when hovered-expanded so it doesn't push layout */}
          {(!collapsed || !hovered) && (
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-sidebar-foreground/60
                hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors hidden md:flex shrink-0"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              {isExpanded && section.title && (
                <p className="px-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/45 uppercase tracking-widest">
                  {section.title}
                </p>
              )}

              {section.items.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    title={!isExpanded ? label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group
                      ${isExpanded ? '' : 'justify-center px-0'}
                      ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-soft'
                          : 'text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'
                      }
                    `}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors duration-200
                        ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'}
                      `}
                    />
                    {isExpanded && <span className="whitespace-nowrap">{label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Footer ─────────────────────────────────────────── */}
        {user && (
          <div className="p-3 border-t border-sidebar-border flex flex-col gap-2 bg-sidebar/80 shrink-0">
            {/* Avatar + name */}
            <div className={`flex items-center gap-2.5 ${!isExpanded ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-sidebar-accent text-sidebar-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                {initials}
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-sidebar-foreground truncate leading-none">{user.name}</p>
                  <p className="text-[10px] text-sidebar-foreground/50 capitalize mt-0.5">{user.role.toLowerCase()}</p>
                </div>
              )}
            </div>

            {/* Logout */}
            {isExpanded ? (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                  bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold
                  transition-colors duration-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLogoutDialog(true)}
                title="Sign Out"
                className="w-full flex items-center justify-center p-2 rounded-lg
                  text-rose-400 hover:bg-rose-500/10 transition-colors duration-200"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </aside>

      {/* ── Logout confirmation ─────────────────────────────── */}
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
    </>
  );
};
