import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import ChartCard from "../common/ChartCard";

const data = [
  { name: "Critical", value: 12 },
  { name: "High", value: 20 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 18 },
];

const COLORS = [
  "#EF4444",
  "#F59E0B",
  "#2563EB",
  "#22C55E",
];

function SeverityChart() {
  return (
    <ChartCard title="Incident Severity">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default SeverityChart;