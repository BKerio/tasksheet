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
import { CalendarCheck, Plus, CheckCircle2, Clock, MapPin, Building2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceTrackerProps {
  student: Student;
  attendanceList: Attendance[];
  onAttendanceUpdated: () => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  student,
  attendanceList,
  onAttendanceUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
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
    if (!date) {
      toast.error('Please select a date.');
      return;
    }

    addAttendanceRecord({
      studentId: student.id,
      date,
      status,
      checkInTime,
      checkOutTime,
      workMode,
      location,
      notes,
    });

    toast.success(`Attendance for ${date} recorded successfully!`);
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
      {/* Header & Mark Attendance Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" />
            Daily Attachment Attendance Log
          </h2>
          <p className="text-sm text-muted-foreground">
            Record daily presence, work mode, and check-in times for supervisor verification.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold shadow">
              <Plus className="h-4 w-4" />
              Log Today's Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Record Attachment Attendance
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status">Attendance Status</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val as AttendanceStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
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
                  <Label htmlFor="checkIn">Check-In Time</Label>
                  <Input
                    id="checkIn"
                    type="text"
                    placeholder="e.g. 08:15 AM"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkOut">Check-Out Time</Label>
                  <Input
                    id="checkOut"
                    type="text"
                    placeholder="e.g. 05:00 PM"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <Select value={workMode} onValueChange={(val) => setWorkMode(val as WorkMode)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site (At Company)</SelectItem>
                      <SelectItem value="Remote">Remote / Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Location / Office Room</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g. HQ Room 3B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes / Reason (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g. Attended morning sprint planning meeting."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  Submit Attendance Log
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendance logs by date, location, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
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

      {/* Attendance History Table / Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Attendance Records</CardTitle>
          <CardDescription className="text-xs">
            {filteredAttendance.length} entries recorded for {student.name} ({student.registrationNo})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAttendance.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No matching attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timestamps</th>
                    <th className="p-4">Work Mode & Location</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{record.date}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            record.status === 'Present'
                              ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20'
                              : record.status === 'Late'
                              ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/20'
                              : 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/20'
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
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{record.workMode}</span>
                          {record.location && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {record.location}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground max-w-xs truncate">
                        {record.notes || '-'}
                      </td>
                      <td className="p-4 text-right">
                        {record.verifiedBySupervisor ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/40 bg-emerald-50 hover:bg-emerald-50">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">
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
