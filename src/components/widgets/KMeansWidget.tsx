import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const clusters = [
  // IT cluster
  ...Array.from({ length: 12 }, () => ({
    x: 20 + Math.random() * 15,
    y: 60 + Math.random() * 15,
    cluster: "IT",
    deviant: false,
  })),
  // Finance cluster
  ...Array.from({ length: 10 }, () => ({
    x: 60 + Math.random() * 15,
    y: 70 + Math.random() * 12,
    cluster: "Finance",
    deviant: false,
  })),
  // HR cluster
  ...Array.from({ length: 8 }, () => ({
    x: 45 + Math.random() * 12,
    y: 25 + Math.random() * 12,
    cluster: "HR",
    deviant: false,
  })),
  // Deviant user
  { x: 85, y: 15, cluster: "IT", deviant: true },
];

const clusterColors: Record<string, string> = {
  IT: "hsl(187, 100%, 45%)",
  Finance: "hsl(145, 80%, 45%)",
  HR: "hsl(40, 100%, 50%)",
};

interface ClusterData {
  x: number;
  y: number;
  cluster: string;
  deviant: boolean;
}

export function KMeansWidget() {
  const navigate = useNavigate();

  const handlePointClick = (data: ClusterData) => {
    if (data.deviant) {
      navigate("/activity");
    }
  };

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">K-Means Clustering</h3>
          <p className="text-[10px] text-muted-foreground">Peer Group Behavioral Deviation</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] mono-text">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> IT</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-green" /> Finance</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-amber" /> HR</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="x" type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Behavior Vector X", position: "bottom", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="y" type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Behavior Vector Y", angle: -90, position: "left", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))", 
              borderRadius: 8, 
              fontSize: 11,
              color: "hsl(var(--foreground))"
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string, props: { payload: ClusterData }) => {
              const item = props.payload;
              return item.deviant ? [`⚠️ DEVIANT USER — Drifted from ${item.cluster} cluster`, "Alert"] : [item.cluster, "Department"];
            }} 
          />
          <Scatter data={clusters}>
            {clusters.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.deviant ? "hsl(0, 100%, 62%)" : clusterColors[entry.cluster]}
                fillOpacity={entry.deviant ? 1 : 0.5}
                r={entry.deviant ? 10 : 4}
                stroke={entry.deviant ? "hsl(0, 100%, 62%)" : "none"}
                strokeWidth={entry.deviant ? 2 : 0}
                className={entry.deviant ? "cursor-pointer animate-pulse" : "cursor-default"}
                onClick={() => handlePointClick(entry)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
