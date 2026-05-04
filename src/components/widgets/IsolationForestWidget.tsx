import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const normalData = Array.from({ length: 60 }, (_, i) => ({
  x: 8 + Math.random() * 3,
  y: 0.2 + Math.random() * 0.5,
  anomaly: false,
}));

const anomalyData = [
  { x: 2.1, y: 0.95, anomaly: true },
  { x: 14.5, y: 0.88, anomaly: true },
  { x: 1.3, y: 0.72, anomaly: true },
  { x: 15.8, y: 0.91, anomaly: true },
  { x: 3.5, y: 0.82, anomaly: true },
];

const allData = [...normalData, ...anomalyData];

export function IsolationForestWidget() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Isolation Forest</h3>
          <p className="text-[10px] text-muted-foreground">Login Time Deviations</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] mono-text">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Normal</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-red" /> Anomaly</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="x" type="number" domain={[0, 18]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Login Hour", position: "bottom", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="y" type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Anomaly Score", angle: -90, position: "left", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
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
          <Scatter data={allData}>
            {allData.map((entry, index) => (
              <Cell key={index} fill={entry.anomaly ? "hsl(0 100% 62%)" : "hsl(187 100% 45%)"} fillOpacity={entry.anomaly ? 0.9 : 0.4} r={entry.anomaly ? 6 : 3} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
