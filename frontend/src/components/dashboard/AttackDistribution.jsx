import {
  Paper,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "DDoS", value: 40 },
  { name: "DoS", value: 25 },
  { name: "Bot", value: 18 },
  { name: "Brute Force", value: 10 },
  { name: "Normal", value: 7 },
];

const COLORS = [
  "#2563EB",
  "#DC2626",
  "#F59E0B",
  "#16A34A",
  "#9333EA",
];

function AttackDistribution() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 340,
      }}
    >
      <Typography
        variant="h6"
        mb={3}
      >
        Attack Distribution
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
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
    </Paper>
  );
}

export default AttackDistribution;