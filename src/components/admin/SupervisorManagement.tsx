import React, { useState } from 'react';
import { Supervisor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Edit3, Trash2, KeyRound, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import {
  findPrismaUserByEmail,
  addPrismaUser,
  updatePrismaUserByEmail,
  deletePrismaUserByEmail,
} from '@/lib/prismaService';

interface SupervisorManagementProps {
  supervisors: Supervisor[];
  currentUserEmail?: string;
  onSupervisorsUpdated: () => void;
}

export const SupervisorManagement: React.FC<SupervisorManagementProps> = ({
  supervisors,
  currentUserEmail,
  onSupervisorsUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [deletingSupervisor, setDeletingSupervisor] = useState<Supervisor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Information Technology');
  const [title, setTitle] = useState('Industrial Supervisor');
  const [role, setRole] = useState<'SUPERVISOR' | 'ADMIN'>('SUPERVISOR');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartment('Information Technology');
    setTitle('Industrial Supervisor');
    setRole('SUPERVISOR');
    setPassword('');
    setConfirmPassword('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEditModal = (sup: Supervisor) => {
    setEditingSupervisor(sup);
    setName(sup.name);
    setEmail(sup.email);
    setDepartment(sup.department);
    setTitle(sup.title);
    setRole(sup.role);
    setEditPassword('');
    setEditConfirmPassword('');
  };

  // CREATE (Add Supervisor)
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !department || !title) {
      toast.error('Please fill in all required supervisor details.');
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

    const stored = localStorage.getItem('taskapp_supervisors');
    const currentSupervisors: Supervisor[] = stored ? JSON.parse(stored) : [];
    const newSupervisor: Supervisor = {
      id: `sup-${Date.now()}`,
      name,
      email,
      department,
      title,
      role,
    };

    const updated = [newSupervisor, ...currentSupervisors];
    localStorage.setItem('taskapp_supervisors', JSON.stringify(updated));

    // Create the matching login account so staff can sign in right away.
    addPrismaUser({
      id: `user-${newSupervisor.id}`,
      name,
      email,
      password,
      role,
      department,
      title,
    });

    toast.success(`${role === 'ADMIN' ? 'Admin' : 'Supervisor'} ${name} added!`);
    setIsAddOpen(false);
    resetForm();
    onSupervisorsUpdated();
  };

  // UPDATE (Edit Supervisor)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupervisor) return;

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

    const stored = localStorage.getItem('taskapp_supervisors');
    const currentSupervisors: Supervisor[] = stored ? JSON.parse(stored) : [];
    const updated = currentSupervisors.map((sup) => {
      if (sup.id === editingSupervisor.id) {
        return { ...sup, name, email, department, title, role };
      }
      return sup;
    });

    localStorage.setItem('taskapp_supervisors', JSON.stringify(updated));

    // Keep the login account (matched by the pre-edit email) in sync.
    updatePrismaUserByEmail(editingSupervisor.email, {
      name,
      email,
      department,
      title,
      role,
      ...(editPassword ? { password: editPassword } : {}),
    });

    toast.success(`${role === 'ADMIN' ? 'Admin' : 'Supervisor'} record for ${name} updated.`);
    setEditingSupervisor(null);
    onSupervisorsUpdated();
  };

  // DELETE (Remove Supervisor)
  const handleDeleteConfirm = () => {
    if (!deletingSupervisor) return;

    if (currentUserEmail && deletingSupervisor.email.toLowerCase() === currentUserEmail.toLowerCase()) {
      toast.error('You cannot remove the account you are currently signed in with.');
      setDeletingSupervisor(null);
      return;
    }

    const stored = localStorage.getItem('taskapp_supervisors');
    const currentSupervisors: Supervisor[] = stored ? JSON.parse(stored) : [];
    const updated = currentSupervisors.filter((sup) => sup.id !== deletingSupervisor.id);
    localStorage.setItem('taskapp_supervisors', JSON.stringify(updated));
    deletePrismaUserByEmail(deletingSupervisor.email);

    toast.success(`${deletingSupervisor.name} removed.`);
    setDeletingSupervisor(null);
    onSupervisorsUpdated();
  };

  // READ (Filtered list)
  const filteredSupervisors = supervisors.filter((sup) => {
    const q = searchQuery.toLowerCase();
    return (
      sup.name.toLowerCase().includes(q) ||
      sup.email.toLowerCase().includes(q) ||
      sup.department.toLowerCase().includes(q) ||
      sup.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCog className="h-5 w-5 text-amber-500" />
            Supervisor & Admin Management (CRUD)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, search, and manage supervisor and coordination office staff accounts.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} className="h-9 text-xs font-semibold gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-3.5 w-3.5" />
          Add Staff Account
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-border/40 shadow-none">
        <CardContent className="p-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, department, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/30 border-border/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Supervisor List Table */}
      <Card className="border-border/40 shadow-none">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Staff Accounts ({filteredSupervisors.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {filteredSupervisors.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching staff records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Name & Email</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredSupervisors.map((sup) => (
                    <tr key={sup.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-bold text-foreground">{sup.name}</p>
                          <p className="text-[11px] text-muted-foreground">{sup.email}</p>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-foreground">
                        {sup.department}
                      </td>

                      <td className="p-3 text-muted-foreground">
                        {sup.title}
                      </td>

                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            sup.role === 'ADMIN'
                              ? 'text-[10px] border-amber-500/40 text-amber-600 bg-amber-500/10'
                              : 'text-[10px] border-primary/40 text-primary bg-primary/10'
                          }
                        >
                          {sup.role}
                        </Badge>
                      </td>

                      <td className="p-3 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(sup)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit Staff Account"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingSupervisor(sup)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                          title="Delete Staff Account"
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

      {/* CREATE SUPERVISOR DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Add Supervisor / Admin Staff Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addSupName" className="text-xs">Full Name</Label>
                <Input
                  id="addSupName"
                  placeholder="e.g. Dr. Jane Kariuki"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addSupRole" className="text-xs">Account Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as 'SUPERVISOR' | 'ADMIN')}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERVISOR" className="text-xs">Supervisor</SelectItem>
                    <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addSupEmail" className="text-xs">Work Email</Label>
              <Input
                id="addSupEmail"
                type="email"
                placeholder="jane.kariuki@university.ac.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addSupDept" className="text-xs">Department</Label>
                <Input
                  id="addSupDept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addSupTitle" className="text-xs">Title</Label>
                <Input
                  id="addSupTitle"
                  placeholder="e.g. Industrial Supervisor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addSupPassword" className="text-xs">Login Password</Label>
                <Input
                  id="addSupPassword"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addSupConfirmPassword" className="text-xs">Confirm Password</Label>
                <Input
                  id="addSupConfirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-white">
                Add Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT SUPERVISOR DIALOG */}
      {editingSupervisor && (
        <Dialog open={!!editingSupervisor} onOpenChange={(open) => !open && setEditingSupervisor(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-500" />
                Edit Staff Account
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editSupName" className="text-xs">Full Name</Label>
                  <Input
                    id="editSupName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editSupRole" className="text-xs">Account Role</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'SUPERVISOR' | 'ADMIN')}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPERVISOR" className="text-xs">Supervisor</SelectItem>
                      <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="editSupEmail" className="text-xs">Email</Label>
                <Input
                  id="editSupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editSupDept" className="text-xs">Department</Label>
                  <Input
                    id="editSupDept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editSupTitle" className="text-xs">Title</Label>
                  <Input
                    id="editSupTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="editSupPassword" className="text-xs flex items-center gap-1">
                    <KeyRound className="h-3 w-3" /> New Password
                  </Label>
                  <Input
                    id="editSupPassword"
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editSupConfirmPassword" className="text-xs">Confirm New Password</Label>
                  <Input
                    id="editSupConfirmPassword"
                    type="password"
                    placeholder="Re-enter new password"
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingSupervisor(null)} className="h-8 text-xs">
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
      {deletingSupervisor && (
        <Dialog open={!!deletingSupervisor} onOpenChange={(open) => !open && setDeletingSupervisor(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Remove Staff Account
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground space-y-2">
              <p>
                Are you sure you want to remove <strong className="text-foreground">{deletingSupervisor.name}</strong> ({deletingSupervisor.email})?
              </p>
              <p className="text-[11px] text-rose-600/80">This will delete their staff profile and login access.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDeletingSupervisor(null)} className="h-8 text-xs">
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
