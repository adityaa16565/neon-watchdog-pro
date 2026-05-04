import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const safeData = Array.from({ length: 40 }, () => ({
  outbound: Math.random() * 500 + 50,
  sessions: Math.floor(Math.random() * 20 + 5),
  flagged: false,
}));

const flaggedData = [
  { outbound: 2800, sessions: 3, flagged: true },
  { outbound: 3500, sessions: 2, flagged: true },
  { outbound: 1900, sessions: 4, flagged: true },
  { outbound: 4200, sessions: 1, flagged: true },
];

const allData = [...safeData, ...flaggedData];

export function SVMWidget() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">SVM Classifier</h3>
          <p className="text-[10px] text-muted-foreground">Data Exfiltration Boundary</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] mono-text text-neon-red">
          <span className="pulse-dot pulse-dot-red" />
          4 boundary violations
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="outbound" type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Outbound MB", position: "bottom", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="sessions" type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Sessions", angle: -90, position: "left", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))", 
              borderRadius: 8, 
              fontSize: 11,
              color: "hsl(var(--foreground))"
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <ReferenceLine x={1500} stroke="hsl(0, 100%, 62%)" strokeDasharray="8 4" strokeWidth={2} label={{ value: "SVM Boundary", fill: "hsl(0, 100%, 62%)", fontSize: 10 }} />
          <Scatter data={allData}>
            {allData.map((entry, i) => (
              <Cell key={i} fill={entry.flagged ? "hsl(0, 100%, 62%)" : "hsl(187, 100%, 45%)"} fillOpacity={entry.flagged ? 0.9 : 0.35} r={entry.flagged ? 7 : 3} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
