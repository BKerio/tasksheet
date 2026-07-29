import React from 'react';
import { Student, Supervisor, Attendance, TaskReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CalendarCheck,
  FileCheck,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  students: Student[];
  supervisors: Supervisor[];
  attendanceList: Attendance[];
  taskReports: TaskReport[];
  activeSupervisor: Supervisor;
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  attendanceList,
  taskReports,
  activeSupervisor,
  onNavigateToTab,
}) => {
  const totalStudents = students.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceList.filter((a) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 100;

  const pendingReports = taskReports.filter((r) => r.status === 'Pending');
  const reviewedReports = taskReports.filter((r) => r.rating !== undefined);
  const avgScore = reviewedReports.length > 0
    ? Math.round(reviewedReports.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewedReports.length)
    : 0;

  const attendanceStatusCounts = {
    Present: attendanceList.filter((a) => a.status === 'Present').length,
    Late: attendanceList.filter((a) => a.status === 'Late').length,
    'On Leave': attendanceList.filter((a) => a.status === 'On Leave').length,
    Absent: attendanceList.filter((a) => a.status === 'Absent').length,
  };

  const attendancePieData = [
    { name: 'Present', value: attendanceStatusCounts.Present, color: '#10b981' },
    { name: 'Late', value: attendanceStatusCounts.Late, color: '#f59e0b' },
    { name: 'On Leave', value: attendanceStatusCounts['On Leave'], color: '#6366f1' },
    { name: 'Absent', value: attendanceStatusCounts.Absent, color: '#ef4444' },
  ];

  const categoryHoursMap: Record<string, number> = {};
  taskReports.forEach((r) => {
    categoryHoursMap[r.category] = (categoryHoursMap[r.category] || 0) + r.hoursSpent;
  });

  const categoryBarData = Object.keys(categoryHoursMap).map((cat) => ({
    category: cat.length > 12 ? cat.substring(0, 12) + '...' : cat,
    hours: categoryHoursMap[cat],
  }));

  return (
    <div className="space-y-6">
      {/* Clean Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Supervisor Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeSupervisor.name} • {activeSupervisor.department}
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => onNavigateToTab('task-reviews')}
          className="h-9 px-3 text-xs font-semibold gap-1.5 shadow-soft bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <FileCheck className="h-3.5 w-3.5" />
          Review Logbooks ({pendingReports.length})
        </Button>
      </div>

      {/* Clean Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Active Candidates</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalStudents}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Enrolled in DICT 240</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Today's Attendance</p>
            <p className="text-2xl font-bold text-foreground mt-1">{attendanceRate}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{presentToday} of {totalStudents} present today</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pending Reviews</p>
            <p className="text-2xl font-bold text-foreground mt-1">{pendingReports.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting evaluation</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none hover:border-border/80 transition-colors">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Average Grade</p>
            <p className="text-2xl font-bold text-foreground mt-1">{avgScore}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across all evaluations</p>
          </CardContent>
        </Card>
      </div>

      {/* Clean Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attendance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-60 p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Hours by Technical Domain
            </CardTitle>
          </CardHeader>
          <CardContent className="h-60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(199 78% 32%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Action Items Section */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pending Submissions Requiring Grading
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateToTab('task-reviews')}
            className="h-7 text-xs text-primary hover:text-primary/90 gap-1 p-0"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/40">
          {pendingReports.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              All logbooks evaluated.
            </div>
          ) : (
            pendingReports.slice(0, 3).map((report) => {
              const studentObj = students.find((s) => s.id === report.studentId);
              return (
                <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        {studentObj ? `${studentObj.name}` : 'Student'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">• Date: {report.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{report.title}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onNavigateToTab('task-reviews')}
                    className="h-8 px-3 text-xs bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shrink-0"
                  >
                    Grade & Review
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
