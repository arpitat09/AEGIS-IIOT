import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import ChartCard from "../common/ChartCard";

const data = [
  { month: "Jan", threats: 40 },
  { month: "Feb", threats: 55 },
  { month: "Mar", threats: 48 },
  { month: "Apr", threats: 72 },
  { month: "May", threats: 60 },
  { month: "Jun", threats: 80 },
];

function MonthlyTrend() {
  return (
    <ChartCard title="Monthly Threat Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="threats"
            stroke="#22C55E"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default MonthlyTrend;