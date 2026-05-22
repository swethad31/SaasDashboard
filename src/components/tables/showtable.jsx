import { useState } from "react";
import "./ShowTable.css";

const showsData = [
  {
    id: 1,
    name: "The Silicon Minds",
    genre: "Sci-Fi Drama",
    subscribers: 842_300,
    revenue: 128_450,
    status: "Active",
    change: +12.4,
  },
  {
    id: 2,
    name: "Night Frequency",
    genre: "Thriller",
    subscribers: 610_750,
    revenue: 94_200,
    status: "Active",
    change: +8.1,
  },
  {
    id: 3,
    name: "Orbit Zero",
    genre: "Adventure",
    subscribers: 389_100,
    revenue: 61_800,
    status: "Pending",
    change: +2.3,
  },
  {
    id: 4,
    name: "Hollow Kingdom",
    genre: "Fantasy",
    subscribers: 275_500,
    revenue: 43_700,
    status: "Active",
    change: +19.7,
  },
  {
    id: 5,
    name: "Echo Chamber",
    genre: "Docuseries",
    subscribers: 193_400,
    revenue: 28_550,
    status: "Cancelled",
    change: -5.6,
  },
  {
    id: 6,
    name: "Velvet Underground",
    genre: "Crime",
    subscribers: 504_800,
    revenue: 77_300,
    status: "Pending",
    change: +0.9,
  },
  {
    id: 7,
    name: "Dusk Protocol",
    genre: "Cyberpunk",
    subscribers: 731_200,
    revenue: 113_600,
    status: "Active",
    change: +24.2,
  },
  {
    id: 8,
    name: "Crimson Latitude",
    genre: "Spy Thriller",
    subscribers: 148_900,
    revenue: 19_400,
    status: "Cancelled",
    change: -11.3,
  },
];

const fmt = {
  subs: (n) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + "M"
      : (n / 1_000).toFixed(1) + "K",
  rev: (n) =>
    "$" +
    n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
};

export default function ShowsTable() {
  const [sortKey, setSortKey] = useState("subscribers");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [actionRow, setActionRow] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const visible = showsData
    .filter((s) => filter === "All" || s.status === filter)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      return (a[sortKey] > b[sortKey] ? 1 : -1) * mul;
    });

  const sortIcon = (col) => {
    const active = sortKey === col;
    const symbol = active ? (sortDir === "asc" ? "↑" : "↓") : "↕";
    return (
      <span className={`sort-icon ${active ? "active" : ""}`}>{symbol}</span>
    );
  };

  return (


    <div className="st-shell">
      {/* Header */}
      <div className="st-header">
        <div className="st-title-block">
          <span className="st-eyebrow">Analytics</span>
          <h1 className="st-title">Shows Overview</h1>
        </div>
        <div className="st-meta">
          <div className="st-stat">
            <span className="st-stat-value">{showsData.length}</span>
            <span className="st-stat-label">Total Shows</span>
          </div>
          <div className="st-divider" />
          <div className="st-stat">
            <span className="st-stat-value">
              {fmt.rev(showsData.reduce((a, s) => a + s.revenue, 0))}
            </span>
            <span className="st-stat-label">Total Revenue</span>
          </div>
          <div className="st-divider" />
          <div className="st-stat">
            <span className="st-stat-value">
              {fmt.subs(showsData.reduce((a, s) => a + s.subscribers, 0))}
            </span>
            <span className="st-stat-label">Subscribers</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="st-controls">
        <div className="st-search-wrap">
          <span className="st-search-icon">⌕</span>
          <input
            className="st-search"
            placeholder="Search shows…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="st-filters">
          {["All", "Active", "Pending", "Cancelled"].map((f) => (
            <button
              key={f}
              className={`st-filter-btn ${filter === f ? "selected" : ""} filter-${f.toLowerCase()}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="st-card">
        <div className="st-table-wrap">
          <table className="st-table">
            <thead>
              <tr>
                <th className="th-show">Show Name</th>
                <th
                  className="th-num sortable"
                  onClick={() => handleSort("subscribers")}
                >
                  Subscribers {sortIcon("subscribers")}

                </th>
                <th
                  className="th-num sortable"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue {sortIcon("revenue")}

                </th>
                <th className="th-status">Status</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="st-empty">
                    No shows match your filters.
                  </td>
                </tr>
              ) : (
                visible.map((show, i) => (
                  <tr
                    key={show.id}
                    className="st-row"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="td-show">
                      <div className="show-avatar">
                        {show.name.charAt(0)}
                      </div>
                      <div className="show-info">
                        <span className="show-name">{show.name}</span>
                        <span className="show-genre">{show.genre}</span>
                      </div>
                    </td>
                    <td className="td-num">
                      <span className="num-main">{fmt.subs(show.subscribers)}</span>
                      <span className={`num-change ${show.change >= 0 ? "pos" : "neg"}`}>
                        {show.change >= 0 ? "+" : ""}{show.change}%
                      </span>
                    </td>
                    <td className="td-num">
                      <span className="num-main">{fmt.rev(show.revenue)}</span>
                    </td>
                    <td className="td-status">
                      <span className={`badge badge-${show.status.toLowerCase()}`}>
                        <span className="badge-dot" />
                        {show.status}
                      </span>
                    </td>
                    <td className="td-action">
                      <div className="action-wrap">
                        <button className="btn-view">View</button>
                        <div className="action-more-wrap">
                          <button
                            className="btn-more"
                            onClick={() =>
                              setActionRow(actionRow === show.id ? null : show.id)
                            }
                          >
                            ···
                          </button>
                          {actionRow === show.id && (
                            <div className="dropdown">
                              <button className="dd-item" onClick={() => setActionRow(null)}>✏ Edit</button>
                              <button className="dd-item" onClick={() => setActionRow(null)}>📊 Analytics</button>
                              <button className="dd-item dd-danger" onClick={() => setActionRow(null)}>🗑 Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="st-footer">
          <span className="st-count">
            Showing <strong>{visible.length}</strong> of <strong>{showsData.length}</strong> shows
          </span>
          <div className="st-pagination">
            <button className="pg-btn" disabled>‹ Prev</button>
            <span className="pg-current">1</span>
            <button className="pg-btn" disabled>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
