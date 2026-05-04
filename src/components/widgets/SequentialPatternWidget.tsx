import { motion } from "framer-motion";
import { User, Settings, ShieldAlert, ArrowRight } from "lucide-react";

const nodes = [
  { id: 1, label: "User_089", sublabel: "Standard Access", icon: User, color: "primary" },
  { id: 2, label: "Config Access", sublabel: "System Settings", icon: Settings, color: "amber" },
  { id: 3, label: "Admin Rights", sublabel: "Privilege Escalation", icon: ShieldAlert, color: "red" },
];

export function SequentialPatternWidget() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sequential Pattern Mining</h3>
          <p className="text-[10px] text-muted-foreground">Privilege Escalation Path Detection</p>
        </div>
        <span className="text-[10px] mono-text px-2 py-0.5 rounded bg-neon-red/10 text-neon-red border border-neon-red/20">
          ESCALATION DETECTED
        </span>
      </div> 

      <div className="flex items-center justify-center gap-2 py-6">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border ${
                node.color === "primary"
                  ? "bg-primary/5 border-primary/30"
                  : node.color === "amber"
                  ? "bg-neon-amber/5 border-neon-amber/30"
                  : "bg-neon-red/5 border-neon-red/30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  node.color === "primary"
                    ? "bg-primary/15"
                    : node.color === "amber"
                    ? "bg-neon-amber/15"
                    : "bg-neon-red/15"
                }`}
              >
                <node.icon
                  className={`w-5 h-5 ${
                    node.color === "primary"
                      ? "text-primary"
                      : node.color === "amber"
                      ? "text-neon-amber"
                      : "text-neon-red"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{node.label}</p>
                <p className="text-[10px] text-muted-foreground">{node.sublabel}</p>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight
                className={`w-5 h-5 mx-1 ${
                  i === 0 ? "text-neon-amber" : "text-neon-red"
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-neon-red/5 border border-neon-red/15 rounded-lg p-3">
        <p className="text-[11px] mono-text text-neon-red">
          ⚠ Pattern: User_089 accessed system config 3x in 12min, then obtained admin credentials via service account exploitation.
        </p>
      </div>
    </div>
  );
}
