import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const soarLogs = [
  {
    time: "14:32:08",
    action: "Network Isolated for User_042",
    reason: "SVM Exfiltration Alert",
    severity: "critical",
  },
  {
    time: "14:28:15",
    action: "Account Locked — User_107",
    reason: "Random Forest Unknown Device",
    severity: "critical",
  },
  {
    time: "14:22:41",
    action: "Privilege Revoked — User_089",
    reason: "Sequential Pattern Mining Escalation",
    severity: "warning",
  },
  {
    time: "14:15:03",
    action: "Alert Escalated to SOC Team",
    reason: "K-Means Peer Deviation Score > 0.92",
    severity: "warning",
  },
  {
    time: "14:08:56",
    action: "Session Terminated — User_034",
    reason: "Isolation Forest Login Anomaly",
    severity: "critical",
  },
];

export function SOARPanel() {
  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-neon-red" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground tracking-tight">Active Defense & SOAR</h2>
            <p className="text-[10px] text-muted-foreground mono-text uppercase tracking-wider">5 automated actions // last hour</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Manual action buttons removed */}
        </div>
      </div>

      <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
        {soarLogs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs mono-text ${
              log.severity === "critical"
                ? "bg-neon-red/5 border border-neon-red/15"
                : "bg-neon-amber/5 border border-neon-amber/15"
            }`}
          >
            <span className="text-muted-foreground w-16 shrink-0">{log.time}</span>
            <span className={`pulse-dot shrink-0 ${log.severity === "critical" ? "pulse-dot-red" : "pulse-dot-amber"}`} />
            <span className="text-foreground flex-1">[Automated] {log.action}</span>
            <span className="text-muted-foreground">{log.reason}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
