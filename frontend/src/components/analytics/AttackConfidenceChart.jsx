import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import ChartCard from "../common/ChartCard";

const data = [
  { attack: "DDoS", confidence: 98 },
  { attack: "Bot", confidence: 94 },
  { attack: "Scan", confidence: 91 },
  { attack: "MITM", confidence: 89 },
];

function AttackConfidenceChart() {
  return (
    <ChartCard title="Attack Confidence">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="attack" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="confidence"
            fill="#22C55E"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default AttackConfidenceChart;