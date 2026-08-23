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
  { feature: "Packet Size", value: 0.35 },
  { feature: "Flow Duration", value: 0.29 },
  { feature: "TCP Flags", value: 0.22 },
  { feature: "Protocol", value: 0.18 },
  { feature: "Dst Port", value: 0.14 },
];

function FeatureImportanceChart() {
  return (
    <ChartCard title="Feature Importance">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
        >
          <XAxis type="number" />
          <YAxis
            dataKey="feature"
            type="category"
            width={100}
          />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#2563EB"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default FeatureImportanceChart;