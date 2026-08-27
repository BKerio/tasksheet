import React, { useState } from 'react';
import { Student } from '@/types';
import { getStoredStudents, getStoredSupervisors } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Users, Plus, Search, Edit3, Trash2, GraduationCap, Building2, User, Mail, Calendar, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import {
  findPrismaUserByEmail,
  addPrismaUser,
  updatePrismaUserByEmail,
  deletePrismaUserByEmail,
} from '@/lib/prismaService';
import { DEPARTMENTS, resolveDepartmentOption } from '@/lib/departments';

interface StudentManagementProps {
  students: Student[];
  onStudentsUpdated: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onStudentsUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form State
  const [registrationNo, setRegistrationNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('DICT 240 – Software Project Proposal');
  const [department, setDepartment] = useState('Department of Information Technology');
  const [organization, setOrganization] = useState('');
  const [supervisorName, setSupervisorName] = useState('Dr. Sarah Wambui');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');

  const supervisors = getStoredSupervisors();

  const resetForm = () => {
    setRegistrationNo('');
    setName('');
    setEmail('');
    setOrganization('');
    setCourse('DICT 240 – Software Project Proposal');
    setDepartment('Department of Information Technology');
    setSupervisorName('Dr. Sarah Wambui');
    setPassword('');
    setConfirmPassword('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEditModal = (st: Student) => {
    setEditingStudent(st);
    setRegistrationNo(st.registrationNo);
    setName(st.name);
    setEmail(st.email);
    setCourse(st.course);
    setDepartment(st.department);
    setOrganization(st.organization);
    setSupervisorName(st.supervisorName);
    setStartDate(st.startDate);
    setEndDate(st.endDate);
    setEditPassword('');
    setEditConfirmPassword('');
  };

  // CREATE (Add Student)
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNo || !name || !email) {
      toast.error('Please fill in all required student details.');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (findPrismaUserByEmail(email)) {
      toast.error('An account with this email already exists.');
      return;
    }

    const currentStudents = getStoredStudents();
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      registrationNo,
      name,
      email,
      course,
      department,
      organization: organization || 'Tech Innovations Hub',
      supervisorName,
      startDate,
      endDate,
    };

    const updated = [newStudent, ...currentStudents];
    localStorage.setItem('taskapp_students', JSON.stringify(updated));

    // Create the matching login account so the candidate can sign in right away.
    addPrismaUser({
      id: `user-${newStudent.id}`,
      name,
      email,
      password,
      role: 'STUDENT',
      registrationNo,
      course,
      department,
      organization: newStudent.organization,
      supervisorName,
      startDate,
      endDate,
    });

    toast.success(`Student candidate ${name} (${registrationNo}) added!`);
    setIsAddOpen(false);
    resetForm();
    onStudentsUpdated();
  };

  // UPDATE (Edit Student)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (editPassword || editConfirmPassword) {
      if (editPassword.length < 6) {
        toast.error('New password must be at least 6 characters.');
        return;
      }
      if (editPassword !== editConfirmPassword) {
        toast.error('New passwords do not match.');
        return;
      }
    }

    const currentStudents = getStoredStudents();
    const updated = currentStudents.map((st) => {
      if (st.id === editingStudent.id) {
        return {
          ...st,
          registrationNo,
          name,
          email,
          course,
          department,
          organization,
          supervisorName,
          startDate,
          endDate,
        };
      }
      return st;
    });

    localStorage.setItem('taskapp_students', JSON.stringify(updated));

    // Keep the login account (matched by the pre-edit email) in sync.
    updatePrismaUserByEmail(editingStudent.email, {
      name,
      email,
      registrationNo,
      course,
      department,
      organization,
      supervisorName,
      startDate,
      endDate,
      ...(editPassword ? { password: editPassword } : {}),
    });

    toast.success(`Student record for ${name} updated.`);
    setEditingStudent(null);
    onStudentsUpdated();
  };

  // DELETE (Remove Student)
  const handleDeleteConfirm = () => {
    if (!deletingStudent) return;

    const currentStudents = getStoredStudents();
    const updated = currentStudents.filter((st) => st.id !== deletingStudent.id);
    localStorage.setItem('taskapp_students', JSON.stringify(updated));
    deletePrismaUserByEmail(deletingStudent.email);

    toast.success(`Student ${deletingStudent.name} removed.`);
    setDeletingStudent(null);
    onStudentsUpdated();
  };

  // READ (Filtered list)
  const filteredStudents = students.filter((st) => {
    const q = searchQuery.toLowerCase();
    return (
      st.name.toLowerCase().includes(q) ||
      st.registrationNo.toLowerCase().includes(q) ||
      st.email.toLowerCase().includes(q) ||
      st.organization.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Student Candidate Management (CRUD)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, search, and manage attachment student profiles for DICT 240.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} className="h-9 text-xs font-semibold gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-3.5 w-3.5" />
          Add Candidate
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-border/40 shadow-none">
        <CardContent className="p-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, registration no, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/30 border-border/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Student List Table */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Enrolled Attachment Candidates ({filteredStudents.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching student records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Registration & Candidate</th>
                    <th className="p-3">Course & Dept</th>
                    <th className="p-3">Host Company</th>
                    <th className="p-3">Assigned Supervisor</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-bold text-foreground">{st.name}</p>
                          <p className="text-[11px] text-muted-foreground">Adm: {st.registrationNo} • {st.email}</p>
                        </div>
                      </td>

                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">{st.course}</p>
                          <p className="text-[11px] text-muted-foreground">{st.department}</p>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-foreground">
                        {st.organization}
                      </td>

                      <td className="p-3 text-muted-foreground">
                        {st.supervisorName}
                      </td>

                      <td className="p-3 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(st)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit Student"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingStudent(st)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                          title="Delete Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE STUDENT DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Add Attachment Student Candidate
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addReg" className="text-xs">Registration Number</Label>
                <Input
                  id="addReg"
                  placeholder="e.g. 24-4012"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addName" className="text-xs">Full Candidate Name</Label>
                <Input
                  id="addName"
                  placeholder="e.g. Jane Njeri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addEmail" className="text-xs">Student Email</Label>
              <Input
                id="addEmail"
                type="email"
                placeholder="jane.njeri@student.university.ac.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addPassword" className="text-xs">Login Password</Label>
                <Input
                  id="addPassword"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addConfirmPassword" className="text-xs">Confirm Password</Label>
                <Input
                  id="addConfirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addCourse" className="text-xs">Course</Label>
                <Input
                  id="addCourse"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addDept" className="text-xs">Department</Label>
                <Select
                  value={resolveDepartmentOption(department)}
                  onValueChange={(val) => setDepartment(val === 'Other' ? '' : val)}
                >
                  <SelectTrigger id="addDept" className="h-8 text-xs">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">
                        {d}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other" className="text-xs">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {resolveDepartmentOption(department) === 'Other' && (
                  <Input
                    placeholder="Enter department name"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-8 text-xs mt-1.5"
                    required
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addOrg" className="text-xs">Host Organization / Company</Label>
                <Input
                  id="addOrg"
                  placeholder="e.g. Safaricom Hub"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addSup" className="text-xs">Assigned Supervisor</Label>
                <Select value={supervisorName} onValueChange={setSupervisorName}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map((s) => (
                      <SelectItem key={s.id} value={s.name} className="text-xs">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-white">
                Add Candidate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT DIALOG */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-500" />
                Edit Student Profile
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editReg" className="text-xs">Registration Number</Label>
                  <Input
                    id="editReg"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editName" className="text-xs">Full Name</Label>
                  <Input
                    id="editName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="editEmail" className="text-xs">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editCourse" className="text-xs">Course</Label>
                  <Input
                    id="editCourse"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editDept" className="text-xs">Department</Label>
                  <Select
                    value={resolveDepartmentOption(department)}
                    onValueChange={(val) => setDepartment(val === 'Other' ? '' : val)}
                  >
                    <SelectTrigger id="editDept" className="h-8 text-xs">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d} className="text-xs">
                          {d}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other" className="text-xs">Other (specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  {resolveDepartmentOption(department) === 'Other' && (
                    <Input
                      placeholder="Enter department name"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-8 text-xs mt-1.5"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editPassword" className="text-xs flex items-center gap-1">
                    <KeyRound className="h-3 w-3" /> New Password
                  </Label>
                  <Input
                    id="editPassword"
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editConfirmPassword" className="text-xs">Confirm New Password</Label>
                  <Input
                    id="editConfirmPassword"
                    type="password"
                    placeholder="Re-enter new password"
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editOrg" className="text-xs">Host Company</Label>
                  <Input
                    id="editOrg"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editSup" className="text-xs">Supervisor</Label>
                  <Select value={supervisorName} onValueChange={setSupervisorName}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((s) => (
                        <SelectItem key={s.id} value={s.name} className="text-xs">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingStudent(null)} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingStudent && (
        <Dialog open={!!deletingStudent} onOpenChange={(open) => !open && setDeletingStudent(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Remove Student Candidate
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground space-y-2">
              <p>
                Are you sure you want to remove <strong className="text-foreground">{deletingStudent.name}</strong> ({deletingStudent.registrationNo})?
              </p>
              <p className="text-[11px] text-rose-600/80">This action will remove their profile record from the system roster.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDeletingStudent(null)} className="h-8 text-xs">
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
