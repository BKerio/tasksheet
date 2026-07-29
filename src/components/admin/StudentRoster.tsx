import React from 'react';
import { Student, Attendance, TaskReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, GraduationCap, Building2, Calendar, Clock, Award, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface StudentRosterProps {
  students: Student[];
  attendanceList: Attendance[];
  taskReports: TaskReport[];
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  attendanceList,
  taskReports,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Attachment Student Roster & Academic Progress
        </h2>
        <p className="text-sm text-muted-foreground">
          Track enrolled attachment candidates, total hours completed, attendance consistency, and assigned supervisors.
        </p>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => {
          const studentAtt = attendanceList.filter((a) => a.studentId === student.id);
          const studentRep = taskReports.filter((r) => r.studentId === student.id);

          const totalDays = studentAtt.length;
          const presentDays = studentAtt.filter((a) => a.status === 'Present' || a.status === 'Late').length;
          const attRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
          const totalHours = studentRep.reduce((sum, r) => sum + r.hoursSpent, 0);

          const rated = studentRep.filter((r) => r.rating !== undefined);
          const avgScore = rated.length > 0
            ? Math.round(rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length)
            : 0;

          return (
            <Card key={student.id} className="overflow-hidden border-border/80 hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center border border-primary/20">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">{student.name}</CardTitle>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">Adm: {student.registrationNo}</p>
                    </div>
                  </div>

                  <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 text-[10px]">
                    Active candidate
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Course & Placement info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-primary" /> Course:
                    </span>
                    <span className="font-semibold text-foreground">{student.course}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary" /> Company:
                    </span>
                    <span className="font-semibold text-foreground">{student.organization}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Supervisor:
                    </span>
                    <span className="font-semibold text-foreground">{student.supervisorName}</span>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-muted-foreground">Attendance Rate ({presentDays}/{totalDays} days)</span>
                      <span className="font-bold text-foreground">{attRate}%</span>
                    </div>
                    <Progress value={attRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 bg-muted/20 p-2.5 rounded-lg border border-border/40 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">Work Hours</span>
                      <span className="font-bold text-foreground">{totalHours} hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">Logbooks</span>
                      <span className="font-bold text-foreground">{studentRep.length}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">Avg Score</span>
                      <span className="font-bold text-amber-600">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
