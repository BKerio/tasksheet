import React, { useState } from 'react';
import { Student, Supervisor, TaskReport, ReportStatus } from '@/types';
import { reviewTaskReport, deleteTaskReport } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  MessageSquare,
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface TaskReportReviewProps {
  students: Student[];
  taskReports: TaskReport[];
  activeSupervisor: Supervisor;
  onReportReviewed: () => void;
}

export const TaskReportReview: React.FC<TaskReportReviewProps> = ({
  students,
  taskReports,
  activeSupervisor,
  onReportReviewed,
}) => {
  const [selectedReport, setSelectedReport] = useState<TaskReport | null>(null);
  const [deletingReport, setDeletingReport] = useState<TaskReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Form State
  const [reviewStatus, setReviewStatus] = useState<ReportStatus>('Approved');
  const [rating, setRating] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('');

  const openReviewModal = (report: TaskReport) => {
    setSelectedReport(report);
    setReviewStatus(report.status === 'Pending' ? 'Approved' : report.status);
    setRating(report.rating || 90);
    setFeedback(report.feedback || '');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    reviewTaskReport(
      selectedReport.id,
      reviewStatus,
      feedback,
      rating,
      activeSupervisor.name
    );

    toast.success(`Task report evaluated & marked as ${reviewStatus}!`);
    setSelectedReport(null);
    onReportReviewed();
  };

  const handleDeleteConfirm = () => {
    if (!deletingReport) return;
    deleteTaskReport(deletingReport.id);
    toast.success('Task report deleted.');
    setDeletingReport(null);
    onReportReviewed();
  };

  const filteredReports = taskReports.filter((report) => {
    const matchesStudent = selectedStudentId === 'all' || report.studentId === selectedStudentId;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const studentObj = students.find((s) => s.id === report.studentId);
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (studentObj && studentObj.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStudent && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-amber-500" />
            Supervisor Task Report Grading & Feedback Hub
          </h2>
          <p className="text-sm text-muted-foreground">
            Review student attachment logbooks, assign performance grades, and provide constructive feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (filteredReports.length === 0) {
                toast.error('No reports to export.');
                return;
              }
              const { exportTaskReportsToExcel } = await import('@/lib/export');
              exportTaskReportsToExcel(filteredReports, students);
              toast.success('Exported to Excel.');
            }}
            className="text-xs gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (filteredReports.length === 0) {
                toast.error('No reports to export.');
                return;
              }
              const { exportTaskReportsToPDF } = await import('@/lib/export');
              exportTaskReportsToPDF(filteredReports, students);
              toast.success('Exported to PDF.');
            }}
            className="text-xs gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-rose-600" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by report title, student name, or activity description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Student Filter */}
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((st) => (
                  <SelectItem key={st.id} value={st.id}>
                    {st.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Review Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Review Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Reports Grid */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-sm">
              No task reports match the selected filters.
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const studentObj = students.find((s) => s.id === report.studentId);
            return (
              <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {studentObj?.name} ({studentObj?.registrationNo})
                      </span>
                      <span className="text-xs text-muted-foreground">• Date: {report.date}</span>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {report.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">• {report.hoursSpent} Hours</span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">{report.title}</CardTitle>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {report.status === 'Approved' && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1 py-1 px-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Approved ({report.rating}%)
                      </Badge>
                    )}
                    {report.status === 'Pending' && (
                      <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 gap-1 py-1 px-3">
                        <Clock className="h-4 w-4 text-amber-600" />
                        Pending Review
                      </Badge>
                    )}
                    {report.status === 'Needs Revision' && (
                      <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30 gap-1 py-1 px-3">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        Needs Revision
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      onClick={() => openReviewModal(report)}
                      className={
                        report.status === 'Pending'
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs'
                          : 'variant-outline text-xs'
                      }
                    >
                      {report.status === 'Pending' ? 'Evaluate & Grade' : 'Update Review'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingReport(report)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Activity Details */}
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Submitted Activities
                    </h5>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                      {report.description}
                    </p>
                  </div>

                  {/* Learnings */}
                  <div className="p-3 rounded-lg border border-border/50 bg-muted/20 text-xs">
                    <span className="font-semibold text-primary block mb-1">Key Technical Learnings:</span>
                    <p className="text-muted-foreground">{report.learnings}</p>
                  </div>

                  {/* Existing Supervisor Remarks */}
                  {report.feedback && (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-amber-600" />
                          Supervisor Evaluation ({report.supervisorName || activeSupervisor.name})
                        </span>
                        {report.rating && (
                          <span className="font-bold text-amber-800">Score: {report.rating}/100</span>
                        )}
                      </div>
                      <p className="text-amber-900 italic">"{report.feedback}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Review Modal Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Evaluate Task Report
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleReviewSubmit} className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                <p className="font-bold text-foreground">{selectedReport.title}</p>
                <p className="text-muted-foreground">
                  Submitted by {students.find((s) => s.id === selectedReport.studentId)?.name} on {selectedReport.date} ({selectedReport.hoursSpent} hrs)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="revStatus">Approval Status</Label>
                  <Select value={reviewStatus} onValueChange={(val) => setReviewStatus(val as ReportStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="revRating">Assessment Grade (0 - 100%)</Label>
                  <Input
                    id="revRating"
                    type="number"
                    min="0"
                    max="100"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="revFeedback">Supervisor Feedback & Guidance Remarks</Label>
                <Textarea
                  id="revFeedback"
                  rows={4}
                  placeholder="Provide comments, praise, or specific areas of technical improvement..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                  Save Evaluation & Grade
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingReport && (
        <Dialog open={!!deletingReport} onOpenChange={(open) => !open && setDeletingReport(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Task Report
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground space-y-2">
              <p>
                Are you sure you want to delete "<strong className="text-foreground">{deletingReport.title}</strong>"
                submitted by {students.find((s) => s.id === deletingReport.studentId)?.name || 'this student'} on {deletingReport.date}?
              </p>
              <p className="text-[11px] text-rose-600/80">This will permanently remove the logbook entry, including any grading and feedback.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDeletingReport(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleDeleteConfirm} className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
