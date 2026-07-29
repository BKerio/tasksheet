import React from 'react';
import { Student, Attendance, TaskReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CalendarCheck,
  FileCheck,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  attendance: Attendance[];
  taskReports: TaskReport[];
  onNavigateToTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  attendance,
  taskReports,
  onNavigateToTab,
}) => {
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentReports = taskReports.filter((r) => r.studentId === student.id);

  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  const totalHoursLogged = studentReports.reduce((sum, r) => sum + r.hoursSpent, 0);
  const approvedReports = studentReports.filter((r) => r.status === 'Approved').length;
  const pendingReports = studentReports.filter((r) => r.status === 'Pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = studentAttendance.find((a) => a.date === todayStr);

  const ratedReports = studentReports.filter((r) => r.rating !== undefined);
  const averageRating = ratedReports.length > 0
    ? Math.round(ratedReports.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReports.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Clean Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {student.course} • Attached at <span className="font-medium text-foreground">{student.organization}</span>
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigateToTab('logbook')}
            className="h-9 px-3 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Submit Logbook
          </Button>
        </div>
      </div>

      {/* Today's Attendance Bar */}
      <div className="p-4 rounded-xl border border-border/50 bg-card shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Today's Attendance Status</p>
            <p className="text-muted-foreground text-[11px]">
              {todayAttendance
                ? `Logged as ${todayAttendance.status} at ${todayAttendance.checkInTime || '08:15 AM'}`
                : 'Mark your check-in time for today.'}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onNavigateToTab('attendance')}
          className="h-8 text-xs font-medium self-start sm:self-auto"
        >
          {todayAttendance ? 'View Attendance Log' : 'Mark Attendance'}
        </Button>
      </div>

      {/* Clean Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <Card className="border-border/50 shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Attendance Rate</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{attendanceRate}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{presentDays} of {totalDays} days present</p>
          </CardContent>
        </Card>

        {/* Total Hours */}
        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Work Hours</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalHoursLogged} hrs</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{studentReports.length} task reports</p>
          </CardContent>
        </Card>

        {/* Approved Reports */}
        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Approved Reports</p>
            <p className="text-2xl font-bold text-foreground mt-1">{approvedReports}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{pendingReports} pending review</p>
          </CardContent>
        </Card>

        {/* Average Assessment */}
        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Average Grade</p>
            <p className="text-2xl font-bold text-foreground mt-1">{averageRating > 0 ? `${averageRating}%` : 'N/A'}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Supervisor score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Recent Submissions Section */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Recent Logbook Entries</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToTab('logbook')}
            className="h-7 text-xs text-primary hover:text-primary/90 gap-1 p-0"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/40">
          {studentReports.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No task reports submitted yet.
            </div>
          ) : (
            studentReports.slice(0, 4).map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">{report.date}</span>
                    <span className="text-[11px] text-muted-foreground">• {report.category}</span>
                  </div>
                  <p className="font-semibold text-xs text-foreground truncate">{report.title}</p>
                </div>

                <div className="shrink-0">
                  {report.status === 'Approved' && (
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-50/50">
                      Approved ({report.rating}%)
                    </Badge>
                  )}
                  {report.status === 'Pending' && (
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-50/50">
                      Pending
                    </Badge>
                  )}
                  {report.status === 'Needs Revision' && (
                    <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-500/30 bg-rose-50/50">
                      Needs Revision
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
