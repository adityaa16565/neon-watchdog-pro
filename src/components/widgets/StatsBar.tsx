import { motion } from "framer-motion";
import { Users, AlertTriangle, Shield, Activity } from "lucide-react";

const stats = [
  { label: "Monitored Users", value: "2,847", icon: Users, trend: "+12 today", color: "primary" },
  { label: "Active Threats", value: "7", icon: AlertTriangle, trend: "+3 from baseline", color: "red" },
  { label: "SOAR Actions", value: "23", icon: Shield, trend: "Last 24h", color: "amber" },
  { label: "ML Model Accuracy", value: "96.4%", icon: Activity, trend: "Avg across 6 models", color: "green" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`glass-panel p-4 ${
            stat.color === "red" ? "glass-panel-critical" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1.5 mono-text tracking-tighter ${
                stat.color === "primary" ? "neon-text-cyan" :
                stat.color === "red" ? "neon-text-red" :
                stat.color === "amber" ? "neon-text-amber" :
                "text-neon-green"
              }`}>{stat.value}</p>
            </div>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
              stat.color === "primary" ? "bg-primary/5 border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]" :
              stat.color === "red" ? "bg-neon-red/5 border-neon-red/20 shadow-[0_0_10px_rgba(255,59,48,0.1)]" :
              stat.color === "amber" ? "bg-neon-amber/5 border-neon-amber/20 shadow-[0_0_10px_rgba(255,159,10,0.1)]" :
              "bg-neon-green/5 border-neon-green/20 shadow-[0_0_10px_rgba(168,100,37,0.1)]"
            }`}>
              <stat.icon className={`w-4 h-4 ${
                stat.color === "primary" ? "text-primary" :
                stat.color === "red" ? "text-neon-red" :
                stat.color === "amber" ? "text-neon-amber" :
                "text-neon-green"
              }`} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <div className={`w-1 h-1 rounded-full ${
               stat.color === "red" ? "bg-neon-red animate-pulse" : "bg-muted-foreground/30"
            }`} />
            <p className="text-[9px] text-muted-foreground/80 uppercase tracking-widest font-bold mono-text">{stat.trend}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
