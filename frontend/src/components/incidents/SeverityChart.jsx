import { Box, Paper, Typography } from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const severityColors = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

function SeverityChart({ incidents = [] }) {
  const severityData = [
    {
      name: "Critical",
      value: incidents.filter(
        (incident) => incident.severity === "Critical"
      ).length,
    },
    {
      name: "High",
      value: incidents.filter(
        (incident) => incident.severity === "High"
      ).length,
    },
    {
      name: "Medium",
      value: incidents.filter(
        (incident) => incident.severity === "Medium"
      ).length,
    },
    {
      name: "Low",
      value: incidents.filter(
        (incident) => incident.severity === "Low"
      ).length,
    },
  ];

  const chartData = severityData.filter(
    (item) => item.value > 0
  );

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        border: "1px solid #1F2937",
        minHeight: 420,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: "#F8FAFC",
        }}
      >
        Incident Severity Distribution
      </Typography>

      <Typography
        sx={{
          mb: 3,
          color: "#94A3B8",
          fontSize: "0.9rem",
        }}
      >
        Real-time distribution of detected threats
      </Typography>

      {chartData.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={severityColors[entry.name]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#F8FAFC",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#94A3B8",
            }}
          >
            No severity data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default SeverityChart;