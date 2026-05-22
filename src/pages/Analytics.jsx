import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { PageHeader, StatCard, Card } from "../components/common/PageLayout";
import { FiEye, FiUsers, FiTarget, FiSmartphone } from "react-icons/fi";

const trafficData = [
  { day: "Mon", visits: 4200, unique: 2800 }, { day: "Tue", visits: 5100, unique: 3200 },
  { day: "Wed", visits: 6800, unique: 4100 }, { day: "Thu", visits: 5900, unique: 3800 },
  { day: "Fri", visits: 7200, unique: 4600 }, { day: "Sat", visits: 3400, unique: 2100 },
  { day: "Sun", visits: 2800, unique: 1700 },
];

const growthData = [
  { month: "Jan", new: 1200, returning: 3000 }, { month: "Feb", new: 1800, returning: 4000 },
  { month: "Mar", new: 1400, returning: 4800 }, { month: "Apr", new: 2200, returning: 4900 },
  { month: "May", new: 2800, returning: 6100 }, { month: "Jun", new: 3200, returning: 7000 },
];

const deviceData = [
  { name: "Desktop", value: 52 }, { name: "Mobile", value: 35 },
  { name: "Tablet", value: 13 },
];

const COLORS = ["var(--accent)", "var(--accent-2)", "var(--accent-orange)"];

const topContent = [
  { title: "Getting Started Guide", views: "24.2k", conv: "8.2%", trend: "up" },
  { title: "Pricing Page", views: "18.7k", conv: "12.1%", trend: "up" },
  { title: "Feature Comparison", views: "14.1k", conv: "6.4%", trend: "down" },
  { title: "API Documentation", views: "11.8k", conv: "4.2%", trend: "up" },
  { title: "Blog: Best Practices", views: "9.3k", conv: "3.1%", trend: "down" },
];

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Traffic, conversions, and user behavior insights." />

      <div className="stat-cards-grid">
        <StatCard title="Page Views" value="48.2k" change="12.4% this week" changeType="up" icon={<FiEye />} color="var(--accent)" />
        <StatCard title="New Users" value="3,842" change="7.2% this week" changeType="up" icon={<FiUsers />} color="var(--accent-2)" />
        <StatCard title="Conversion Rate" value="4.8%" change="0.3% this week" changeType="down" icon={<FiTarget />} color="var(--accent-orange)" />
        <StatCard title="Mobile Users" value="35%" change="2.1% this week" changeType="up" icon={<FiSmartphone />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="Daily Traffic">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="tvisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="var(--accent)" fill="url(#tvisits)" strokeWidth={2} name="Total Visits" />
              <Line type="monotone" dataKey="unique" stroke="var(--accent-2)" strokeWidth={2} dot={false} name="Unique" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="User Growth">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="new" fill="var(--accent)" radius={[4, 4, 0, 0]} name="New Users" />
              <Bar dataKey="returning" fill="var(--accent-2)" radius={[4, 4, 0, 0]} name="Returning" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Device Usage">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {deviceData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Performing Content">
          <table className="data-table">
            <thead><tr><th>Page</th><th>Views</th><th>Conv.</th></tr></thead>
            <tbody>
              {topContent.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text)" }}>{r.title}</td>
                  <td>{r.views}</td>
                  <td><span style={{ color: r.trend === "up" ? "var(--accent)" : "#ef4444" }}>{r.conv}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
