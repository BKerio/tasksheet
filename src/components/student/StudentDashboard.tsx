import React from 'react';
import { Student, Attendance, TaskReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus } from 'lucide-react';

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
  const averageRating =
    ratedReports.length > 0
      ? Math.round(ratedReports.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReports.length)
      : 0;

  const statusBadge = (status: string) => {
    if (status === 'Approved')
      return <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50">Approved</Badge>;
    if (status === 'Pending')
      return <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">Pending</Badge>;
    return <Badge variant="outline" className="text-[10px] border-rose-300 text-rose-700 bg-rose-50">Needs Revision</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {student.course} &nbsp;·&nbsp; Attached at <span className="font-medium text-foreground">{student.organization}</span>
          </p>
        </div>
        <Button size="sm" onClick={() => onNavigateToTab('logbook')} className="h-8 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" />
          Submit Logbook
        </Button>
      </div>

      {/* Today's Attendance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border bg-card text-sm">
        <div>
          <p className="font-semibold text-foreground text-xs">Today's Attendance</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {todayAttendance
              ? `Logged as ${todayAttendance.status} — ${todayAttendance.checkInTime || '—'} to ${todayAttendance.checkOutTime || '—'}`
              : 'Not yet marked for today.'}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onNavigateToTab('attendance')}
          className="h-7 text-xs font-medium self-start sm:self-auto shrink-0"
        >
          {todayAttendance ? 'View Log' : 'Mark Attendance'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Attendance Rate',
            value: `${attendanceRate}%`,
            sub: `${presentDays} of ${totalDays} days present`,
          },
          {
            label: 'Work Hours',
            value: `${totalHoursLogged}h`,
            sub: `${studentReports.length} task reports`,
          },
          {
            label: 'Approved',
            value: approvedReports,
            sub: `${pendingReports} pending review`,
          },
          {
            label: 'Avg. Grade',
            value: averageRating > 0 ? `${averageRating}%` : '—',
            sub: 'Supervisor score',
          },
        ].map(({ label, value, sub }) => (
          <Card key={label} className="border-border shadow-none">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Logbook Entries */}
      <Card className="border-border shadow-none">
        <CardHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Recent Logbook Entries</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToTab('logbook')}
            className="h-7 text-xs text-primary gap-1 px-1 hover:bg-transparent hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {studentReports.length === 0 ? (
            <p className="p-6 text-center text-xs text-muted-foreground">No task reports submitted yet.</p>
          ) : (
            studentReports.slice(0, 4).map((report) => (
              <div key={report.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{report.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {report.date} &nbsp;·&nbsp; {report.category} &nbsp;·&nbsp; {report.hoursSpent}h
                  </p>
                </div>
                <div className="shrink-0">
                  {report.status === 'Approved' && (
                    <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50">
                      Approved {report.rating ? `(${report.rating}%)` : ''}
                    </Badge>
                  )}
                  {report.status === 'Pending' && (
                    <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">Pending</Badge>
                  )}
                  {report.status === 'Needs Revision' && (
                    <Badge variant="outline" className="text-[10px] border-rose-300 text-rose-700 bg-rose-50">Needs Revision</Badge>
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
