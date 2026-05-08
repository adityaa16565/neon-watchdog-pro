import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Users, Search, Plus, MoreVertical, Pencil, Trash2, Eye, Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type UserRole = "Admin" | "Analyst" | "Viewer" | "Manager";
type UserStatus = "Active" | "Suspended" | "Inactive";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  dept: string;
  role: UserRole;
  status: UserStatus;
  risk: number;
  peerGroup: string;
  devices: number;
  flags: number;
  lastActive: string;
  permissions: string[];
}

const initialUsers: UserRecord[] = [];

const riskColor = (r: number) => r >= 85 ? "text-destructive" : r >= 65 ? "text-accent" : "text-primary";

const statusBadge = (s: UserStatus) => {
  switch (s) {
    case "Active": return "bg-neon-green/15 text-neon-green border-neon-green/30";
    case "Suspended": return "bg-destructive/15 text-destructive border-destructive/30";
    case "Inactive": return "bg-muted text-muted-foreground border-border";
  }
};

const roleBadge = (r: UserRole) => {
  switch (r) {
    case "Admin": return "bg-primary/15 text-primary border-primary/30";
    case "Analyst": return "bg-accent/15 text-accent border-accent/30";
    case "Manager": return "bg-neon-green/15 text-neon-green border-neon-green/30";
    case "Viewer": return "bg-muted text-muted-foreground border-border";
  }
};

const emptyUser: Omit<UserRecord, "id"> = {
  name: "", email: "", dept: "", role: "Viewer", status: "Active", risk: 0, peerGroup: "", devices: 0, flags: 0, lastActive: "Just now", permissions: ["read"],
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [formData, setFormData] = useState<Omit<UserRecord, "id">>(emptyUser);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setDbError(null);
        
        const { data, error } = await supabase
          .from('employee_records')
          .select('*');
        
        if (error) {
          setDbError(`Supabase Error: ${error.message} (${error.code})`);
        } else if (!data || data.length === 0) {
          setDbError("Table 'employee_records' is connected but has 0 records.");
        } else {
          const mappedUsers: UserRecord[] = data.map((p, index) => ({
            id: p.id ? p.id.toString().slice(0, 8) : `dummy-${index}`,
            name: p.name || 'No Name',
            email: p.email || 'No Email',
            dept: p.dept || 'General',
            role: (p.role as UserRole) || 'Analyst',
            status: (p.status as UserStatus) || 'Active',
            risk: p.risk || 0,
            peerGroup: p.peer_group || 'N/A',
            devices: p.devices || 0,
            flags: p.flags || 0,
            lastActive: 'Online',
            permissions: p.permissions || ['read']
          }));
          setUsers(mappedUsers);
        }
      } catch (err: any) {
        setDbError(`Critical Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };





    fetchUsers();
  }, []);

  const departments = [...new Set(users.map(u => u.dept))];

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || u.dept === filterDept;
    return matchSearch && matchDept;
  });

  const openAdd = () => {
    setIsNew(true);
    setFormData(emptyUser);
    setEditDialogOpen(true);
  };

  const openEdit = (u: UserRecord) => {
    setIsNew(false);
    setSelectedUser(u);
    setFormData({ name: u.name, email: u.email, dept: u.dept, role: u.role, status: u.status, risk: u.risk, peerGroup: u.peerGroup, devices: u.devices, flags: u.flags, lastActive: u.lastActive, permissions: u.permissions });
    setEditDialogOpen(true);
  };

  const openDelete = (u: UserRecord) => {
    setSelectedUser(u);
    setDeleteDialogOpen(true);
  };

  const openDetail = (u: UserRecord) => {
    setSelectedUser(u);
    setDetailOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Validation Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      if (isNew) {
        // Safe ID generation
        const tempId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
        
        const { error } = await supabase
          .from('employee_records')
          .insert([{
            id: tempId,
            name: formData.name,
            email: formData.email,
            dept: formData.dept || 'General',
            role: formData.role || 'Analyst',
            status: formData.status || 'Active',
            risk: Number(formData.risk) || 0,
            peer_group: formData.peerGroup || 'N/A',
            devices: Number(formData.devices) || 0,
            flags: Number(formData.flags) || 0,
            permissions: formData.permissions || ['read']
          }]);

        if (error) throw error;
        toast({ title: "User Created", description: `${formData.name} added to Database.` });
      } else if (selectedUser) {
        const { error } = await supabase
          .from('employee_records')
          .update({
            name: formData.name,
            email: formData.email,
            dept: formData.dept,
            role: formData.role,
            status: formData.status,
            risk: Number(formData.risk),
            peer_group: formData.peerGroup,
            devices: Number(formData.devices),
            flags: Number(formData.flags)
          })
          .eq('id', selectedUser.id);

        if (error) throw error;
        toast({ title: "User Updated", description: `${formData.name} updated successfully.` });
      }
      
      // Auto-refresh to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Save Error:", error);
      toast({ title: "Save Failed", description: error.message || "Database rejected the entry", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast({ title: "User Removed", description: `${selectedUser.name} has been deleted.` });
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground">USER MANAGEMENT & SECURITY</span>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="h-9 w-[150px] text-xs bg-muted/50">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add User
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: users.length, color: "text-primary" },
            { label: "Active", value: users.filter(u => u.status === "Active").length, color: "text-neon-green" },
            { label: "Suspended", value: users.filter(u => u.status === "Suspended").length, color: "text-destructive" },
            { label: "High Risk", value: users.filter(u => u.risk >= 85).length, color: "text-accent" },
          ].map(s => (
            <div key={s.label} className="glass-panel p-3 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <span className={`text-xl font-bold mono-text ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Risk</th>
                <th className="text-left p-3">Last Active</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-[10px] mono-text text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{u.dept}</td>
                    <td className="p-3">
                      <span className={`text-[10px] mono-text px-2 py-0.5 rounded border ${roleBadge(u.role)}`}>{u.role}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] mono-text px-2 py-0.5 rounded border ${statusBadge(u.status)}`}>{u.status}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-sm font-bold mono-text ${riskColor(u.risk)}`}>{u.risk}</span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{u.lastActive}</td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetail(u)}>
                            <Eye className="w-3.5 h-3.5 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(u)}>
                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(u)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No users found.</div>
          )}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              {isNew ? "Add New User" : "Edit User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input className="h-8 text-xs" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input className="h-8 text-xs" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Department</Label>
                <Input className="h-8 text-xs" value={formData.dept} onChange={e => setFormData(f => ({ ...f, dept: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Peer Group</Label>
                <Input className="h-8 text-xs" value={formData.peerGroup} onChange={e => setFormData(f => ({ ...f, peerGroup: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData(f => ({ ...f, role: v as UserRole }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Admin", "Analyst", "Manager", "Viewer"] as UserRole[]).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData(f => ({ ...f, status: v as UserStatus }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Active", "Suspended", "Inactive"] as UserStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{isNew ? "Create User" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm text-destructive flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Are you sure you want to remove <span className="text-foreground font-medium">{selectedUser?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Drawer */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-[400px] sm:w-[440px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> User Profile
            </SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-4 space-y-5">
              {/* Header */}
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{selectedUser.name}</h3>
                    <p className="text-xs text-muted-foreground mono-text">{selectedUser.email}</p>
                  </div>
                  <span className={`text-2xl font-bold mono-text ${riskColor(selectedUser.risk)}`}>{selectedUser.risk}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`text-[10px] mono-text px-2 py-0.5 rounded border ${roleBadge(selectedUser.role)}`}>{selectedUser.role}</span>
                  <span className={`text-[10px] mono-text px-2 py-0.5 rounded border ${statusBadge(selectedUser.status)}`}>{selectedUser.status}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ID", value: selectedUser.id },
                  { label: "Department", value: selectedUser.dept },
                  { label: "Peer Group", value: selectedUser.peerGroup },
                  { label: "Devices", value: selectedUser.devices },
                  { label: "Active Flags", value: selectedUser.flags },
                  { label: "Last Active", value: selectedUser.lastActive },
                ].map(item => (
                  <div key={item.label} className="glass-panel p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</span>
                    <p className="text-sm font-medium text-foreground mono-text">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.permissions.map(p => (
                    <Badge key={p} variant="outline" className="text-[10px] mono-text">{p}</Badge>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent Activity</span>
                <div className="space-y-2">
                  {[
                    { time: "2 min ago", event: "File download: Q4_financials.xlsx", severity: "high" },
                    { time: "15 min ago", event: "VPN connection from new IP", severity: "medium" },
                    { time: "1 hr ago", event: "Login from authorized device", severity: "low" },
                    { time: "3 hr ago", event: "Access to restricted folder", severity: "high" },
                  ].map((a, i) => (
                    <div key={i} className="glass-panel p-2.5 flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        a.severity === "high" ? "bg-destructive" : a.severity === "medium" ? "bg-accent" : "bg-neon-green"
                      }`} />
                      <div>
                        <p className="text-xs text-foreground">{a.event}</p>
                        <p className="text-[10px] text-muted-foreground mono-text">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setDetailOpen(false); openEdit(selectedUser); }}>
                  <Pencil className="w-3 h-3 mr-1.5" /> Edit
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 text-xs" onClick={() => { setDetailOpen(false); openDelete(selectedUser); }}>
                  <Trash2 className="w-3 h-3 mr-1.5" /> Remove
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserManagement;
