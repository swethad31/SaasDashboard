import { useState, useEffect, useRef } from "react";
import "./LicenseCard.css";

/* ─── Plan Tier Definitions ──────────────────────────────────────────────── */
const PLAN_META = {
  starter: {
    tier:      "Starter",
    price:     "$12",
    period:    "/ month",
    color:     "--lc-silver",
    colorDim:  "--lc-silver-dim",
    seats:     "1 seat",
    api:       "10k API calls",
    support:   "Community",
    chipRows:  ["▪▪▪▪ ▪▪▪▪", "▪▪▪▪ ▪▪▪▪"],
  },
  pro: {
    tier:      "Pro",
    price:     "$49",
    period:    "/ month",
    color:     "--lc-gold",
    colorDim:  "--lc-gold-dim",
    seats:     "5 seats",
    api:       "500k API calls",
    support:   "Priority email",
    chipRows:  ["▪▪▪▪ ▪▪▪▪", "▪▪▪▪ ▪▪▪▪"],
  },
  enterprise: {
    tier:      "Enterprise",
    price:     "Custom",
    period:    "pricing",
    color:     "--lc-cyan",
    colorDim:  "--lc-cyan-dim",
    seats:     "Unlimited seats",
    api:       "Unlimited API calls",
    support:   "Dedicated SLA",
    chipRows:  ["▪▪▪▪ ▪▪▪▪", "▪▪▪▪ ▪▪▪▪"],
  },
};

/* ─── Status Config ──────────────────────────────────────────────────────── */
const STATUS_META = {
  active:   { label: "Active",   cls: "lc-badge--active"   },
  expiring: { label: "Expiring", cls: "lc-badge--expiring" },
  expired:  { label: "Expired",  cls: "lc-badge--expired"  },
  trial:    { label: "Trial",    cls: "lc-badge--trial"    },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/* ─── Holographic tilt effect ────────────────────────────────────────────── */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      el.style.setProperty("--tilt-x",  `${(-dy * 8).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y",  `${ (dx * 8).toFixed(2)}deg`);
      el.style.setProperty("--shine-x", `${((dx + 1) / 2 * 100).toFixed(1)}%`);
      el.style.setProperty("--shine-y", `${((dy + 1) / 2 * 100).toFixed(1)}%`);
    }

    function onLeave() {
      el.style.setProperty("--tilt-x",  "0deg");
      el.style.setProperty("--tilt-y",  "0deg");
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

/* ─── LicenseCard ────────────────────────────────────────────────────────── */
export default function LicenseCard({
  plan          = "pro",
  status        = "active",
  renewalDate   = "2025-09-14",
  licenseKey    = "PRO-X7K2-9MQN-4TRV",
  holderName    = "Acme Corporation",
  onUpgrade,
  onManage,
}) {
  const cardRef    = useRef(null);
  const [copied, setCopied]   = useState(false);
  const [flipped, setFlipped] = useState(false);
  useTilt(cardRef);

  const meta   = PLAN_META[plan]   || PLAN_META.pro;
  const status_ = STATUS_META[status] || STATUS_META.active;
  const days   = daysUntil(renewalDate);
  const isExpiring = days <= 14 && status !== "expired";

  function copyKey() {
    navigator.clipboard?.writeText(licenseKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="lc-scene">
      <div
        className={`lc-flip-container ${flipped ? "lc-flip-container--flipped" : ""}`}
      >

        {/* ── FRONT ─────────────────────────────────────────────────────── */}
        <div
          className={`lc-card lc-card--front lc-card--${plan}`}
          ref={cardRef}
          style={{ "--plan-color": `var(${meta.color})`, "--plan-color-dim": `var(${meta.colorDim})` }}
        >
          {/* Holographic shine layer */}
          <span className="lc-shine" aria-hidden="true" />
          {/* Noise grain overlay */}
          <span className="lc-grain" aria-hidden="true" />
          {/* Geometric accent arcs */}
          <span className="lc-arc lc-arc--1" aria-hidden="true" />
          <span className="lc-arc lc-arc--2" aria-hidden="true" />

          {/* Row 1: Logo + Status badge */}
          <div className="lc-row lc-row--top">
            <div className="lc-brand">
              <span className="lc-brand-mark">✦</span>
              <span className="lc-brand-name">NovaDash</span>
            </div>
            <span className={`lc-badge ${status_.cls}`}>
              <span className="lc-badge-dot" />
              {status_.label}
            </span>
          </div>

          {/* Chip + tier */}
          <div className="lc-chip-row">
            <div className="lc-chip">
              <div className="lc-chip-inner">
                <span className="lc-chip-line">{meta.chipRows[0]}</span>
                <span className="lc-chip-line">{meta.chipRows[1]}</span>
              </div>
            </div>
            <div className="lc-tier-block">
              <span className="lc-tier-label">Current Plan</span>
              <span className="lc-tier-name">{meta.tier}</span>
            </div>
          </div>

          {/* Holder */}
          <div className="lc-holder">
            <span className="lc-holder-label">License Holder</span>
            <span className="lc-holder-name">{holderName}</span>
          </div>

          {/* Row: Renewal + Price */}
          <div className="lc-info-row">
            <div className="lc-info-cell">
              <span className="lc-info-label">Renews</span>
              <span className={`lc-info-value ${isExpiring ? "lc-info-value--warn" : ""}`}>
                {status === "expired" ? "Expired" : formatDate(renewalDate)}
              </span>
              {isExpiring && (
                <span className="lc-days-pill">{days}d left</span>
              )}
            </div>
            <div className="lc-info-cell lc-info-cell--right">
              <span className="lc-info-label">Billing</span>
              <span className="lc-info-value">
                <strong className="lc-price">{meta.price}</strong>
                <span className="lc-period">{meta.period}</span>
              </span>
            </div>
          </div>

          {/* Flip button */}
          <button
            className="lc-flip-btn"
            onClick={() => setFlipped(true)}
            aria-label="Show license details"
            title="View license key"
          >
            ↻
          </button>
        </div>

        {/* ── BACK ──────────────────────────────────────────────────────── */}
        <div className={`lc-card lc-card--back lc-card--${plan}`}
          style={{ "--plan-color": `var(${meta.color})`, "--plan-color-dim": `var(${meta.colorDim})` }}
        >
          <span className="lc-grain" aria-hidden="true" />
          <span className="lc-arc lc-arc--1" aria-hidden="true" />

          {/* Magnetic stripe */}
          <div className="lc-stripe" aria-hidden="true" />

          <div className="lc-back-body">
            <p className="lc-back-label">License Key</p>
            <div className="lc-key-block">
              <code className="lc-key">{licenseKey}</code>
              <button
                className={`lc-copy-btn ${copied ? "lc-copy-btn--copied" : ""}`}
                onClick={copyKey}
                aria-label="Copy license key"
              >
                {copied ? "✓" : "⧉"}
              </button>
            </div>

            {/* Features */}
            <ul className="lc-features">
              {[meta.seats, meta.api, `Support: ${meta.support}`].map((f) => (
                <li key={f} className="lc-feature-item">
                  <span className="lc-feature-check">✦</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Back-flip button */}
          <button
            className="lc-flip-btn"
            onClick={() => setFlipped(false)}
            aria-label="Back to card front"
            title="Back"
          >
            ↺
          </button>
        </div>
      </div>

      {/* ── Action buttons (below card) ────────────────────────────────── */}
      <div className="lc-actions">
        <button
          className={`lc-btn lc-btn--upgrade lc-btn--${plan}`}
          onClick={onUpgrade}
        >
          <span className="lc-btn-shimmer" aria-hidden="true" />
          <span className="lc-btn-icon">⬆</span>
          Upgrade Plan
        </button>
        <button
          className="lc-btn lc-btn--manage"
          onClick={onManage}
        >
          Manage Billing
        </button>
      </div>

      {/* ── Mini plan strip ────────────────────────────────────────────── */}
      <div className="lc-plan-strip">
        {Object.entries(PLAN_META).map(([key, p]) => (
          <div
            key={key}
            className={`lc-plan-pill ${plan === key ? "lc-plan-pill--active" : ""} lc-plan-pill--${key}`}
          >
            <span className="lc-plan-dot" />
            {p.tier}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Demo ───────────────────────────────────────────────────────────────── */
export function LicenseCardDemo() {
  return (
    <div className="lc-demo-shell">
      <div className="lc-demo-grid">
        <LicenseCard plan="starter" status="trial"    renewalDate="2025-06-10" holderName="Solo Dev"         licenseKey="STR-A1B2-C3D4-E5F6" />
        <LicenseCard plan="pro"     status="active"   renewalDate="2025-09-14" holderName="Acme Corporation"  licenseKey="PRO-X7K2-9MQN-4TRV" />
        <LicenseCard plan="enterprise" status="active" renewalDate="2026-01-01" holderName="Skyline Systems" licenseKey="ENT-ZZ99-AABC-0001" />
      </div>
    </div>
  );
}
