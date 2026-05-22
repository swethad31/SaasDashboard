import { useState } from "react";
import "./RequestCard.css";

/* ─── Activity Types ─────────────────────────────────────────────────────── */
const TYPE_META = {
  subscription: {
    label: "New Subscription",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 7v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.5 4.5l1 1M13.5 4.5l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    colorVar: "--rc-cyan",
  },
  payment: {
    label: "Payment Received",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="5.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="5" y="11" width="3" height="2" rx="0.5" fill="currentColor"/>
      </svg>
    ),
    colorVar: "--rc-green",
  },
  upgrade: {
    label: "Plan Upgraded",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 14V6M10 6l-3 3M10 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 17h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    colorVar: "--rc-violet",
  },
  expired: {
    label: "Subscription Expired",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    colorVar: "--rc-rose",
  },
};

/* ─── Sample Data ────────────────────────────────────────────────────────── */
const DEFAULT_ACTIVITIES = [
  { id: 1,  type: "subscription", title: "Acme Corp joined Pro plan",          time: "Just now",    user: "AC" },
  { id: 2,  type: "payment",      title: "$1,200 received from NovaTech",       time: "2 min ago",   user: "NT" },
  { id: 3,  type: "upgrade",      title: "Starling Inc. upgraded to Enterprise", time: "14 min ago",  user: "SI" },
  { id: 4,  type: "expired",      title: "Lumen Ltd. trial has expired",        time: "1 hr ago",    user: "LL" },
  { id: 5,  type: "payment",      title: "$340 received from Helix AI",         time: "3 hr ago",    user: "HA" },
  { id: 6,  type: "subscription", title: "Qubit Labs joined Starter plan",      time: "5 hr ago",    user: "QL" },
  { id: 7,  type: "upgrade",      title: "Dawnfield Co. upgraded to Pro",       time: "Yesterday",   user: "DC" },
  { id: 8,  type: "expired",      title: "Prism Studio subscription lapsed",    time: "Yesterday",   user: "PS" },
  { id: 9,  type: "payment",      title: "$890 received from CoreVault",        time: "2 days ago",  user: "CV" },
  { id: 10, type: "subscription", title: "Echo Systems joined Enterprise",       time: "3 days ago",  user: "ES" },
];

/* ─── Single Activity Row ────────────────────────────────────────────────── */
function ActivityRow({ activity, index, isLast }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[activity.type];

  return (
    <li
      className={`rc-row ${hovered ? "rc-row--hovered" : ""}`}
      style={{ animationDelay: `${index * 55}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Timeline connector */}
      <div className="rc-timeline">
        <div className={`rc-icon-wrap rc-icon-wrap--${activity.type}`}
          style={{ color: `var(${meta.colorVar})` }}>
          <span className="rc-icon-pulse" />
          <span className="rc-icon-inner">{meta.icon}</span>
        </div>
        {!isLast && <div className="rc-connector" />}
      </div>

      {/* Content */}
      <div className="rc-content">
        <div className="rc-content-top">
          <div className="rc-label-row">
            <span className={`rc-type-badge rc-type-badge--${activity.type}`}>
              {meta.label}
            </span>
          </div>
          <span className="rc-time">{activity.time}</span>
        </div>
        <p className="rc-title">{activity.title}</p>

        {/* User chip */}
        <div className="rc-footer-row">
          <div className={`rc-avatar rc-avatar--${activity.type}`}>
            {activity.user}
          </div>
          <span className="rc-action-link">View details →</span>
        </div>
      </div>
    </li>
  );
}

/* ─── RequestCard ────────────────────────────────────────────────────────── */
export default function RequestCard({
  activities = DEFAULT_ACTIVITIES,
  title = "Recent Activity",
  maxVisible = 10,
}) {
  const [filter, setFilter] = useState("all");

  const filtered = activities
    .filter((a) => filter === "all" || a.type === filter)
    .slice(0, maxVisible);

  const counts = activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const filters = [
    { key: "all",          label: "All",        count: activities.length },
    { key: "subscription", label: "Subs",       count: counts.subscription || 0 },
    { key: "payment",      label: "Payments",   count: counts.payment || 0 },
    { key: "upgrade",      label: "Upgrades",   count: counts.upgrade || 0 },
    { key: "expired",      label: "Expired",    count: counts.expired || 0 },
  ];

  return (
    <div className="rc-card">
      {/* Ambient glow orbs */}
      <span className="rc-orb rc-orb--tl" aria-hidden="true" />
      <span className="rc-orb rc-orb--br" aria-hidden="true" />

      {/* Header */}
      <div className="rc-header">
        <div className="rc-header-left">
          <span className="rc-live-dot" aria-label="Live" />
          <h2 className="rc-heading">{title}</h2>
        </div>
        <span className="rc-count-badge">{filtered.length} events</span>
      </div>

      {/* Filter pills */}
      <div className="rc-filters" role="tablist">
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className={`rc-filter-pill ${filter === f.key ? `rc-filter-pill--active rc-filter-pill--${f.key}` : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="rc-pill-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="rc-scroll-area">
        {filtered.length === 0 ? (
          <div className="rc-empty">
            <span className="rc-empty-icon">◎</span>
            <p>No activity in this category.</p>
          </div>
        ) : (
          <ul className="rc-list">
            {filtered.map((activity, i) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                index={i}
                isLast={i === filtered.length - 1}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="rc-card-footer">
        <button className="rc-view-all">
          View full history
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
