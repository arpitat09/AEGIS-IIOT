import {
  Paper,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { time: "10:00", packets: 420 },
  { time: "10:05", packets: 620 },
  { time: "10:10", packets: 510 },
  { time: "10:15", packets: 820 },
  { time: "10:20", packets: 700 },
  { time: "10:25", packets: 980 },
];

function TrafficChart() {
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
        Live Traffic
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="packets"
            stroke="#2563EB"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default TrafficChart;