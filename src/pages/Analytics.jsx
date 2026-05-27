import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PageHeader, StatCard, Card } from "../components/common/PageLayout";
import { FiEye, FiUsers } from "react-icons/fi";

const COLORS = ["var(--accent)", "var(--accent-2)", "var(--accent-orange)"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/analytics")
      .then((res) => {
        const d = res.data;
        if (!d || !Array.isArray(d.labels) || d.labels.length === 0) {
          setError(
            "Backend returned empty data. Check that uvicorn is running and the Excel file path is correct. See backend console for details."
          );
          setLoading(false);
          return;
        }
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        const status = err?.response?.status;
        const msg = err?.message;
        setError(
          `API call failed (HTTP ${status || "no response"}: ${msg}). Is the backend running on port 8000?`
        );
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div
        style={{
          padding: 40,
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        Loading analytics...
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 40 }}>
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 8,
            padding: "16px 20px",
            color: "#ef4444",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <strong>⚠ Analytics failed to load</strong>
          <br />
          {error}
        </div>
      </div>
    );

  const barData = data.labels.map((label, i) => ({
    year: label,
    titles: data.series[i] || 0,
  }));

  const total = data.series.reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Netflix titles breakdown by year, type, and country."
      />

      <div className="stat-cards-grid">
        <StatCard
          title="Total Titles"
          value={total.toLocaleString()}
          icon={<FiEye />}
          color="var(--accent)"
        />
        <StatCard
          title="Years Covered"
          value={data.labels.length}
          icon={<FiUsers />}
          color="var(--accent-2)"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Card title="Titles by Release Year">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "var(--text-muted)", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval={4}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="titles"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
                name="Titles"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Content Type">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.devices}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.devices.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Countries">
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Titles</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.topContent.map((item, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>
                    {item.title}
                  </td>
                  <td>{Number(item.views).toLocaleString()}</td>
                  <td style={{ color: "var(--accent)" }}>{item.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

