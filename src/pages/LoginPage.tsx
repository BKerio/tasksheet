import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPrismaUsers } from '@/lib/prismaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList, ArrowRight, UserCheck, ShieldCheck, Lock, Mail, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login, switchUser } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [studentId, setStudentId] = useState('24-3769');
  const [studentPassword, setStudentPassword] = useState('password123');

  const [adminEmail, setAdminEmail] = useState('admin@university.ac.ke');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const users = getPrismaUsers();
  const demoStudent = users.find((u) => u.registrationNo === '24-3769') || users.find((u) => u.role === 'STUDENT');
  const demoAdmin =
    users.find((u) => u.email === 'admin@university.ac.ke') ||
    users.find((u) => u.role === 'ADMIN' || u.role === 'SUPERVISOR');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(studentId, studentPassword);
    if (res.success) {
      toast.success('Signed in to Student Portal');
      navigate('/');
    } else {
      toast.error(res.message || 'Login failed.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(adminEmail, adminPassword);
    if (res.success) {
      toast.success('Signed in to Admin Panel');
      navigate('/admin');
    } else {
      toast.error(res.message || 'Login failed.');
    }
  };

  const handleQuickDemo = (userId: string, path: string) => {
    switchUser(userId);
    const u = users.find((x) => x.id === userId);
    toast.success(`Demo Mode: Logged in as ${u?.name}`);
    navigate(path);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-6 overflow-hidden selection:bg-primary/20">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,hsl(173_58%_42%/0.35),transparent_40%),radial-gradient(circle_at_85%_70%,hsl(199_78%_45%/0.25),transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <header className="container mx-auto max-w-5xl flex items-center justify-between py-2 relative z-10 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center shadow-soft backdrop-blur-sm border border-white/20">
            <ClipboardList className="h-4.5 w-4" />
          </div>
          <div>
            <span className="font-display font-semibold text-lg tracking-tight text-white block leading-none">
              AttachTrack
            </span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest">DICT 240</span>
          </div>
        </div>
        <span className="text-xs text-white/65 font-medium hidden sm:inline">Attachment Attendance & Logbook</span>
      </header>

      <main className="container mx-auto max-w-md my-auto py-8 relative z-10 animate-fade-up">
        <div className="bg-card/95 border border-white/10 rounded-2xl p-8 shadow-elevated backdrop-blur-xl space-y-6">
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
                    placeholder="24-3769"
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
                    placeholder="admin@university.ac.ke"
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

          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-[11px] text-muted-foreground text-center font-medium">Quick demo</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {demoStudent && (
                <button
                  type="button"
                  onClick={() => handleQuickDemo(demoStudent.id, '/')}
                  className="px-3 py-1.5 rounded-lg bg-muted hover:bg-secondary border border-border text-[11px] text-primary font-medium transition-colors flex items-center gap-1"
                >
                  Student: Ian
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}

              {demoAdmin && (
                <button
                  type="button"
                  onClick={() => handleQuickDemo(demoAdmin.id, '/admin')}
                  className="px-3 py-1.5 rounded-lg bg-muted hover:bg-secondary border border-border text-[11px] text-accent font-medium transition-colors flex items-center gap-1"
                >
                  Admin
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto text-center py-2 text-[11px] text-white/55 relative z-10">
        © 2026 AttachTrack · Student Attachment Attendance & Task Reporting
      </footer>
    </div>
  );
};
