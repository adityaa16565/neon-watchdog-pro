import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Menu, 
  Zap, 
  Settings2, 
  ShieldAlert, 
  History, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  ShieldCheck,
  Cpu,
  Workflow,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  executions: number;
}

const initialPlaybooks: Playbook[] = [
  {
    id: "PB-001",
    name: "Critical Exfiltration Lockout",
    description: "Automatically isolates users and revokes access when SVM detects high-risk data movement.",
    trigger: "Risk Score > 90 (SVM)",
    action: "Isolate Network + Revoke Tokens",
    status: "active",
    executions: 12,
  },
  {
    id: "PB-002",
    name: "Off-Hours Login Verification",
    description: "Forces MFA and alerts SOC for any administrative login between 11PM and 5AM.",
    trigger: "Admin Login (11PM-5AM)",
    action: "Force MFA + Notify SOC",
    status: "active",
    executions: 4,
  },
  {
    id: "PB-003",
    name: "Suspicious Privilege Escalation",
    description: "Locks accounts when Sequential Pattern Mining identifies unauthorized permission changes.",
    trigger: "Pattern Deviation > 0.85",
    action: "Lock Account",
    status: "paused",
    executions: 0,
  },
];

const SOARAutomation = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(() => {
    const saved = localStorage.getItem("neon_playbooks");
    return saved ? JSON.parse(saved) : initialPlaybooks;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPlaybook, setNewPlaybook] = useState({
    name: "",
    description: "",
    trigger: "",
    action: ""
  });

  useEffect(() => {
    localStorage.setItem("neon_playbooks", JSON.stringify(playbooks));
  }, [playbooks]);

  const toggleStatus = (id: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p
    ));
  };

  const handleOpenEdit = (pb: Playbook) => {
    setEditingId(pb.id);
    setNewPlaybook({
      name: pb.name,
      description: pb.description,
      trigger: pb.trigger,
      action: pb.action
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPlaybooks(prev => prev.filter(p => p.id !== id));
  };

  const handleSavePlaybook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPlaybooks(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...newPlaybook } : p
      ));
    } else {
      const id = `PB-00${playbooks.length + 1}`;
      const playbook: Playbook = {
        ...newPlaybook,
        id,
        status: "active",
        executions: 0
      };
      setPlaybooks(prev => [playbook, ...prev]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setNewPlaybook({ name: "", description: "", trigger: "", action: "" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center justify-between border-b border-border px-4 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
          <div className="h-5 w-px bg-border" />
          <span className="text-xs mono-text text-muted-foreground uppercase tracking-widest">Security Orchestration / Automation</span>
        </div>
        <Button size="sm" className="h-8 gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Create Playbook
        </Button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto grid-bg">
        {/* Hero Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Workflow className="w-6 h-6 text-primary" /> SOAR Automation Control
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Configure automated incident response workflows and playbooks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-panel px-4 py-2 flex items-center gap-2 border-l-4 border-primary">
              <Zap className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-bold">Active Defenses</span>
                <span className="text-sm font-bold text-foreground">8 Workflow(s)</span>
              </div>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 border-l-4 border-neon-green">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-bold">Health Status</span>
                <span className="text-sm font-bold text-foreground">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {playbooks.map((pb, i) => (
              <motion.div
                key={pb.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel p-5 space-y-4 border-t-2 ${pb.status === 'active' ? 'border-t-primary' : 'border-t-muted'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${pb.status === 'active' ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Cpu className={`w-4 h-4 ${pb.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-[10px] mono-text text-muted-foreground">{pb.id}</span>
                  </div>
                  <Switch 
                    checked={pb.status === 'active'} 
                    onCheckedChange={() => toggleStatus(pb.id)}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{pb.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
                    {pb.description}
                  </p>
                </div>

                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Trigger Condition</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">{pb.trigger}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Automated Action</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-neon-red/30 text-neon-red">{pb.action}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <History className="w-3 h-3" />
                    <span>{pb.executions} executions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEdit(pb)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(pb.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* New Playbook Card */}
          <motion.button
            whileHover={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-all bg-transparent group"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Add New Playbook</p>
              <p className="text-[11px]">Define a custom response workflow</p>
            </div>
          </motion.button>
        </div>

        {/* Performance tabs removed as per request */}
      </main>

      {/* Create Playbook Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{editingId ? 'Update Playbook' : 'New Security Playbook'}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{editingId ? 'Modify Workflow' : 'Automation Architect'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSavePlaybook} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Playbook Name</label>
                  <input
                    required
                    value={newPlaybook.name}
                    onChange={(e) => setNewPlaybook({...newPlaybook, name: e.target.value})}
                    placeholder="e.g., Ransomware Response Pipeline"
                    className="w-full h-10 bg-muted/50 border border-border rounded-lg px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Description</label>
                  <textarea
                    required
                    value={newPlaybook.description}
                    onChange={(e) => setNewPlaybook({...newPlaybook, description: e.target.value})}
                    placeholder="Describe the objective of this automation..."
                    className="w-full h-24 bg-muted/50 border border-border rounded-lg p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Trigger Condition</label>
                    <input
                      required
                      value={newPlaybook.trigger}
                      onChange={(e) => setNewPlaybook({...newPlaybook, trigger: e.target.value})}
                      placeholder="e.g., Risk > 85"
                      className="w-full h-10 bg-muted/50 border border-border rounded-lg px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Automated Action</label>
                    <input
                      required
                      value={newPlaybook.action}
                      onChange={(e) => setNewPlaybook({...newPlaybook, action: e.target.value})}
                      placeholder="e.g., Lock Device"
                      className="w-full h-10 bg-muted/50 border border-border rounded-lg px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neon-red/50"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    {editingId ? <Settings2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? 'Update Playbook' : 'Deploy Playbook'}
                  </Button>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    By deploying this playbook, you authorize the system to take autonomous actions based on the defined triggers.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOARAutomation;
