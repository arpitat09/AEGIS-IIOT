import {
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { colors } from "../../theme/colors";
import EmptyState from "../common/EmptyState";

const ATTACK_PALETTE = {
  Probe: "#38BDF8", // Sky Blue
  DoS: "#EF4444", // Crimson
  R2L: "#F59E0B", // Amber
  U2R: "#A855F7", // Purple
  Normal: "#22C55E", // Emerald Green
  Other: "#64748B",
};

export default function AttackDistribution({ data = {}, dashboardData }) {
  const attackDist =
    Object.keys(data).length > 0
      ? data
      : dashboardData?.attack_distribution || {};

  const total = Object.values(attackDist).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const chartData = Object.entries(attackDist)
    .filter(([_, count]) => Number(count) > 0)
    .map(([attack, count]) => ({
      name: attack,
      value: Number(count),
      percentage: total > 0 ? ((Number(count) / total) * 100).toFixed(1) : "0.0",
      color: ATTACK_PALETTE[attack] || ATTACK_PALETTE.Other,
    }));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 420,
        borderRadius: 2,
        bgcolor: colors.background.card,
        border: `1px solid ${colors.border.muted}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.05rem",
            color: colors.text.primary,
          }}
        >
          Attack Distribution
        </Typography>
        <Typography
          sx={{
            color: colors.text.muted,
            fontSize: "0.74rem",
            mt: 0.3,
          }}
        >
          Classification of detected network activity
        </Typography>
      </Box>

      {/* Donut Chart or Empty State */}
      {chartData.length > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 1 }}>
          <Box sx={{ width: 170, height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={colors.background.card} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <Box
                          sx={{
                            bgcolor: colors.background.cardElevated,
                            border: `1px solid ${colors.border.muted}`,
                            p: 1.2,
                            borderRadius: 1.5,
                          }}
                        >
                          <Typography sx={{ color: d.color, fontWeight: 800, fontSize: "0.82rem" }}>
                            {d.name}
                          </Typography>
                          <Typography sx={{ color: colors.text.primary, fontSize: "0.75rem" }}>
                            Count: {d.value.toLocaleString()} ({d.percentage}%)
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      ) : (
        <EmptyState
          title="NO ATTACK DATA"
          description="No malicious activity detected in the selected period."
          height={180}
        />
      )}

      {/* Legend & Breakdown */}
      {chartData.length > 0 && (
        <Stack spacing={1} sx={{ bgcolor: "rgba(11, 18, 32, 0.6)", p: 1.5, borderRadius: 1.5, border: `1px solid ${colors.border.subtle}` }}>
          {chartData.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />
                <Typography sx={{ color: colors.text.primary, fontSize: "0.78rem", fontWeight: 600 }}>
                  {item.name}
                </Typography>
              </Box>

              <Typography sx={{ color: colors.text.secondary, fontSize: "0.78rem", fontFamily: "monospace" }}>
                {item.value.toLocaleString()} <span style={{ color: colors.text.muted }}>({item.percentage}%)</span>
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
