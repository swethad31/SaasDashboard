// src/components/charts/GrowthChart.jsx


import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./GrowthChart.css";

// ─── Default dummy data (Jan–Dec) ────────────────────────────────────────────
// Each object is one data point on the X-axis (one month).
// "subscribers" is the value plotted on the Y-axis.
const DEFAULT_DATA = [
  { month: "Jan", subscribers: 7500000 },
  { month: "Feb", subscribers: 7800000 },
  { month: "Mar", subscribers: 8100000 },
  { month: "Apr", subscribers: 8600000 },
  { month: "May", subscribers: 8860000 }, // peak – matches the screenshot
  { month: "Jun", subscribers: 8400000 },
  { month: "Jul", subscribers: 8000000 },
  { month: "Aug", subscribers: 8200000 },
  { month: "Sep", subscribers: 8500000 },
  { month: "Oct", subscribers: 8700000 },
  { month: "Nov", subscribers: 9000000 },
  { month: "Dec", subscribers: 9300000 },
];

// ─── Helper: format large numbers on the Y-axis ───────────────────────────────
// e.g. 9000000 → "9.0 M"
const formatYAxis = (value) => `${(value / 1_000_000).toFixed(1)} M`;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
// Recharts calls this component whenever the user hovers over a data point.
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="gc-tooltip">
        <p className="gc-tooltip-label">{label}</p>
        <p className="gc-tooltip-value">
          {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * GrowthChart
 *
 * Props (all optional — sensible defaults are provided):
 *   data      {Array}  – Array of { month, subscribers } objects
 *   title     {string} – Chart heading text
 *   height    {number} – Chart canvas height in px (default 260)
 *   lineColor {string} – Stroke colour of the line (default hot-pink)
 */
const GrowthChart = ({
  data = DEFAULT_DATA,
  title = "Subscriber Growth",
  height = 260,
  lineColor = "#ff2d6f",
}) => {
  return (
    <div className="gc-card">
      {/* ── Header ── */}
      <div className="gc-header">
        <h2 className="gc-title">{title}</h2>
        <span className="gc-badge">Months ▾</span>
      </div>

      {/* ── Chart ── */}
      {/*
        ResponsiveContainer makes the chart fill its parent width.
        width="100%" means "use all available horizontal space".
        height is controlled by the `height` prop.
      */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
        >
          {/*
            defs lets us define a reusable SVG gradient.
            We reference it below via fill="url(#growthGradient)".
          */}
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/*
            CartesianGrid draws the faint horizontal/vertical guide lines.
            strokeDasharray="3 3" makes them dashed.
          */}
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          {/*
            XAxis reads the "month" key from each data object.
            dataKey tells Recharts which field to use for the X labels.
          */}
          <XAxis
            dataKey="month"
            tick={{ fill: "#8a8fa8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/*
            YAxis displays the subscriber count on the left.
            tickFormatter converts raw numbers to "9.0 M" style labels.
          */}
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: "#8a8fa8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />

          {/*
            Tooltip shows a popup when hovering.
            We swap in our own styled CustomTooltip component.
          */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,45,111,0.3)", strokeWidth: 1 }} />

          {/*
            Area is the actual chart line + filled region.
              type="monotone"  → smooth curved line
              dataKey          → which field to plot on Y-axis
              stroke           → line colour
              fill             → gradient fill under the line
              strokeWidth      → line thickness
              dot              → false hides the dots on each data point
          */}
          <Area
            type="monotone"
            dataKey="subscribers"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#growthGradient)"
            dot={false}
            activeDot={{ r: 5, fill: lineColor, stroke: "#1a1d2e", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
