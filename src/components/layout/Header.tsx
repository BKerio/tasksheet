import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  UserCheck,
  ShieldCheck,
  RotateCcw,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Student, Supervisor } from '@/types';
import { resetToInitialData } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface HeaderProps {
  students: Student[];
  supervisors: Supervisor[];
  activeStudent: Student | null;
  activeSupervisor: Supervisor | null;
  onSelectStudent: (student: Student) => void;
  onSelectSupervisor: (supervisor: Supervisor) => void;
  onDataReset?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDataReset,
  onToggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdminView = location.pathname.startsWith('/admin');
  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const handleReset = () => {
    resetToInitialData();
    localStorage.removeItem('taskapp_prisma_users');
    toast.success('Data reset to initial state');
    if (onDataReset) onDataReset();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-border/60 bg-card/80 backdrop-blur-md shadow-soft">
      <div className="px-4 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div>
            <span className="text-sm font-display font-semibold text-foreground block leading-tight">
              {isAdminView ? 'Supervisor Portal' : 'Student Portal'}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              Attachment tracking workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/70 border border-border/50 text-xs font-medium text-muted-foreground">
            {isAdminView ? (
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            ) : (
              <UserCheck className="h-3.5 w-3.5 text-primary" />
            )}
            <span className="capitalize">{user?.role.toLowerCase()}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-9 px-2 hover:bg-muted/70">
                <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[11px]">
                  {initials}
                </div>
                <span className="text-xs font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem onClick={handleReset} className="cursor-pointer text-xs">
                <RotateCcw className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                Reset Demo Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs text-rose-600 font-medium">
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
