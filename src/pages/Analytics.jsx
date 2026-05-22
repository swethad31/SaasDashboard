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

import {
  PageHeader,
  StatCard,
  Card,
} from "../components/common/PageLayout";

import {
  FiEye,
  FiUsers,
} from "react-icons/fi";

const COLORS = [
  "var(--accent)",
  "var(--accent-2)",
  "var(--accent-orange)",
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    labels: [],
    series: [],
    devices: [],
    topContent: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/analytics")
      .then((res) => {
        setAnalytics({
          labels: res.data?.labels || [],
          series: res.data?.series || [],
          devices: res.data?.devices || [],
          topContent: res.data?.topContent || [],
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Analytics fetch failed:", err?.response?.status, err?.message);
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  const growthData = analytics.labels.map((label, i) => ({
    month: label,
    titles: analytics.series[i] || 0,
  }));

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Traffic, conversions, and user behavior insights."
      />

      <div className="stat-cards-grid">
        <StatCard
          title="Total Titles"
          value={analytics.series.reduce(
            (a, b) => a + b,
            0
          )}
          icon={<FiEye />}
          color="var(--accent)"
        />

        <StatCard
          title="Years"
          value={analytics.labels.length}
          icon={<FiUsers />}
          color="var(--accent-2)"
        />
      </div>

      <div
        className="two-col"
        style={{ marginBottom: 20 }}
      >
        <Card title="Titles by Year">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="titles"
                fill="var(--accent)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Device Usage">
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={analytics.devices}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {analytics.devices.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Performing Content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Conv.</th>
              </tr>
            </thead>

            <tbody>
              {analytics.topContent.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>

                  <td>{item.views}</td>

                  <td>
                    <span
                      style={{
                        color:
                          item.trend === "up"
                            ? "limegreen"
                            : "red",
                      }}
                    >
                      {item.conv}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}