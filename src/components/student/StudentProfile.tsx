import React from 'react';
import { Student } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Mail, GraduationCap, Calendar, ShieldCheck, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface StudentProfileProps {
  student: Student;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      <Card className="overflow-hidden border-border/70 shadow-card">
        <div className="h-28 bg-gradient-hero relative">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_40%,white,transparent_45%)]" />
          <div className="absolute left-6 -bottom-10 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-elevated flex items-center justify-center font-display font-bold text-2xl tracking-tight">
              {initials}
            </div>
          </div>
        </div>

        <CardContent className="pt-14 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{student.name}</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                  Adm: {student.registrationNo}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                {student.course}
              </p>
            </div>

            <Badge variant="outline" className="w-fit text-xs font-semibold px-3 py-1 text-emerald-700 bg-emerald-50 border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Active Attachment
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Academic Details</h3>
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-3 text-sm">
                <DetailRow icon={User} label="Student Name" value={student.name} />
                <DetailRow icon={Award} label="Admission No" value={student.registrationNo} mono />
                <DetailRow icon={GraduationCap} label="Course Unit" value={student.course} />
                <DetailRow icon={Building2} label="Department" value={student.department} />
                <DetailRow icon={Mail} label="Email" value={student.email} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Placement Details</h3>
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-3 text-sm">
                <DetailRow icon={Building2} label="Host Company" value={student.organization} accent />
                <DetailRow icon={ShieldCheck} label="Supervisor" value={student.supervisorName} accent />
                <DetailRow icon={Calendar} label="Period" value={`${student.startDate} → ${student.endDate}`} accent />
                <DetailRow icon={MapPin} label="Mode" value="Hybrid (On-site & Remote)" accent />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-3">
      <span className="text-muted-foreground flex items-center gap-2 shrink-0">
        <Icon className={`h-4 w-4 ${accent ? 'text-accent' : 'text-primary'}`} />
        {label}
      </span>
      <span className={`font-semibold text-foreground text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
