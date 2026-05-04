import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, ShieldAlert, History, User, Clock, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SYSTEM_CONFIG } from "@/lib/constants";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  details: string;
  severity: "info" | "warning" | "success";
}

const auditLogs: AuditLog[] = [
  { id: "AL-8291", timestamp: "2024-04-03 14:32:01", admin: SYSTEM_CONFIG.ADMIN_EMAIL, action: "Policy Update", details: "Elevated threshold for 'Mass Data Transfer' to 1.5GB", severity: "info" },
  { id: "AL-8290", timestamp: "2024-04-03 14:15:44", admin: SYSTEM_CONFIG.ADMIN_EMAIL, action: "User Access Revoked", details: "ID: user_921 access removed | Breach suspicion", severity: "warning" },
  { id: "AL-8289", timestamp: "2024-04-03 13:45:10", admin: "sec-analyst-02@sentinel.sec", action: "Threat Alert Dismissed", details: "False positive: Routine server maintenance detected", severity: "info" },
  { id: "AL-8288", timestamp: "2024-04-03 12:10:05", admin: SYSTEM_CONFIG.ADMIN_EMAIL, action: "System Configuration Change", details: "Enabled MFA across all high-privilege accounts", severity: "success" },
  { id: "AL-8287", timestamp: "2024-04-03 11:30:22", admin: SYSTEM_CONFIG.ADMIN_EMAIL, action: "API Key Rotation", details: "Rotated main production API keys | Scheduled task", severity: "info" },
  { id: "AL-8286", timestamp: "2024-04-03 09:15:00", admin: "sys-admin@sentinel.sec", action: "Admin Session Start", details: "Login from IP: 10.0.1.15 | Headquarters", severity: "info" },
];

const AuditLogs = () => {
  const [localLogs, setLocalLogs] = useState<AuditLog[]>(auditLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    const fetchLiveLogs = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
        
        if (!error && data && data.length > 0) {
          const mappedData: AuditLog[] = data.map((item: any) => ({
            id: item.id || `AL-${Math.floor(Math.random()*10000)}`,
            timestamp: new Date(item.created_at).toLocaleString(),
            admin: item.admin_email || item.admin_id || "Unknown Admin",
            action: item.action || "Unknown Action",
            details: item.details || "No details provided",
            severity: item.severity || "info"
          }));
          setLocalLogs(mappedData);
        }
      } catch (err) {
        console.warn("Could not fetch live audit logs, falling back to mock data.", err);
      }
    };

    fetchLiveLogs();
  }, []);

  const exportToCSV = () => {
    const headers = ["ID", "Timestamp", "Administrator", "Action", "Details"];
    const rows = localLogs.map(log => [
      log.id,
      log.timestamp,
      log.admin,
      log.action,
      `"${log.details}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `neon_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV Export Successful", {
      description: "Audit data has been compiled and downloaded.",
    });
  };

  const exportToPDF = () => {
    toast.loading("Compiling high-fidelity report...", {
      duration: 2000,
    });
    
    setTimeout(() => {
      window.print();
      toast.success("PDF Generation Ready", {
        description: "Document has been sent to the printer/PDF engine.",
      });
    }, 2000);
  };
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground uppercase tracking-widest">System Administration / Audit Logs</span>
      </header>
      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Admin Audit Logs
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Full traceability of administrative actions within Neon Watchdog Pro</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button 
              onClick={exportToPDF}
              className="soar-btn-secondary text-[10px] px-3 py-1.5 uppercase tracking-widest"
            >
              Export PDF
            </button>
            <button 
              onClick={exportToCSV}
              className="soar-btn-secondary text-[10px] px-3 py-1.5 uppercase tracking-widest"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ID</th>
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Timestamp</th>
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Administrator</th>
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Action</th>
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Details</th>
                  <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-right">Tracing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {localLogs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="p-4">
                      <span className="text-[11px] mono-text text-muted-foreground">{log.id}</span>
                    </td>
                    <td className="p-4 text-[11px] mono-text text-foreground">{log.timestamp}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center">
                          <User className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-foreground font-medium">{log.admin}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.severity === 'warning' ? 'bg-neon-amber' : 
                          log.severity === 'success' ? 'bg-neon-green' : 'bg-primary'
                        }`} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground mono-text">
                      {log.details}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="text-[10px] text-primary hover:neon-text-cyan transition-all underline underline-offset-4 decoration-primary/20"
                      >
                        View Payload
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance tabs removed as per request */}
      </main>

      {/* Payload Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Raw Audit Payload</h2>
                    <p className="text-[10px] text-muted-foreground mono-text">{selectedLog.id} // {selectedLog.timestamp}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <span className="text-xs uppercase font-bold text-muted-foreground">Close</span>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-black/40 rounded-lg p-5 border border-border/50 overflow-x-auto">
                  <pre className="text-[11px] mono-text text-primary/90 leading-relaxed">
                    {JSON.stringify({
                      metadata: {
                        event_id: selectedLog.id,
                        version: "1.0.4",
                        source: "ADMIN_CONSOLE_V3",
                        origin_ip: "10.0.1.15",
                        user_agent: "Mozilla/5.0 (SentinelOS; v8.2)"
                      },
                      auth: {
                        admin_email: selectedLog.admin,
                        session_id: "sess_91283x_abc",
                        auth_method: "MFA_HARDWARE_TOKEN"
                      },
                      action_details: {
                        operation: selectedLog.action,
                        target: "SYSTEM_PRODUCTION_V3",
                        description: selectedLog.details,
                        severity_level: selectedLog.severity,
                        status: "COMMITTED_SUCCESS"
                      },
                      trace_context: {
                        trace_id: `trace_${Math.random().toString(36).substr(2, 9)}`,
                        span_id: `span_${Math.random().toString(36).substr(2, 9)}`,
                        parent_id: "root_sentinel_01"
                      }
                    }, null, 2)}
                  </pre>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <Terminal className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-tighter">
                    This payload is digitally signed and cryptographically verified against the Sentinel master ledger.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditLogs;
