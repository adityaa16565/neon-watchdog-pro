import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, BrainCircuit, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const models = [
  { name: "Isolation Forest", status: "Active", accuracy: "97.2%", lastTrained: "2h ago", anomalies: 5, type: "Unsupervised" },
  { name: "Random Forest", status: "Active", accuracy: "96.8%", lastTrained: "4h ago", anomalies: 7, type: "Supervised" },
  { name: "Time Series ARIMA", status: "Active", accuracy: "94.1%", lastTrained: "1h ago", anomalies: 3, type: "Statistical" },
  { name: "SVM Classifier", status: "Active", accuracy: "98.3%", lastTrained: "3h ago", anomalies: 4, type: "Supervised" },
  { name: "K-Means Clustering", status: "Retraining", accuracy: "95.6%", lastTrained: "30m ago", anomalies: 1, type: "Unsupervised" },
  { name: "Seq. Pattern Mining", status: "Active", accuracy: "93.9%", lastTrained: "6h ago", anomalies: 2, type: "Association" },
];

const BehavioralAnalytics = () => {
  const [modelStates, setModelStates] = useState(models);
  const [retrainingId, setRetrainingId] = useState<string | null>(null);

  const handleRetrain = (index: number) => {
    const model = modelStates[index];
    setRetrainingId(model.name);
    
    // Simulate retraining process
    setTimeout(() => {
      setModelStates(prev => prev.map((m, i) => 
        i === index ? { ...m, status: "Active", lastTrained: "Just now", accuracy: (parseFloat(m.accuracy) + (Math.random() * 0.5)).toFixed(1) + "%" } : m
      ));
      setRetrainingId(null);
    }, 3000);
  };
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground">BEHAVIORAL ANALYTICS</span>
      </header>
      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Models Active", value: "5/6", icon: BrainCircuit, color: "primary" },
            { label: "Avg Accuracy", value: "96.0%", icon: TrendingUp, color: "green" },
            { label: "Total Anomalies", value: "22", icon: AlertTriangle, color: "red" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 mono-text ${s.color === "primary" ? "text-primary" : s.color === "green" ? "text-neon-green" : "neon-text-red"}`}>{s.value}</p>
                </div>
                <s.icon className={`w-5 h-5 ${s.color === "primary" ? "text-primary" : s.color === "green" ? "text-neon-green" : "text-neon-red"}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">ML Model Performance</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left p-3">Model</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Accuracy</th>
                <th className="text-left p-3">Last Trained</th>
                <th className="text-left p-3">Anomalies</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modelStates.map((m, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-sm font-medium text-foreground">{m.name}</td>
                  <td className="p-3 text-xs mono-text text-muted-foreground">{m.type}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs mono-text ${m.status === "Active" ? "text-primary" : "text-neon-amber"}`}>
                      <span className={`pulse-dot ${m.status === "Active" ? "pulse-dot-cyan" : "pulse-dot-amber"}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs mono-text text-neon-green">{m.accuracy}</td>
                  <td className="p-3 text-xs mono-text text-muted-foreground">{m.lastTrained}</td>
                  <td className="p-3 text-xs mono-text text-neon-red">{m.anomalies}</td>
                  <td className="p-3 text-right">
                    <button 
                      disabled={retrainingId === m.name}
                      onClick={() => handleRetrain(i)}
                      className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-md transition-all ${
                        retrainingId === m.name 
                          ? "bg-muted text-muted-foreground cursor-wait" 
                          : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {retrainingId === m.name ? "Retraining..." : "Retrain"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default BehavioralAnalytics;
