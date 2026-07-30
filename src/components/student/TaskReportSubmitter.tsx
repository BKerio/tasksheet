import React, { useState } from 'react';
import { Student, TaskReport, TaskCategory } from '@/types';
import { addTaskReport } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TaskReportSubmitterProps {
  student: Student;
  taskReports: TaskReport[];
  onReportSubmitted: () => void;
}

const statusStyles: Record<string, string> = {
  Approved: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  Pending: 'border-amber-300 text-amber-700 bg-amber-50',
  'Needs Revision': 'border-rose-300 text-rose-700 bg-rose-50',
  Rejected: 'border-slate-300 text-slate-600 bg-slate-50',
};

export const TaskReportSubmitter: React.FC<TaskReportSubmitterProps> = ({
  student,
  taskReports,
  onReportSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
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
    addTaskReport({ studentId: student.id, date, title, category, hoursSpent, description, learnings, challenges });
    toast.success('Logbook entry submitted for supervisor review.');
    setIsOpen(false);
    setTitle(''); setDescription(''); setLearnings(''); setChallenges('');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground">Task Logbook</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Submit daily technical activities, hours logged, and learning outcomes for evaluation.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto">
              <Plus className="h-3.5 w-3.5" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Logbook Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="repDate">Date</Label>
                  <Input id="repDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val as TaskCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="System Maintenance">System Maintenance</SelectItem>
                      <SelectItem value="Database Management">Database Management</SelectItem>
                      <SelectItem value="Documentation & Testing">Documentation &amp; Testing</SelectItem>
                      <SelectItem value="IT Support & Networking">IT Support &amp; Networking</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="e.g. Implemented database schema and user roles" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hoursSpent">Hours Spent</Label>
                <Input id="hoursSpent" type="number" step="0.5" min="0.5" max="16" value={hoursSpent} onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Tasks &amp; Activities Performed</Label>
                <Textarea id="description" rows={3} placeholder="Describe the exact tasks, scripts, or support provided…" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="learnings">Key Technical Learnings</Label>
                <Textarea id="learnings" rows={2} placeholder="What skills or concepts did you apply today?" value={learnings} onChange={(e) => setLearnings(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="challenges">Challenges &amp; Solutions <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Textarea id="challenges" rows={2} placeholder="Describe any blockers or how you resolved them…" value={challenges} onChange={(e) => setChallenges(e.target.value)} />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="font-medium">Submit Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by title, category, or description…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Submissions" />
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

      {/* Report Cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <Card className="border-border shadow-none">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No matching logbook entries found.
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="border-border shadow-none">
              {/* Card header row */}
              <CardHeader className="px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-muted-foreground">{report.date}</span>
                    <Badge variant="outline" className="text-[10px] font-normal border-border text-foreground/70">{report.category}</Badge>
                    <span className="text-[11px] text-muted-foreground">{report.hoursSpent}h</span>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground truncate">{report.title}</CardTitle>
                </div>
                <div className="shrink-0">
                  <Badge variant="outline" className={`text-[10px] ${statusStyles[report.status] ?? ''}`}>
                    {report.status === 'Approved' && report.rating ? `Approved (${report.rating}%)` : report.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="px-4 py-4 space-y-4">
                {/* Description */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tasks &amp; Activities</p>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{report.description}</p>
                </div>

                {/* Learnings & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Key Learnings</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">{report.learnings}</p>
                  </div>
                  {report.challenges && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Challenges</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{report.challenges}</p>
                    </div>
                  )}
                </div>

                {/* Supervisor Feedback */}
                {report.feedback && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Supervisor Remarks — {report.supervisorName || 'Industrial Supervisor'}
                      </p>
                      {report.rating && (
                        <span className="text-[11px] font-semibold text-foreground">Score: {report.rating}/100</span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/80 italic">"{report.feedback}"</p>
                    {report.reviewedAt && (
                      <p className="text-[10px] text-muted-foreground mt-1">Reviewed on {report.reviewedAt}</p>
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
