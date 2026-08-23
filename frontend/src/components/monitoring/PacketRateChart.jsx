import { Paper, Typography } from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
 Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { time: "10:00", packets: 200 },
  { time: "10:05", packets: 350 },
  { time: "10:10", packets: 420 },
  { time: "10:15", packets: 510 },
  { time: "10:20", packets: 620 },
  { time: "10:25", packets: 480 },
  { time: "10:30", packets: 720 },
];

function PacketRateChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 360,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h6" mb={3}>
        Live Packet Rate
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="packets"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PacketRateChart;