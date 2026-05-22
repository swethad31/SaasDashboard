import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { PageHeader, StatCard, Card, Badge } from "../components/common/PageLayout";
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard } from "react-icons/fi";

const monthlyRevenue = [
  { month: "Jan", revenue: 32000, expenses: 18000, profit: 14000 },
  { month: "Feb", revenue: 38000, expenses: 20000, profit: 18000 },
  { month: "Mar", revenue: 42000, expenses: 22000, profit: 20000 },
  { month: "Apr", revenue: 47000, expenses: 21000, profit: 26000 },
  { month: "May", revenue: 54000, expenses: 24000, profit: 30000 },
  { month: "Jun", revenue: 61000, expenses: 26000, profit: 35000 },
  { month: "Jul", revenue: 68000, expenses: 28000, profit: 40000 },
  { month: "Aug", revenue: 75000, expenses: 30000, profit: 45000 },
];

const transactions = [
  { id: "TXN-8821", user: "Alice Johnson", amount: "$299.00", type: "Subscription", date: "Aug 1, 2024", status: "Paid" },
  { id: "TXN-8820", user: "Bob Smith", amount: "$99.00", type: "Upgrade", date: "Aug 1, 2024", status: "Paid" },
  { id: "TXN-8819", user: "Carol White", amount: "$499.00", type: "Enterprise", date: "Jul 31, 2024", status: "Pending" },
  { id: "TXN-8818", user: "David Lee", amount: "$99.00", type: "Subscription", date: "Jul 30, 2024", status: "Paid" },
  { id: "TXN-8817", user: "Eva Martinez", amount: "$299.00", type: "Subscription", date: "Jul 29, 2024", status: "Failed" },
];

const statusColor = { Paid: "green", Pending: "orange", Failed: "red" };

export default function Revenue() {
  return (
    <div>
      <PageHeader title="Revenue" subtitle="Financial performance and transaction history." />

      <div className="stat-cards-grid">
        <StatCard title="Total Revenue" value="$417k" change="22.4% YTD" changeType="up" icon={<FiDollarSign />} color="var(--accent)" />
        <StatCard title="Monthly Earnings" value="$75k" change="10.3% vs last month" changeType="up" icon={<FiTrendingUp />} color="var(--accent-2)" />
        <StatCard title="Total Expenses" value="$30k" change="5.1% vs last month" changeType="down" icon={<FiTrendingDown />} color="var(--accent-orange)" />
        <StatCard title="Net Profit" value="$45k" change="16.8% vs last month" changeType="up" icon={<FiCreditCard />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="Monthly Earnings">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="url(#rev)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Profit / Loss">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey="profit" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Profit" />
              <Bar dataKey="expenses" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Transactions">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Transaction ID</th><th>User</th><th>Amount</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-muted)" }}>{t.id}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{t.user}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>{t.amount}</td>
                  <td>{t.type}</td>
                  <td style={{ color: "var(--text-muted)" }}>{t.date}</td>
                  <td><Badge color={statusColor[t.status]}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
