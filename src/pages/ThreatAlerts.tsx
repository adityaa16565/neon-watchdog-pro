import { useState, useMemo, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, AlertTriangle, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const alerts = [
  { id: "THR-001", user: "User_042", type: "Data Exfiltration", model: "SVM Classifier", risk: 94, time: "2 min ago", status: "Active" },
  { id: "THR-002", user: "User_107", type: "Unknown Device Login", model: "Random Forest", risk: 87, time: "8 min ago", status: "Active" },
  { id: "THR-003", user: "User_089", type: "Privilege Escalation", model: "Seq. Pattern Mining", risk: 91, time: "15 min ago", status: "Investigating" },
  { id: "THR-004", user: "User_034", type: "Anomalous Login Time", model: "Isolation Forest", risk: 72, time: "28 min ago", status: "Mitigated" },
  { id: "THR-005", user: "User_156", type: "Peer Group Deviation", model: "K-Means", risk: 68, time: "45 min ago", status: "Investigating" },
  { id: "THR-006", user: "User_203", type: "File Access Spike", model: "Time Series", risk: 85, time: "1h ago", status: "Active" },
  { id: "THR-007", user: "User_078", type: "USB Data Transfer", model: "SVM Classifier", risk: 96, time: "1.5h ago", status: "Mitigated" },
  { id: "THR-008", user: "User_291", type: "Off-hours Admin Access", model: "Isolation Forest", risk: 63, time: "2h ago", status: "Closed" },
  { id: "THR-009", user: "User_145", type: "Credential Sharing", model: "Random Forest", risk: 79, time: "3h ago", status: "Active" },
  { id: "THR-010", user: "User_312", type: "Mass File Download", model: "Time Series", risk: 88, time: "3.5h ago", status: "Investigating" },
  { id: "THR-011", user: "User_067", type: "Lateral Movement", model: "Seq. Pattern Mining", risk: 82, time: "4h ago", status: "Mitigated" },
  { id: "THR-012", user: "User_198", type: "VPN Anomaly", model: "Isolation Forest", risk: 55, time: "5h ago", status: "Closed" },
];

const statuses = ["All", "Active", "Investigating", "Mitigated", "Closed"] as const;
const severities = ["All", "Critical", "Warning", "Low"] as const;
const models = ["All", "SVM Classifier", "Random Forest", "Isolation Forest", "Time Series", "K-Means", "Seq. Pattern Mining"] as const;

type SortField = "risk" | "status" | "type";
type SortDir = "asc" | "desc";

const riskColor = (risk: number) => risk >= 85 ? "text-neon-red" : risk >= 65 ? "text-neon-amber" : "text-primary";
const statusColor = (s: string) => s === "Active" ? "pulse-dot-red" : s === "Investigating" ? "pulse-dot-amber" : s === "Mitigated" ? "pulse-dot-cyan" : "";
const severityFromRisk = (r: number) => r >= 85 ? "Critical" : r >= 65 ? "Warning" : "Low";

const statusBtnClass = (s: string, active: boolean) => {
  if (!active) return "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60";
  if (s === "Active") return "bg-neon-red/15 border-neon-red/40 text-neon-red";
  if (s === "Investigating") return "bg-neon-amber/15 border-neon-amber/40 text-neon-amber";
  if (s === "Mitigated") return "bg-primary/15 border-primary/40 text-primary";
  if (s === "Closed") return "bg-muted/50 border-muted-foreground/30 text-muted-foreground";
  return "bg-primary/15 border-primary/40 text-primary";
};

const ThreatAlerts = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [modelFilter, setModelFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [localAlerts, setLocalAlerts] = useState<any[]>(alerts);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveAlerts = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        // Try fetching from the existing backend without making schema changes
        const { data, error } = await supabase.from("threat_alerts").select("*");
        
        if (!error && data && data.length > 0) {
          // Map backend data format to UI format if needed
          const mappedData = data.map((item: any) => ({
            id: item.id || `THR-${Math.floor(Math.random()*1000)}`,
            user: item.user_name || item.user_id || "Unknown User",
            type: item.type || "Threat Alert",
            model: item.model || "Unknown Model",
            risk: item.risk || 50,
            time: new Date(item.created_at).toLocaleTimeString() || "Just now",
            status: item.status || "Active"
          }));
          setLocalAlerts(mappedData);
        }
      } catch (err) {
        console.warn("Could not fetch live alerts, falling back to mock data.", err);
      }
    };

    fetchLiveAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    setLocalAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: "Mitigated" } : a
    ));
    setSelectedId(null);

    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase
        .from("threat_alerts")
        .update({ status: "Mitigated" })
        .eq("id", id);
    } catch (err) {
      console.warn("Could not update threat alert status on the backend.", err);
    }
  };

  const handleEscalate = async (id: string) => {
    setLocalAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, status: "Active", risk: Math.min(100, a.risk + 5) } : a
    ));
    setSelectedId(null);

    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase
        .from("threat_alerts")
        .update({ status: "Active" })
        .eq("id", id);
    } catch (err) {
      console.warn("Could not escalate threat alert on the backend.", err);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "desc"
      ? <ArrowDown className="w-3 h-3 text-primary" />
      : <ArrowUp className="w-3 h-3 text-primary" />;
  };

  const filtered = useMemo(() => {
    let result = [...localAlerts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.type.toLowerCase().includes(q) ||
        a.user.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.model.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") result = result.filter(a => a.status === statusFilter);
    if (severityFilter !== "All") result = result.filter(a => severityFromRisk(a.risk) === severityFilter);
    if (modelFilter !== "All") result = result.filter(a => a.model === modelFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "risk") cmp = a.risk - b.risk;
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "type") cmp = a.type.localeCompare(b.type);
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [search, statusFilter, severityFilter, modelFilter, sortField, sortDir, localAlerts]);

  const activeFilters = [statusFilter, severityFilter, modelFilter].filter(f => f !== "All").length + (search ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setStatusFilter("All");
    setSeverityFilter("All");
    setModelFilter("All");
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center gap-3 border-b border-border px-4">
        <SidebarTrigger><Menu className="w-4 h-4" /></SidebarTrigger>
        <div className="h-5 w-px bg-border" />
        <span className="text-xs mono-text text-muted-foreground">THREAT ALERTS</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs mono-text text-neon-red">
          <span className="pulse-dot pulse-dot-red" /> {filtered.length} of {alerts.length} Threats
        </span>
      </header>

      {/* Filters toolbar */}
      <div className="border-b border-border px-4 py-3 space-y-3">
        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">Sort:</span>
            {(["risk", "type", "status"] as SortField[]).map(field => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] mono-text border transition-colors ${
                  sortField === field
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <SortIcon field={field} />
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">Status:</span>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] mono-text border transition-colors ${statusBtnClass(s, statusFilter === s)}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Severity */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">Severity:</span>
            {severities.map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] mono-text border transition-colors ${
                  severityFilter === s
                    ? s === "Critical" ? "bg-neon-red/15 border-neon-red/40 text-neon-red"
                      : s === "Warning" ? "bg-neon-amber/15 border-neon-amber/40 text-neon-amber"
                      : s === "Low" ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-primary/15 border-primary/40 text-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Model */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">Model:</span>
            <select
              value={modelFilter}
              onChange={e => setModelFilter(e.target.value)}
              className="h-7 rounded-md bg-muted/50 border border-border px-2 text-[11px] mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {activeFilters > 0 && (
            <>
              <div className="h-5 w-px bg-border" />
              <button onClick={clearAll} className="flex items-center gap-1 text-[11px] text-primary hover:underline">
                <X className="w-3 h-3" /> Clear all ({activeFilters})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert list */}
      <main className="flex-1 p-4 space-y-3 overflow-y-auto grid-bg">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-8 text-center"
            >
              <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No threats match your filters</p>
              <button onClick={clearAll} className="text-xs text-primary hover:underline mt-2">Clear filters</button>
            </motion.div>
          ) : (
            filtered.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedId(selectedId === alert.id ? null : alert.id)}
                  className={`glass-panel p-4 flex flex-col gap-4 cursor-pointer hover:bg-muted/30 transition-all ${
                    alert.risk >= 85 ? "glass-panel-critical" : ""
                  } ${selectedId === alert.id ? "ring-2 ring-primary border-primary/50" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.risk >= 85 ? "bg-neon-red/10" : alert.risk >= 65 ? "bg-neon-amber/10" : "bg-primary/10"
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${riskColor(alert.risk)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{alert.type}</span>
                        <span className="text-[10px] mono-text px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{alert.id}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span>{alert.user}</span>
                        <span>•</span>
                        <span>{alert.model}</span>
                        <span>•</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className={`text-lg font-bold mono-text ${riskColor(alert.risk)}`}>{alert.risk}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Risk Score</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`pulse-dot ${statusColor(alert.status)}`} />
                        <span className="text-xs mono-text text-muted-foreground">{alert.status}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedId === alert.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {selectedId === alert.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pt-4 border-t border-border flex items-center justify-between"
                    >
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Action Required</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }}
                          className="px-4 py-1.5 rounded bg-neon-green/10 border border-neon-green/30 text-[10px] font-bold text-neon-green hover:bg-neon-green/20 uppercase"
                        >
                          Mark Resolved
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEscalate(alert.id); }}
                          className="px-4 py-1.5 rounded bg-neon-red/10 border border-neon-red/30 text-[10px] font-bold text-neon-red hover:bg-neon-red/20 uppercase"
                        >
                          Escalate to SOC
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ThreatAlerts;
