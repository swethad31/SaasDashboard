import "./PageLayout.css";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header__action">{action}</div>}
    </div>
  );
}

export function StatCard({ title, value, change, changeType, icon, color }) {
  const isPositive = changeType === "up";
  return (
    <div className="stat-card" style={{ "--card-accent": color || "var(--accent)" }}>
      <div className="stat-card__top">
        <span className="stat-card__label">{title}</span>
        <span className="stat-card__icon">{icon}</span>
      </div>
      <div className="stat-card__value">{value}</div>
      {change && (
        <div className={`stat-card__change stat-card__change--${changeType}`}>
          <span>{isPositive ? "▲" : "▼"}</span> {change}
        </div>
      )}
    </div>
  );
}

export function Card({ children, className = "", title, action }) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ children, color }) {
  const colors = {
    green: { bg: "rgba(110,231,183,0.15)", color: "var(--accent)" },
    blue: { bg: "rgba(56,189,248,0.15)", color: "var(--accent-blue)" },
    purple: { bg: "rgba(129,140,248,0.15)", color: "var(--accent-2)" },
    orange: { bg: "rgba(251,146,60,0.15)", color: "var(--accent-orange)" },
    pink: { bg: "rgba(244,114,182,0.15)", color: "var(--accent-3)" },
    red: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  };
  const s = colors[color] || colors.green;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}

export function Btn({ children, onClick, variant = "primary", size = "md", style }) {
  return (
    <button onClick={onClick} className={`btn btn--${variant} btn--${size}`} style={style}>
      {children}
    </button>
  );
}
