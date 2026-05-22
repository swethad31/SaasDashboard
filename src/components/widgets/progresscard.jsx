import { useEffect, useRef, useState } from "react";
import "./ProgressCard.css";

/**
 * ProgressCard — Premium SaaS analytics card
 *
 * Props:
 *   title      {string}  — Card heading (e.g. "Monthly Revenue")
 *   value      {string}  — Primary display value (e.g. "$48,200")
 *   percentage {number}  — 0–100, drives the progress bar
 *   subtitle   {string}  — Small descriptive line below the bar
 *   accent     {string}  — Optional CSS color override for the bar accent
 *   trend      {"up"|"down"|"neutral"} — Arrow indicator next to percentage
 */
export default function ProgressCard({
  title     = "Monthly Revenue",
  value     = "$48,200",
  percentage = 73,
  subtitle   = "↑ 12.4% vs last month",
  accent,
  trend      = "up",
}) {
  const pct = Math.min(100, Math.max(0, percentage));
  const barRef  = useRef(null);
  const cardRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  /* Trigger bar animation when card enters viewport */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Apply optional accent color via inline custom property */
  const cardStyle = accent ? { "--pc-accent": accent } : {};

  const trendClass =
    trend === "up" ? "pc-trend--up" :
    trend === "down" ? "pc-trend--down" : "pc-trend--neutral";

  return (
    <div className="pc-card" ref={cardRef} style={cardStyle}>
      {/* Decorative corner glow */}
      <span className="pc-glow" aria-hidden="true" />

      {/* Top row: title + trend badge */}
      <div className="pc-top">
        <span className="pc-title">{title}</span>
        <span className={`pc-trend ${trendClass}`}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "●"}
        </span>
      </div>

      {/* Value */}
      <p className="pc-value">{value}</p>

      {/* Progress section */}
      <div className="pc-progress-block">
        <div className="pc-bar-header">
          <span className="pc-bar-label">Progress</span>
          <span className="pc-pct">{pct}%</span>
        </div>

        {/* Track */}
        <div className="pc-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          {/* Fill */}
          <div
            ref={barRef}
            className={`pc-fill ${animated ? "pc-fill--animate" : ""}`}
            style={{ "--pct": `${pct}%` }}
          >
            {/* Traveling shimmer */}
            <span className="pc-shimmer" aria-hidden="true" />
          </div>

          {/* Milestone ticks */}
          {[25, 50, 75].map((m) => (
            <span
              key={m}
              className={`pc-tick ${pct >= m ? "pc-tick--passed" : ""}`}
              style={{ left: `${m}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="pc-subtitle">{subtitle}</p>
      </div>

      {/* Bottom stats row */}
      <div className="pc-footer">
        <div className="pc-stat">
          <span className="pc-stat-num">{pct}%</span>
          <span className="pc-stat-label">Complete</span>
        </div>
        <div className="pc-sep" />
        <div className="pc-stat">
          <span className="pc-stat-num">{100 - pct}%</span>
          <span className="pc-stat-label">Remaining</span>
        </div>
        <div className="pc-sep" />
        <div className="pc-stat">
          <span className="pc-stat-num">
            {pct >= 75 ? "On Track" : pct >= 40 ? "In Progress" : "Early"}
          </span>
          <span className="pc-stat-label">Status</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Demo wrapper (remove in production) ─────────────────────────────────── */
export function ProgressCardDemo() {
  const cards = [
    {
      title: "Monthly Revenue",
      value: "$48,200",
      percentage: 73,
      subtitle: "↑ 12.4% compared to last month",
      trend: "up",
    },
    {
      title: "Active Subscribers",
      value: "24,610",
      percentage: 58,
      subtitle: "↑ 8.1% new sign-ups this cycle",
      accent: "#38bdf8",
      trend: "up",
    },
    {
      title: "Churn Rate",
      value: "3.2%",
      percentage: 32,
      subtitle: "↓ 0.5% below monthly target",
      accent: "#fb7185",
      trend: "down",
    },
    {
      title: "Campaign Goal",
      value: "Step 4 / 6",
      percentage: 67,
      subtitle: "On schedule · 2 milestones left",
      accent: "#c084fc",
      trend: "neutral",
    },
  ];

  return (
    <div className="pc-demo-shell">
      <div className="pc-demo-grid">
        {cards.map((c, i) => (
          <ProgressCard key={i} {...c} />
        ))}
      </div>
    </div>
  );
}
