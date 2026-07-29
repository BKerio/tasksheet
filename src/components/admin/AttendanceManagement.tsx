import React, { useState } from 'react';
import { Student, Attendance, AttendanceStatus } from '@/types';
import { saveAttendance } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CheckCircle2, Search, Filter, ShieldCheck, Download, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceManagementProps {
  students: Student[];
  attendanceList: Attendance[];
  onAttendanceUpdated: () => void;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  students,
  attendanceList,
  onAttendanceUpdated,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleVerification = (recordId: string) => {
    const updated = attendanceList.map((rec) => {
      if (rec.id === recordId) {
        return { ...rec, verifiedBySupervisor: !rec.verifiedBySupervisor };
      }
      return rec;
    });
    saveAttendance(updated);
    toast.success('Attendance verification status updated.');
    onAttendanceUpdated();
  };

  const filteredAttendance = attendanceList.filter((record) => {
    const matchesStudent = selectedStudentId === 'all' || record.studentId === selectedStudentId;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const studentObj = students.find((s) => s.id === record.studentId);
    const matchesSearch =
      record.date.includes(searchQuery) ||
      (studentObj && studentObj.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (studentObj && studentObj.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStudent && matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Student Name,Registration No,Date,Status,CheckIn,CheckOut,WorkMode,Verified']
        .concat(
          filteredAttendance.map((rec) => {
            const st = students.find((s) => s.id === rec.studentId);
            return `"${st?.name || ''}","${st?.registrationNo || ''}","${rec.date}","${rec.status}","${rec.checkInTime || ''}","${rec.checkOutTime || ''}","${rec.workMode}","${rec.verifiedBySupervisor ? 'Yes' : 'No'}"`;
          })
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attachment_attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance CSV report downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-amber-500" />
            Supervisor Attendance Oversight & Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor, filter, and verify daily physical and remote attendance for all attachment students.
          </p>
        </div>

        <Button onClick={exportCSV} variant="outline" className="gap-2 font-semibold text-xs border-border/80">
          <Download className="h-4 w-4" />
          Export Attendance (CSV)
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, registration no, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Student Selector Filter */}
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((st) => (
                  <SelectItem key={st.id} value={st.id}>
                    {st.name} ({st.registrationNo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Half-Day">Half-Day</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Roster Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Student Attendance Records</CardTitle>
          <CardDescription className="text-xs">
            Showing {filteredAttendance.length} attendance entries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAttendance.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No matching attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Check-In / Out</th>
                    <th className="p-4">Work Mode</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAttendance.map((record) => {
                    const studentObj = students.find((s) => s.id === record.studentId);
                    return (
                      <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-foreground">{studentObj?.name || 'Unknown Student'}</p>
                            <p className="text-[11px] text-muted-foreground">Adm: {studentObj?.registrationNo}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-foreground">{record.date}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              record.status === 'Present'
                                ? 'bg-emerald-500/15 text-emerald-700 border-none'
                                : record.status === 'Late'
                                ? 'bg-amber-500/15 text-amber-700 border-none'
                                : 'bg-rose-500/15 text-rose-700 border-none'
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{record.checkInTime || '--'} - {record.checkOutTime || '--'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{record.workMode}</td>
                        <td className="p-4 text-muted-foreground max-w-xs truncate">{record.notes || '-'}</td>
                        <td className="p-4 text-right">
                          <Button
                            size="sm"
                            variant={record.verifiedBySupervisor ? 'outline' : 'default'}
                            onClick={() => toggleVerification(record.id)}
                            className={
                              record.verifiedBySupervisor
                                ? 'text-[11px] h-7 text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-[11px] h-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                            }
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {record.verifiedBySupervisor ? 'Verified' : 'Verify Entry'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
