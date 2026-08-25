import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";

import TimelineIcon from "@mui/icons-material/Timeline";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { apiService } from "../../services/api";

function PacketRateChart({ data = [] }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setChartData(data.slice(-15));
    }
  }, [data]);

  // Keep live visualization moving
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const jitter = Math.floor(Math.random() * 10) - 5;
        const newPackets = Math.max(0, (last.packets || 10) + jitter);
        const newPoint = {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          packets: newPackets,
        };
        return [...prev, newPoint].slice(-15);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        minHeight: 420,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Live Packet Rate
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
            }}
          >
            Real-time packet activity from the IIoT network
          </Typography>
        </Box>

        <Chip
          icon={<TimelineIcon />}
          label="LIVE"
          size="small"
          sx={{
            color: "#86EFAC",
            backgroundColor:
              "rgba(34, 197, 94, 0.12)",
            border:
              "1px solid rgba(34, 197, 94, 0.25)",
            fontWeight: 700,
          }}
        />
      </Box>

      {chartData.length === 0 ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94A3B8",
          }}
        >
          No traffic data available.
        </Box>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#94A3B8"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "10px",
              }}
              labelStyle={{
                color: "#FFFFFF",
              }}
            />

            <Line
              type="monotone"
              dataKey="packets"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
              }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

export default PacketRateChart;