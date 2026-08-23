import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import ChartCard from "../common/ChartCard";

const data = [
  { attack: "DDoS", count: 45 },
  { attack: "Bot", count: 32 },
  { attack: "Port Scan", count: 28 },
  { attack: "Brute Force", count: 18 },
  { attack: "MITM", count: 12 },
];

function AttackStatistics() {
  return (
    <ChartCard title="Attack Statistics">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="attack" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default AttackStatistics;