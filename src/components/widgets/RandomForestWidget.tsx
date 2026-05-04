import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Verified Devices", value: 78 },
  { name: "Unknown Devices", value: 15 },
  { name: "Flagged Devices", value: 7 },
];

const COLORS = ["hsl(187, 100%, 45%)", "hsl(40, 100%, 50%)", "hsl(0, 100%, 62%)"];

export function RandomForestWidget() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Random Forest</h3>
        <p className="text-[10px] text-muted-foreground">Device Usage Authenticity</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{item.name}</span>
              </span>
              <span className="mono-text text-foreground font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
