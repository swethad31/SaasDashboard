import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { PageHeader, StatCard, Card } from "../components/common/PageLayout";
import { FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from "react-icons/fi";
import "../styles/pages.css";

const growthData = [
  { month: "Jan", users: 4200, revenue: 32000 }, { month: "Feb", users: 5800, revenue: 38000 },
  { month: "Mar", users: 6200, revenue: 42000 }, { month: "Apr", users: 7100, revenue: 47000 },
  { month: "May", users: 8900, revenue: 54000 }, { month: "Jun", users: 10200, revenue: 61000 },
  { month: "Jul", users: 11400, revenue: 68000 }, { month: "Aug", users: 12800, revenue: 75000 },
];

const activityData = [
  { id: 1, user: "Alice Johnson", action: "Subscribed to Pro", time: "2 min ago", type: "success" },
  { id: 2, user: "Bob Smith", action: "Cancelled subscription", time: "15 min ago", type: "danger" },
  { id: 3, user: "Carol White", action: "Upgraded to Enterprise", time: "1h ago", type: "success" },
  { id: 4, user: "David Lee", action: "Requested invoice", time: "2h ago", type: "info" },
  { id: 5, user: "Eva Martinez", action: "Added new payment method", time: "3h ago", type: "info" },
  { id: 6, user: "Frank Kim", action: "Downloaded report", time: "4h ago", type: "info" },
];

const typeColors = { success: "var(--accent)", danger: "#ef4444", info: "var(--accent-2)" };

export default function Dashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back — here's what's happening today." />

      <div className="stat-cards-grid">
        <StatCard title="Total Users" value="12,840" change="8.2% vs last month" changeType="up" icon={<FiUsers />} color="var(--accent)" />
        <StatCard title="Revenue" value="$54.2k" change="5.1% vs last month" changeType="up" icon={<FiDollarSign />} color="var(--accent-2)" />
        <StatCard title="Growth Rate" value="18.4%" change="3.2% vs last month" changeType="up" icon={<FiTrendingUp />} color="var(--accent-orange)" />
        <StatCard title="Active Sessions" value="1,284" change="2.1% vs last hour" changeType="down" icon={<FiActivity />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="User & Revenue Growth">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="var(--accent)" fill="url(#colorUsers)" strokeWidth={2} />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent-2)" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Revenue (Bar)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="var(--accent-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Activity">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th><th>Action</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityData.map(r => (
              <tr key={r.id}>
                <td><strong style={{ color: "var(--text)" }}>{r.user}</strong></td>
                <td>{r.action}</td>
                <td style={{ color: "var(--text-muted)" }}>{r.time}</td>
                <td>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: typeColors[r.type], display: "inline-block" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
