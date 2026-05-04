import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const data = [
  { time: "00:00", velocity: 12 },
  { time: "02:00", velocity: 8 },
  { time: "04:00", velocity: 5 },
  { time: "06:00", velocity: 15 },
  { time: "08:00", velocity: 45 },
  { time: "09:00", velocity: 38 },
  { time: "10:00", velocity: 42 },
  { time: "11:00", velocity: 35 },
  { time: "12:00", velocity: 28 },
  { time: "13:00", velocity: 32 },
  { time: "14:00", velocity: 280 },
  { time: "14:15", velocity: 420 },
  { time: "14:30", velocity: 185 },
  { time: "15:00", velocity: 40 },
  { time: "16:00", velocity: 35 },
  { time: "18:00", velocity: 20 },
  { time: "20:00", velocity: 10 },
  { time: "22:00", velocity: 6 },
];

export function TimeSeriesWidget() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Time Series Analysis</h3>
          <p className="text-[10px] text-muted-foreground">File Access Velocity (files/min)</p>
        </div>
        <span className="text-[10px] mono-text px-2 py-0.5 rounded bg-neon-red/10 text-neon-red border border-neon-red/20">
          SPIKE DETECTED
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187, 100%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187, 100%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))", 
              borderRadius: 8, 
              fontSize: 11,
              color: "hsl(var(--foreground))"
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            cursor={{ stroke: "hsl(var(--primary) / 0.5)", strokeWidth: 2 }}
          />
          <ReferenceLine y={100} stroke="hsl(0, 100%, 62%)" strokeDasharray="5 5" label={{ value: "Threshold", fill: "hsl(0, 100%, 62%)", fontSize: 10 }} />
          <Area type="monotone" dataKey="velocity" stroke="hsl(187, 100%, 45%)" fill="url(#velocityGradient)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
