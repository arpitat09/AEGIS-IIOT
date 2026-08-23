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
  { time: "10:00", threats: 12 },
  { time: "10:05", threats: 18 },
  { time: "10:10", threats: 15 },
  { time: "10:15", threats: 28 },
  { time: "10:20", threats: 24 },
  { time: "10:25", threats: 34 },
];

function ThreatTimeline() {
  return (
    <ChartCard title="Threat Timeline">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="threats"
            stroke="#2563EB"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default ThreatTimeline;