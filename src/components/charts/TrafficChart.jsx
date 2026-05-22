import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { trafficData } from "../../utils/dummyData";
import "./TrafficChart.css";

function TrafficChart() {
  return (
    <div className="traffic-chart">
      <h3>Traffic Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrafficChart;