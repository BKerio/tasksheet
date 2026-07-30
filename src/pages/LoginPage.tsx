import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList, UserCheck, ShieldCheck, Lock, Mail, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    // Ensure stale localStorage sessions from older builds are gone.
    localStorage.removeItem('taskapp_auth_session');
  }, []);

  if (isAuthenticated && user) {
    const destination =
      user.role === 'ADMIN' || user.role === 'SUPERVISOR' ? '/admin' : '/';
    return <Navigate to={destination} replace />;
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(studentId, studentPassword, 'student');
    if (!res.success) {
      toast.error(res.message || 'Login failed.');
      return;
    }

    toast.success('Signed in to Student Portal');
    navigate('/');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(adminEmail, adminPassword, 'admin');
    if (!res.success) {
      toast.error(res.message || 'Login failed.');
      return;
    }

    toast.success('Signed in to Admin Panel');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 selection:bg-primary/20">
      <header className="container mx-auto max-w-5xl flex items-center justify-between py-2 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
            <ClipboardList className="h-4.5 w-4" />
          </div>
          <div>
            <span className="font-display font-semibold text-lg tracking-tight text-foreground block leading-none">
              AttachTrack
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">DICT 240</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
          Attachment Attendance & Logbook
        </span>
      </header>

      <main className="container mx-auto max-w-md my-auto py-8 animate-fade-up">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage attachment attendance and task logbooks
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-muted rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setActiveRole('student')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeRole === 'student'
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeRole === 'admin'
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>Admin</span>
            </button>
          </div>

          {activeRole === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg" className="text-xs font-medium">
                  Registration No.
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your registration number"
                    autoComplete="off"
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pass" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pass"
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 text-sm font-semibold">
                Sign in to Student Portal
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Admin / Supervisor Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter your work email"
                    autoComplete="off"
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apass" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apass"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 text-sm font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
                Sign in to Admin Panel
              </Button>
            </form>
          )}

          <p className="pt-4 border-t border-border text-[11px] text-muted-foreground text-center">
            Accounts are issued by the attachment coordination office.
          </p>
        </div>
      </main>

      <footer className="container mx-auto text-center py-2 text-[11px] text-muted-foreground">
        © 2026 AttachTrack · Student Attachment Attendance & Task Reporting
      </footer>
    </div>
  );
};
