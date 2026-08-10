import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, TaskReport } from '@/types';

const REPORT_HEADERS = [
  'Student Name',
  'Registration No',
  'Date',
  'Title',
  'Category',
  'Hours Spent',
  'Status',
  'Rating',
  'Supervisor',
  'Feedback',
];

const buildReportRows = (reports: TaskReport[], students: Student[]) =>
  reports.map((r) => {
    const student = students.find((s) => s.id === r.studentId);
    return {
      'Student Name': student?.name || 'Unknown',
      'Registration No': student?.registrationNo || '',
      Date: r.date,
      Title: r.title,
      Category: r.category,
      'Hours Spent': r.hoursSpent,
      Status: r.status,
      Rating: r.rating ?? '',
      Supervisor: r.supervisorName || '',
      Feedback: r.feedback || '',
    };
  });

const timestamp = () => new Date().toISOString().split('T')[0];

export const exportTaskReportsToExcel = (
  reports: TaskReport[],
  students: Student[],
  fileName = 'task-reports'
) => {
  const rows = buildReportRows(reports, students);
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: REPORT_HEADERS });
  worksheet['!cols'] = [
    { wch: 24 },
    { wch: 14 },
    { wch: 12 },
    { wch: 34 },
    { wch: 22 },
    { wch: 10 },
    { wch: 14 },
    { wch: 8 },
    { wch: 20 },
    { wch: 45 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Task Reports');
  XLSX.writeFile(workbook, `${fileName}-${timestamp()}.xlsx`);
};

export const exportTaskReportsToPDF = (
  reports: TaskReport[],
  students: Student[],
  fileName = 'task-reports'
) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(14);
  doc.setTextColor(20);
  doc.text('AttachTrack — Task Report Logbook Export', 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleString()} • ${reports.length} report(s)`, 14, 21);

  const rows = buildReportRows(reports, students);

  autoTable(doc, {
    startY: 26,
    head: [REPORT_HEADERS],
    body: rows.map((r) => REPORT_HEADERS.map((h) => String(r[h as keyof typeof r] ?? ''))),
    styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [15, 92, 138], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      3: { cellWidth: 45 },
      9: { cellWidth: 50 },
    },
    margin: { left: 10, right: 10 },
  });

  doc.save(`${fileName}-${timestamp()}.pdf`);
};
