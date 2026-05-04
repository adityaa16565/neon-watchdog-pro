import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Monitor, Clock, FileText, Globe, Usb, Copy, ShieldAlert, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const timeline = [
  { time: "14:32:08", action: "USB Drive Inserted", detail: "Device: SANDISK_USB_3.0 | MAC: A4:5E:60:B2:1F:3C", icon: Usb, severity: "critical" },
  { time: "14:30:15", action: "Mass File Copy", detail: "247 files copied to clipboard | Size: 842MB", icon: Copy, severity: "critical" },
  { time: "14:28:03", action: "External Upload Initiated", detail: "Destination: 185.234.72.11 | Protocol: HTTPS | 1.2GB", icon: Globe, severity: "critical" },
  { time: "14:15:22", action: "Accessed Restricted Directory", detail: "/srv/finance/Q4_reports/confidential/", icon: FileText, severity: "warning" },
  { time: "14:02:41", action: "Privilege Escalation", detail: "Role changed: Analyst → SuperAdmin via service account", icon: Monitor, severity: "critical" },
  { time: "13:45:10", action: "Anomalous Login", detail: "IP: 92.118.47.23 | Location: Bucharest, RO (unusual)", icon: Globe, severity: "warning" },
  { time: "13:30:00", action: "Session Started", detail: "Device: LAPTOP-042 | OS: Windows 11 Pro", icon: Monitor, severity: "normal" },
  { time: "09:15:33", action: "Normal Login", detail: "IP: 10.0.1.45 | Location: HQ Office, NYC", icon: Clock, severity: "normal" },
];

const EmployeeActivity = () => {
  const [userStatus, setUserStatus] = useState<"Active" | "Locked" | "Isolated">("Active");
  const [riskScore, setRiskScore] = useState(94);

  const handleLock = () => {
    setUserStatus("Locked");
    toast.error("PROTOCOL ACTIVE: Account Lock deployed.", {
      description: "User_042 access credentials have been invalidated.",
      icon: <ShieldAlert className="w-4 h-4" />
    });
  };

  const handleIsolate = () => {
    setUserStatus("Isolated");
    setRiskScore(prev => Math.max(0, prev - 10)); // Reducing risk after isolation
    toast.warning("PROTOCOL ACTIVE: Network Isolation deployed.", {
      description: "User_042 has been moved to a restricted VLAN.",
      icon: <Zap className="w-4 h-4" />
    });
  };
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground">EMPLOYEE ACTIVITY DETAIL</span>
      </header>
      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        <div className="glass-panel p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
              <span className="text-xl font-bold mono-text text-neon-red">042</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">User_042</h2>
                <span className={`text-[10px] mono-text px-1.5 py-0.5 rounded border ${
                  userStatus === 'Active' ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' :
                  userStatus === 'Locked' ? 'bg-neon-red/10 border-neon-red/30 text-neon-red' :
                  'bg-neon-amber/10 border-neon-amber/30 text-neon-amber'
                }`}>
                  {userStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Finance Dept • Senior Analyst • Peer Group: FIN-A</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <p className={`text-2xl font-bold mono-text ${riskScore > 80 ? 'neon-text-red' : 'text-primary'}`}>{riskScore}</p>
                <p className="text-[9px] text-muted-foreground uppercase">Risk Score</p>
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  disabled={userStatus === "Locked"}
                  onClick={handleLock}
                  className="soar-btn-danger text-xs py-1 disabled:opacity-50"
                >
                  {userStatus === "Locked" ? "Locked" : "Lock Account"}
                </button>
                <button 
                  disabled={userStatus === "Isolated"}
                  onClick={handleIsolate}
                  className="soar-btn-amber text-xs py-1 disabled:opacity-50"
                >
                  {userStatus === "Isolated" ? "Isolated" : "Isolate Network"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Files Accessed", value: "1,247", sub: "Last 24h" },
            { label: "Bytes Uploaded", value: "3.4 GB", sub: "External" },
            { label: "Privilege Changes", value: "3", sub: "Unauthorized" },
            { label: "Active Flags", value: "4", sub: "ML Models" },
          ].map((s, i) => (
            <div key={i} className="glass-panel p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mono-text text-foreground mt-1">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mono-text">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Timeline</h3>
          <div className="space-y-1">
            {timeline.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  event.severity === "critical" ? "bg-neon-red/5 border border-neon-red/10" :
                  event.severity === "warning" ? "bg-neon-amber/5 border border-neon-amber/10" :
                  "bg-muted/20 border border-border/50"
                }`}
              >
                <span className="text-[11px] mono-text text-muted-foreground w-16 shrink-0 pt-0.5">{event.time}</span>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  event.severity === "critical" ? "bg-neon-red/15" :
                  event.severity === "warning" ? "bg-neon-amber/15" : "bg-primary/10"
                }`}>
                  <event.icon className={`w-3.5 h-3.5 ${
                    event.severity === "critical" ? "text-neon-red" :
                    event.severity === "warning" ? "text-neon-amber" : "text-primary"
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{event.action}</p>
                  <p className="text-[11px] mono-text text-muted-foreground mt-0.5">{event.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeActivity;
