import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Database, GitBranch, ArrowRight, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SystemDocumentation: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Card */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <Badge className="bg-amber-500 text-slate-950 font-bold border-none">
              DICT 240 – Software Project Proposal
            </Badge>
            <span className="text-xs text-amber-200">Adm: 24-3769</span>
          </div>
          <CardTitle className="text-xl font-bold mt-2">
            Student Attachment Attendance and Task Reporting System
          </CardTitle>
          <CardDescription className="text-indigo-200 text-xs">
            Software Project Documentation & Architectural Diagrams by Ian Kipkorir Metto
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-primary" />
              Problem Statement
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/60">
              During industrial attachment, student attendance and daily task reporting were traditionally conducted manually using physical attendance books and handwritten logbooks. Students were required to sign in every day and record activities on paper. This method often led to problems such as missing or inaccurate records, damaged or lost logbooks, and delays in supervisors reviewing student work. In some cases, supervisors found it difficult to track student progress because records were scattered and unorganized.
              <br /><br />
              To resolve this challenge, this web-based system automates student attendance logging and daily task reporting while providing supervisors real-time access to monitor progress, evaluate logbooks, and provide feedback efficiently.
            </p>
          </div>

          {/* Project Objectives */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              System Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border/60 bg-card">
                <span className="font-bold text-primary block mb-1">I. System Development</span>
                <p className="text-muted-foreground">Design and develop a web-based system for managing student attachment attendance and task reporting.</p>
              </div>
              <div className="p-3 rounded-lg border border-border/60 bg-card">
                <span className="font-bold text-primary block mb-1">II. Process Automation</span>
                <p className="text-muted-foreground">Automate the process of recording daily student attendance and technical activities.</p>
              </div>
              <div className="p-3 rounded-lg border border-border/60 bg-card">
                <span className="font-bold text-primary block mb-1">III. Supervisor Monitoring</span>
                <p className="text-muted-foreground">Enable supervisors to monitor student progress and provide grade feedback through the system.</p>
              </div>
              <div className="p-3 rounded-lg border border-border/60 bg-card">
                <span className="font-bold text-primary block mb-1">IV. Data Security & Accessibility</span>
                <p className="text-muted-foreground">Improve accuracy, security, and accessibility of student attachment records.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Diagram (DFD) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-600" />
            Data Flow Diagram (DFD Level 1)
          </CardTitle>
          <CardDescription className="text-xs">
            Illustrates information flow between Students, System Processes, Database Stores, and Supervisors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 text-xs">
            {/* Visual DFD Flow Representation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 font-semibold text-blue-900 flex flex-col justify-center items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-600" />
                <span>Student Entity</span>
                <span className="text-[10px] font-normal text-blue-700">Submits Attendance & Daily Tasks</span>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 font-semibold text-indigo-900 flex flex-col justify-center items-center gap-2">
                <GitBranch className="h-6 w-6 text-indigo-600" />
                <span>1.0 & 2.0 Processes</span>
                <span className="text-[10px] font-normal text-indigo-700">Record Attendance / Validate Data</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 font-semibold text-emerald-900 flex flex-col justify-center items-center gap-2">
                <Database className="h-6 w-6 text-emerald-600" />
                <span>Database Store</span>
                <span className="text-[10px] font-normal text-emerald-700">Attendance & Task Tables</span>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 font-semibold text-amber-900 flex flex-col justify-center items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
                <span>Supervisor Entity</span>
                <span className="text-[10px] font-normal text-amber-700">Reviews Logbooks & Evaluates</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Relationship Diagram (ERD) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            Entity Relationship Diagram (ERD Schema)
          </CardTitle>
          <CardDescription className="text-xs">
            Main relational database entities and foreign key mappings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Student Entity */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-primary">Student</span>
                <Badge variant="outline" className="text-[9px]">Entity</Badge>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className="font-bold text-foreground">Student_ID (PK)</li>
                <li>Registration_No</li>
                <li>Name</li>
                <li>Course</li>
                <li>Department</li>
              </ul>
            </div>

            {/* Attendance Entity */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-emerald-600">Attendance</span>
                <Badge variant="outline" className="text-[9px]">Entity</Badge>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className="font-bold text-foreground">Attendance_ID (PK)</li>
                <li>Date</li>
                <li>Status</li>
                <li>WorkMode</li>
                <li className="text-indigo-600">Student_ID (FK)</li>
              </ul>
            </div>

            {/* Task_Report Entity */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-amber-600">Task_Report</span>
                <Badge variant="outline" className="text-[9px]">Entity</Badge>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className="font-bold text-foreground">Task_Report_ID (PK)</li>
                <li>Date & Title</li>
                <li>Description & Category</li>
                <li>Status & Rating</li>
                <li className="text-indigo-600">Student_ID (FK)</li>
                <li className="text-indigo-600">Supervisor_ID (FK)</li>
              </ul>
            </div>

            {/* Supervisor Entity */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-indigo-600">Supervisor</span>
                <Badge variant="outline" className="text-[9px]">Entity</Badge>
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className="font-bold text-foreground">Supervisor_ID (PK)</li>
                <li>Name</li>
                <li>Department</li>
                <li>Title / Role</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
