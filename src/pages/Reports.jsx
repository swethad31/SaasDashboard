import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, StatCard, Card, Badge, Btn } from "../components/common/PageLayout";
import { FiFileText, FiDownload, FiCheckCircle, FiClock } from "react-icons/fi";

const monthlyData = [
  { month: "Jan", reports: 42, revenue: 28000 }, { month: "Feb", reports: 58, revenue: 34000 },
  { month: "Mar", reports: 51, revenue: 39000 }, { month: "Apr", reports: 67, revenue: 44000 },
  { month: "May", reports: 74, revenue: 51000 }, { month: "Jun", reports: 88, revenue: 58000 },
];

const reports = [
  { id: "RPT-001", name: "Q1 Revenue Summary", type: "Financial", date: "Mar 31, 2024", status: "Ready" },
  { id: "RPT-002", name: "User Growth Analysis", type: "Analytics", date: "Apr 15, 2024", status: "Ready" },
  { id: "RPT-003", name: "Content Performance", type: "Content", date: "Apr 28, 2024", status: "Processing" },
  { id: "RPT-004", name: "Q2 Revenue Summary", type: "Financial", date: "Jun 30, 2024", status: "Ready" },
  { id: "RPT-005", name: "Annual User Report", type: "Analytics", date: "Jun 30, 2024", status: "Processing" },
];

export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Download and analyze your business reports." />

      <div className="stat-cards-grid">
        <StatCard title="Total Reports" value="127" change="12 this month" changeType="up" icon={<FiFileText />} color="var(--accent)" />
        <StatCard title="Ready" value="94" icon={<FiCheckCircle />} color="var(--accent-2)" />
        <StatCard title="Processing" value="8" icon={<FiClock />} color="var(--accent-orange)" />
        <StatCard title="Downloads" value="2,341" change="24.1% this month" changeType="up" icon={<FiDownload />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="Monthly Reports Generated">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="reports" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Summary Cards">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Best Month", value: "June 2024", sub: "88 reports generated" },
              { label: "Avg Monthly Reports", value: "63.3", sub: "Last 6 months" },
              { label: "Most Common Type", value: "Financial", sub: "42% of all reports" },
              { label: "Total Data Processed", value: "18.4 GB", sub: "This year" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{s.value}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Report List" action={<Btn size="sm"><FiDownload /> Export All</Btn>}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Report Name</th><th>Type</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>{r.id}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{r.name}</td>
                  <td>{r.type}</td>
                  <td style={{ color: "var(--text-muted)" }}>{r.date}</td>
                  <td><Badge color={r.status === "Ready" ? "green" : "orange"}>{r.status}</Badge></td>
                  <td>
                    {r.status === "Ready" && (
                      <button style={{ color: "var(--accent)", fontSize: 15 }}><FiDownload /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
