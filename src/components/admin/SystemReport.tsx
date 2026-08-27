import React from 'react';
import { Student, Supervisor, Attendance, TaskReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FileBarChart,
  Download,
  Users,
  CalendarCheck,
  Star,
  Clock3,
  PieChart as PieChartIcon,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemReportProps {
  students: Student[];
  supervisors: Supervisor[];
  attendanceList: Attendance[];
  taskReports: TaskReport[];
}

// Solid, flat colors only — no gradients — kept distinct per series so charts stay
// readable when several categories are shown side by side.
const ATTENDANCE_COLORS: Record<string, string> = {
  Present: '#10b981',
  Late: '#f59e0b',
  'Half-Day': '#0ea5e9',
  'On Leave': '#8b5cf6',
  Absent: '#ef4444',
};

const TASK_STATUS_COLORS: Record<string, string> = {
  Approved: '#10b981',
  Pending: '#f59e0b',
  'Needs Revision': '#f43f5e',
  Rejected: '#dc2626',
};

const WORK_MODE_COLORS: Record<string, string> = {
  'On-site': '#0ea5e9',
  Remote: '#8b5cf6',
};

const DEPARTMENT_PALETTE = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#eab308', '#06b6d4'];
const CATEGORY_PALETTE = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

const rateBarColor = (rate: number) => (rate >= 80 ? '#10b981' : rate >= 50 ? '#f59e0b' : '#ef4444');

export const SystemReport: React.FC<SystemReportProps> = ({
  students,
  supervisors,
  attendanceList,
  taskReports,
}) => {
  // ── KPI headline numbers ────────────────────────────────────────────
  const totalStudents = students.length;
  const totalPresentLike = attendanceList.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const overallAttendanceRate = attendanceList.length > 0
    ? Math.round((totalPresentLike / attendanceList.length) * 100)
    : 0;
  const ratedReports = taskReports.filter((r) => r.rating !== undefined);
  const overallAvgRating = ratedReports.length > 0
    ? Math.round(ratedReports.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedReports.length)
    : 0;
  const totalHoursLogged = taskReports.reduce((sum, r) => sum + r.hoursSpent, 0);

  // ── Attendance status distribution (pie) ────────────────────────────
  const attendanceStatusData = (['Present', 'Late', 'Half-Day', 'On Leave', 'Absent'] as const)
    .map((status) => ({ name: status, value: attendanceList.filter((a) => a.status === status).length }))
    .filter((d) => d.value > 0);

  // ── Task report status distribution (pie) ───────────────────────────
  const taskStatusData = (['Approved', 'Pending', 'Needs Revision', 'Rejected'] as const)
    .map((status) => ({ name: status, value: taskReports.filter((r) => r.status === status).length }))
    .filter((d) => d.value > 0);

  // ── Work mode split (pie) ────────────────────────────────────────────
  const workModeData = (['On-site', 'Remote'] as const)
    .map((mode) => ({ name: mode, value: attendanceList.filter((a) => a.workMode === mode).length }))
    .filter((d) => d.value > 0);

  // ── Students by department (pie) ────────────────────────────────────
  const departmentCounts: Record<string, number> = {};
  students.forEach((s) => {
    departmentCounts[s.department] = (departmentCounts[s.department] || 0) + 1;
  });
  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));

  // ── Task hours by technical category (bar) ──────────────────────────
  const categoryHours: Record<string, number> = {};
  taskReports.forEach((r) => {
    categoryHours[r.category] = (categoryHours[r.category] || 0) + r.hoursSpent;
  });
  const categoryHoursData = Object.entries(categoryHours).map(([category, hours]) => ({
    category: category.length > 14 ? `${category.substring(0, 14)}…` : category,
    hours,
  }));

  // ── Average grade by category (bar) ─────────────────────────────────
  const categoryRatings: Record<string, number[]> = {};
  taskReports.forEach((r) => {
    if (r.rating !== undefined) {
      categoryRatings[r.category] = categoryRatings[r.category] || [];
      categoryRatings[r.category].push(r.rating);
    }
  });
  const categoryGradeData = Object.entries(categoryRatings).map(([category, ratings]) => ({
    category: category.length > 14 ? `${category.substring(0, 14)}…` : category,
    avgGrade: Math.round(ratings.reduce((sum, v) => sum + v, 0) / ratings.length),
  }));

  // ── Attendance rate per student (horizontal bar) ────────────────────
  const studentRateData = students
    .map((s) => {
      const records = attendanceList.filter((a) => a.studentId === s.id);
      const present = records.filter((a) => a.status === 'Present' || a.status === 'Late').length;
      const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
      const shortName = s.name.length > 16 ? `${s.name.substring(0, 16)}…` : s.name;
      return { name: shortName, rate };
    })
    .sort((a, b) => b.rate - a.rate);

  // ── Student headcount per supervisor (bar) ──────────────────────────
  const supervisorCounts: Record<string, number> = {};
  students.forEach((s) => {
    supervisorCounts[s.supervisorName] = (supervisorCounts[s.supervisorName] || 0) + 1;
  });
  const supervisorLoadData = Object.entries(supervisorCounts).map(([name, count]) => ({
    name: name.length > 16 ? `${name.substring(0, 16)}…` : name,
    count,
  }));

  const exportSummaryCSV = () => {
    const lines: string[] = [];
    lines.push(`AttachTrack System Report — Generated ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push('Attendance Status,Count');
    attendanceStatusData.forEach((d) => lines.push(`"${d.name}",${d.value}`));
    lines.push('');
    lines.push('Task Report Status,Count');
    taskStatusData.forEach((d) => lines.push(`"${d.name}",${d.value}`));
    lines.push('');
    lines.push('Work Mode,Count');
    workModeData.forEach((d) => lines.push(`"${d.name}",${d.value}`));
    lines.push('');
    lines.push('Department,Students');
    departmentData.forEach((d) => lines.push(`"${d.name}",${d.value}`));
    lines.push('');
    lines.push('Task Category,Hours Logged,Average Grade');
    categoryHoursData.forEach((d) => {
      const grade = categoryGradeData.find((g) => g.category === d.category);
      lines.push(`"${d.category}",${d.hours},${grade ? grade.avgGrade : ''}`);
    });
    lines.push('');
    lines.push('Student,Attendance Rate (%)');
    studentRateData.forEach((d) => lines.push(`"${d.name}",${d.rate}`));
    lines.push('');
    lines.push('Supervisor,Assigned Students');
    supervisorLoadData.forEach((d) => lines.push(`"${d.name}",${d.count}`));

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `attachtrack_system_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('System report CSV downloaded.');
  };

  const pieLabel = ({ name, percent }: { name: string; percent: number }) =>
    `${name} ${Math.round(percent * 100)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-amber-500" />
            System Report & Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            A full-program snapshot of attendance, task performance, and departmental spread across DICT 240.
          </p>
        </div>

        <Button onClick={exportSummaryCSV} variant="outline" className="gap-2 font-semibold text-xs border-border/80 shrink-0">
          <Download className="h-4 w-4" />
          Export Summary (CSV)
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents, sub: 'Enrolled candidates', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Overall Attendance', value: `${overallAttendanceRate}%`, sub: 'Present/Late across all logs', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Average Grade', value: overallAvgRating > 0 ? `${overallAvgRating}%` : '—', sub: 'Across evaluated logbooks', icon: Star, color: 'text-violet-600 bg-violet-50' },
          { label: 'Hours Logged', value: `${totalHoursLogged}h`, sub: 'Total task hours reported', icon: Clock3, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="border-border/40 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie Charts Row 1: Attendance & Task Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <PieChartIcon className="h-3.5 w-3.5 text-sky-500" />
              Attendance Status Distribution
            </CardTitle>
            <CardDescription className="text-[11px]">Every logged day, grouped by status.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {attendanceStatusData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendanceStatusData} cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value" label={pieLabel} labelLine={false}>
                    {attendanceStatusData.map((d) => (
                      <Cell key={d.name} fill={ATTENDANCE_COLORS[d.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <PieChartIcon className="h-3.5 w-3.5 text-emerald-500" />
              Task Logbook Review Status
            </CardTitle>
            <CardDescription className="text-[11px]">Where every submitted report currently stands.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {taskStatusData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value" label={pieLabel} labelLine={false}>
                    {taskStatusData.map((d) => (
                      <Cell key={d.name} fill={TASK_STATUS_COLORS[d.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row 2: Work Mode & Department */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <PieChartIcon className="h-3.5 w-3.5 text-violet-500" />
              On-site vs. Remote Split
            </CardTitle>
            <CardDescription className="text-[11px]">How attachment days are being worked.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {workModeData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={workModeData} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value" label={pieLabel} labelLine={false}>
                    {workModeData.map((d) => (
                      <Cell key={d.name} fill={WORK_MODE_COLORS[d.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <PieChartIcon className="h-3.5 w-3.5 text-amber-500" />
              Candidates by Department
            </CardTitle>
            <CardDescription className="text-[11px]">Enrollment spread across academic departments.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {departmentData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3} dataKey="value" label={false} labelLine={false}>
                    {departmentData.map((d, i) => (
                      <Cell key={d.name} fill={DEPARTMENT_PALETTE[i % DEPARTMENT_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar Charts Row: Hours & Grades by category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-sky-500" />
              Task Hours by Technical Domain
            </CardTitle>
            <CardDescription className="text-[11px]">Total hours logged, grouped by task category.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {categoryHoursData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {categoryHoursData.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-none">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-violet-500" />
              Average Grade by Category
            </CardTitle>
            <CardDescription className="text-[11px]">Mean supervisor score, by task category.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 p-4">
            {categoryGradeData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryGradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="avgGrade" radius={[4, 4, 0, 0]}>
                    {categoryGradeData.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_PALETTE[(i + 2) % CATEGORY_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance Rate by Student — horizontal bar */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
            Attendance Rate by Student
          </CardTitle>
          <CardDescription className="text-[11px]">Ranked highest to lowest. Green ≥80%, amber ≥50%, red below.</CardDescription>
        </CardHeader>
        <CardContent className="p-4" style={{ height: Math.max(220, studentRateData.length * 34) }}>
          {studentRateData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentRateData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Attendance Rate']} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {studentRateData.map((d, i) => (
                    <Cell key={i} fill={rateBarColor(d.rate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Supervisor Workload */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-amber-500" />
            Assigned Students per Supervisor
          </CardTitle>
          <CardDescription className="text-[11px]">Supervision workload distribution across staff.</CardDescription>
        </CardHeader>
        <CardContent className="h-72 p-4">
          {supervisorLoadData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supervisorLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {supervisorLoadData.map((_, i) => (
                    <Cell key={i} fill={DEPARTMENT_PALETTE[i % DEPARTMENT_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
    No data available yet.
  </div>
);
