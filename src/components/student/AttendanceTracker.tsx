import React, { useState } from 'react';
import { Student, Attendance, AttendanceStatus, WorkMode } from '@/types';
import { addAttendanceRecord } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceTrackerProps {
  student: Student;
  attendanceList: Attendance[];
  onAttendanceUpdated: () => void;
}

const statusStyles: Record<string, string> = {
  Present: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  Late: 'border-amber-300 text-amber-700 bg-amber-50',
  'Half-Day': 'border-sky-300 text-sky-700 bg-sky-50',
  'On Leave': 'border-slate-300 text-slate-600 bg-slate-50',
  Absent: 'border-rose-300 text-rose-700 bg-rose-50',
};

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  student,
  attendanceList,
  onAttendanceUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatus>('Present');
  const [checkInTime, setCheckInTime] = useState('08:15 AM');
  const [checkOutTime, setCheckOutTime] = useState('05:00 PM');
  const [workMode, setWorkMode] = useState<WorkMode>('On-site');
  const [location, setLocation] = useState('Head Office - Main Premises');
  const [notes, setNotes] = useState('');

  const studentAttendance = attendanceList.filter((a) => a.studentId === student.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) { toast.error('Please select a date.'); return; }

    addAttendanceRecord({ studentId: student.id, date, status, checkInTime, checkOutTime, workMode, location, notes });
    toast.success(`Attendance for ${date} recorded.`);
    setIsOpen(false);
    onAttendanceUpdated();
  };

  const filteredAttendance = studentAttendance.filter((record) => {
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesSearch =
      record.date.includes(searchQuery) ||
      (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.location && record.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground">Daily Attendance Log</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Record daily presence, work mode, and check-in times for supervisor verification.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto">
              <Plus className="h-3.5 w-3.5" />
              Log Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val as AttendanceStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Half-Day">Half-Day</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="checkIn">Check-In</Label>
                  <Input id="checkIn" placeholder="08:15 AM" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkOut">Check-Out</Label>
                  <Input id="checkOut" placeholder="05:00 PM" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <Select value={workMode} onValueChange={(val) => setWorkMode(val as WorkMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g. HQ Room 3B" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="e.g. Attended morning sprint planning." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="font-medium">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by date, location, or notes…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Table */}
      <Card className="border-border shadow-none">
        <CardHeader className="px-4 py-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Attendance Records</CardTitle>
          <CardDescription className="text-[11px]">
            {filteredAttendance.length} entr{filteredAttendance.length === 1 ? 'y' : 'ies'} for {student.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAttendance.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No matching attendance records.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time In / Out</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3 text-right">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{record.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[10px] ${statusStyles[record.status] ?? ''}`}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {record.checkInTime || '-'} – {record.checkOutTime || '-'}
                      </td>
                      <td className="px-4 py-3 text-foreground">{record.workMode}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{record.location || '-'}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{record.notes || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        {record.verifiedBySupervisor ? (
                          <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">
                            Pending
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
