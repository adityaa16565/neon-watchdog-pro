import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Plus, Play, Pause, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const playbooks = [
  {
    name: "Exfiltration Response",
    trigger: "SVM Risk Score > 85",
    actions: ["Alert SOC", "Isolate Network", "Lock Account", "Preserve Evidence"],
    status: "Active",
    executions: 12,
  },
  {
    name: "Unknown Device Lockdown",
    trigger: "Random Forest — Unknown Device",
    actions: ["Send MFA Challenge", "Alert Admin", "Lock if Failed"],
    status: "Active",
    executions: 34,
  },
  {
    name: "Privilege Escalation Block",
    trigger: "Sequential Pattern — Escalation Path",
    actions: ["Revoke Privileges", "Alert SOC", "Generate Forensic Report"],
    status: "Active",
    executions: 8,
  },
  {
    name: "Off-Hours Investigation",
    trigger: "Isolation Forest — Login Anomaly",
    actions: ["Log Event", "Send Warning Email", "Flag for Review"],
    status: "Paused",
    executions: 56,
  },
];

const SecurityPolicies = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground">SECURITY POLICY BUILDER</span>
      </header>
      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">SOAR Playbooks</h2>
          <button className="soar-btn-amber flex items-center gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> New Playbook
          </button>
        </div>

        <div className="space-y-3">
          {playbooks.map((pb, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{pb.name}</h3>
                  <p className="text-[11px] mono-text text-muted-foreground mt-0.5">Trigger: {pb.trigger}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] mono-text text-muted-foreground">{pb.executions} executions</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs mono-text ${pb.status === "Active" ? "text-primary" : "text-neon-amber"}`}>
                    <span className={`pulse-dot ${pb.status === "Active" ? "pulse-dot-cyan" : "pulse-dot-amber"}`} />
                    {pb.status}
                  </span>
                  <button className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    {pb.status === "Active" ? <Pause className="w-3.5 h-3.5 text-muted-foreground" /> : <Play className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {pb.actions.map((action, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-foreground">{action}</span>
                    {j < pb.actions.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SecurityPolicies;
