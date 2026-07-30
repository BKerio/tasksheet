import React from 'react';
import { Student } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Identity block */}
      <Card className="border-border shadow-none">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center font-bold text-xl text-foreground shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground font-mono">
                {student.registrationNo}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{student.course}</p>
          </div>
          <Badge variant="outline" className="self-start sm:self-center text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50 shrink-0">
            Active Attachment
          </Badge>
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academic */}
        <Card className="border-border shadow-none">
          <CardContent className="p-5 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Academic Details</p>
            <div className="space-y-3 text-sm">
              <Row label="Full Name" value={student.name} />
              <Row label="Admission No." value={student.registrationNo} mono />
              <Row label="Course Unit" value={student.course} />
              <Row label="Department" value={student.department} />
              <Row label="Email" value={student.email} />
            </div>
          </CardContent>
        </Card>

        {/* Placement */}
        <Card className="border-border shadow-none">
          <CardContent className="p-5 space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Placement Details</p>
            <div className="space-y-3 text-sm">
              <Row label="Host Organisation" value={student.organization} />
              <Row label="Supervisor" value={student.supervisorName} />
              <Row label="Start Date" value={student.startDate} />
              <Row label="End Date" value={student.endDate} />
              <Row label="Mode" value="Hybrid (On-site & Remote)" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-medium text-foreground text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
