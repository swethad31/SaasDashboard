import "./StatsCard.css";

const Statscard = ({
  title,
  value,
  subtitle,
  icon
}) => {
  return (
    <div className="stats-card">

      <div className="stats-header">

        <div>
          <h4 className="stats-title">
            {title}
          </h4>

          <h2 className="stats-value">
            {value}
          </h2>
        </div>

        <div className="stats-icon">
          {icon}
        </div>

      </div>

      <p className="stats-subtitle">
        {subtitle}
      </p>

    </div>
  );
};

export default Statscard;