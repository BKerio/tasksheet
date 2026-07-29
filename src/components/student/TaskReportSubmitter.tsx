import React, { useState } from 'react';
import { Student, TaskReport, TaskCategory } from '@/types';
import { addTaskReport } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { FileCheck, Plus, CheckCircle2, Clock, AlertCircle, Award, MessageSquare, BookOpen, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TaskReportSubmitterProps {
  student: Student;
  taskReports: TaskReport[];
  onReportSubmitted: () => void;
}

export const TaskReportSubmitter: React.FC<TaskReportSubmitterProps> = ({
  student,
  taskReports,
  onReportSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Software Development');
  const [hoursSpent, setHoursSpent] = useState<number>(7.5);
  const [description, setDescription] = useState('');
  const [learnings, setLearnings] = useState('');
  const [challenges, setChallenges] = useState('');

  const studentReports = taskReports.filter((r) => r.studentId === student.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !learnings) {
      toast.error('Please complete all required fields.');
      return;
    }

    addTaskReport({
      studentId: student.id,
      date,
      title,
      category,
      hoursSpent,
      description,
      learnings,
      challenges,
    });

    toast.success('Daily task report submitted for supervisor review!');
    setIsOpen(false);
    // Reset Form
    setTitle('');
    setDescription('');
    setLearnings('');
    setChallenges('');
    onReportSubmitted();
  };

  const filteredReports = studentReports.filter((report) => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            Daily Task Logbook & Reporting
          </h2>
          <p className="text-sm text-muted-foreground">
            Submit daily technical activities, hours logged, and learning outcomes for evaluation.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold shadow">
              <Plus className="h-4 w-4" />
              Submit Daily Logbook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                New Attachment Task Report
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="repDate">Date</Label>
                  <Input
                    id="repDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Task Category</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val as TaskCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="System Maintenance">System Maintenance</SelectItem>
                      <SelectItem value="Database Management">Database Management</SelectItem>
                      <SelectItem value="Documentation & Testing">Documentation & Testing</SelectItem>
                      <SelectItem value="IT Support & Networking">IT Support & Networking</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Task Title / Summary</Label>
                <Input
                  id="title"
                  placeholder="e.g. Implemented Database Schema & User Roles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hoursSpent">Hours Spent</Label>
                <Input
                  id="hoursSpent"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="16"
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Detailed Activities & Tasks Performed</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Describe the exact tasks, scripts, codebase modifications or support provided..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="learnings">Key Technical Learnings & Skills Gained</Label>
                <Textarea
                  id="learnings"
                  rows={2}
                  placeholder="What key skills or concepts did you learn or apply today?"
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="challenges">Challenges Encountered & Solutions (Optional)</Label>
                <Textarea
                  id="challenges"
                  rows={2}
                  placeholder="Describe any technical blockers or issue resolution steps..."
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  Submit Logbook Entry
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
              placeholder="Search reports by title, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Review Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending Review</SelectItem>
                <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-sm">
              No matching logbook reports found.
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">{report.date}</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {report.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">• {report.hoursSpent} Hours</span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">{report.title}</CardTitle>
                </div>

                {/* Status Badges */}
                <div className="shrink-0">
                  {report.status === 'Approved' && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1 py-1 px-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Approved ({report.rating}%)
                    </Badge>
                  )}
                  {report.status === 'Pending' && (
                    <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 gap-1 py-1 px-3">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Pending Supervisor Review
                    </Badge>
                  )}
                  {report.status === 'Needs Revision' && (
                    <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 border-rose-500/30 gap-1 py-1 px-3">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      Needs Revision
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Tasks & Activities
                  </h5>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                    {report.description}
                  </p>
                </div>

                {/* Learnings & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border/50 text-xs">
                  <div>
                    <span className="font-semibold text-primary block mb-1 flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Key Technical Learnings
                    </span>
                    <p className="text-muted-foreground">{report.learnings}</p>
                  </div>
                  {report.challenges && (
                    <div>
                      <span className="font-semibold text-amber-600 block mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Challenges Encountered
                      </span>
                      <p className="text-muted-foreground">{report.challenges}</p>
                    </div>
                  )}
                </div>

                {/* Supervisor Feedback Callout if present */}
                {report.feedback && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        Supervisor Remarks ({report.supervisorName || 'Industrial Supervisor'})
                      </span>
                      {report.rating && (
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          Score: {report.rating}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-800 italic">"{report.feedback}"</p>
                    {report.reviewedAt && (
                      <p className="text-[10px] text-blue-600/80 text-right">Reviewed on {report.reviewedAt}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
