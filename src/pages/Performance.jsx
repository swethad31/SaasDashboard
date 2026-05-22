import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, StatCard, Card, Badge } from "../components/common/PageLayout";
import { FiZap, FiServer, FiCpu, FiClock } from "react-icons/fi";

const perfData = [
  { time: "00:00", api: 120, db: 45, cdn: 20 }, { time: "04:00", api: 90, db: 38, cdn: 15 },
  { time: "08:00", api: 180, db: 72, cdn: 25 }, { time: "12:00", api: 240, db: 98, cdn: 32 },
  { time: "16:00", api: 210, db: 85, cdn: 28 }, { time: "20:00", api: 160, db: 65, cdn: 22 },
  { time: "24:00", api: 130, db: 52, cdn: 18 },
];

const uptimeData = [
  { day: "Mon", uptime: 99.9 }, { day: "Tue", uptime: 100 }, { day: "Wed", uptime: 99.7 },
  { day: "Thu", uptime: 100 }, { day: "Fri", uptime: 99.8 }, { day: "Sat", uptime: 100 },
  { day: "Sun", uptime: 100 },
];

const services = [
  { name: "API Gateway", status: "Operational", latency: "124ms", uptime: "99.9%" },
  { name: "Database Cluster", status: "Operational", latency: "45ms", uptime: "100%" },
  { name: "CDN", status: "Operational", latency: "18ms", uptime: "100%" },
  { name: "Auth Service", status: "Degraded", latency: "380ms", uptime: "98.2%" },
  { name: "Email Service", status: "Operational", latency: "210ms", uptime: "99.8%" },
  { name: "Storage", status: "Operational", latency: "67ms", uptime: "100%" },
];

const statusColor = { Operational: "green", Degraded: "orange", Down: "red" };

export default function Performance() {
  return (
    <div>
      <PageHeader title="Performance" subtitle="System health, API response times, and KPIs." />

      <div className="stat-cards-grid">
        <StatCard title="Avg Response" value="124ms" change="12ms improvement" changeType="up" icon={<FiZap />} color="var(--accent)" />
        <StatCard title="Uptime" value="99.9%" change="7 days streak" changeType="up" icon={<FiServer />} color="var(--accent-2)" />
        <StatCard title="CPU Usage" value="34%" change="vs 40% yesterday" changeType="up" icon={<FiCpu />} color="var(--accent-orange)" />
        <StatCard title="P95 Latency" value="280ms" change="vs 310ms last week" changeType="up" icon={<FiClock />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="Response Times (ms)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="api" stroke="var(--accent)" strokeWidth={2} dot={false} name="API" />
              <Line type="monotone" dataKey="db" stroke="var(--accent-2)" strokeWidth={2} dot={false} name="Database" />
              <Line type="monotone" dataKey="cdn" stroke="var(--accent-orange)" strokeWidth={2} dot={false} name="CDN" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Daily Uptime %">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={uptimeData}>
              <defs>
                <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis domain={[99, 100.1]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={v => `${v}%`} />
              <Area type="monotone" dataKey="uptime" stroke="var(--accent)" fill="url(#upGrad)" strokeWidth={2} name="Uptime" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Service Status">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Service</th><th>Status</th><th>Latency</th><th>Uptime (7d)</th></tr></thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.status === "Operational" ? "var(--accent)" : "var(--accent-orange)", display: "inline-block" }} />
                      <Badge color={statusColor[s.status]}>{s.status}</Badge>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 13 }}>{s.latency}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 600 }}>{s.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
