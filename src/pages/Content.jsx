import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageHeader, StatCard, Card, Badge } from "../components/common/PageLayout";
import { FiFilm, FiStar, FiUpload, FiGrid } from "react-icons/fi";

const genreData = [
  { name: "Drama", value: 28 }, { name: "Comedy", value: 18 }, { name: "Action", value: 16 },
  { name: "Documentary", value: 14 }, { name: "Thriller", value: 12 }, { name: "Other", value: 12 },
];
const COLORS = ["var(--accent)", "var(--accent-2)", "var(--accent-orange)", "var(--accent-3)", "var(--accent-blue)", "var(--text-muted)"];

const topRated = [
  { title: "The Crown", genre: "Drama", rating: 9.2, views: "12.4M" },
  { title: "Stranger Things", genre: "Sci-Fi", rating: 8.9, views: "10.8M" },
  { title: "Breaking Bad", genre: "Drama", rating: 9.5, views: "9.2M" },
  { title: "Planet Earth II", genre: "Documentary", rating: 9.3, views: "7.6M" },
  { title: "The Office", genre: "Comedy", rating: 8.7, views: "11.1M" },
];

const recentUploads = [
  { title: "Dark Season 3", type: "Movie", date: "Aug 1, 2024", status: "Published" },
  { title: "Chef's Table S7", type: "Series", date: "Jul 28, 2024", status: "Processing" },
  { title: "Nature Docs Bundle", type: "Documentary", date: "Jul 25, 2024", status: "Published" },
  { title: "Stand Up Special", type: "Comedy", date: "Jul 20, 2024", status: "Published" },
];

const yearlyData = [
  { year: "2020", movies: 320, series: 180 }, { year: "2021", movies: 380, series: 240 },
  { year: "2022", movies: 420, series: 310 }, { year: "2023", movies: 480, series: 390 },
  { year: "2024", movies: 290, series: 220 },
];

export default function Content() {
  return (
    <div>
      <PageHeader title="Movies / Content" subtitle="Manage your streaming library and content catalog." />

      <div className="stat-cards-grid">
        <StatCard title="Total Content" value="8,724" change="142 added this month" changeType="up" icon={<FiFilm />} color="var(--accent)" />
        <StatCard title="Top Rated" value="4.8★" change="0.1 vs last month" changeType="up" icon={<FiStar />} color="var(--accent-2)" />
        <StatCard title="Recent Uploads" value="38" change="This month" changeType="up" icon={<FiUpload />} color="var(--accent-orange)" />
        <StatCard title="Genres" value="24" icon={<FiGrid />} color="var(--accent-3)" />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card title="Genre Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={genreData} cx="50%" cy="50%" outerRadius={85} dataKey="value" paddingAngle={2}>
                {genreData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={v => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Content Added by Year">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="movies" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Movies" />
              <Bar dataKey="series" fill="var(--accent-2)" radius={[4, 4, 0, 0]} name="Series" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="two-col">
        <Card title="Top Rated Content">
          <table className="data-table">
            <thead><tr><th>#</th><th>Title</th><th>Genre</th><th>Rating</th><th>Views</th></tr></thead>
            <tbody>
              {topRated.map((c, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{c.title}</td>
                  <td>{c.genre}</td>
                  <td><span style={{ color: "var(--accent-yellow)", fontWeight: 600 }}>★ {c.rating}</span></td>
                  <td>{c.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Recent Uploads">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {recentUploads.map((u, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{u.title}</td>
                  <td>{u.type}</td>
                  <td style={{ color: "var(--text-muted)" }}>{u.date}</td>
                  <td><Badge color={u.status === "Published" ? "green" : "orange"}>{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
