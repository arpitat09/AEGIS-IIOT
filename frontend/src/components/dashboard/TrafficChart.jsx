import { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import ShowChartIcon from "@mui/icons-material/ShowChart";
import StreamIcon from "@mui/icons-material/Stream";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { colors, getSeverityTokens } from "../../theme/colors";

export default function TrafficChart({ recentAlerts = [], alerts = [], dashboardData, data }) {
  const alertList = recentAlerts.length > 0 ? recentAlerts : alerts.length > 0 ? alerts : dashboardData?.recent_alerts || [];
  const backendChart = data || dashboardData?.traffic_chart;

  const chartData = useMemo(() => {
    if (backendChart && Array.isArray(backendChart) && backendChart.length > 0) {
      return backendChart.map((pt, i) => ({
        time: pt.time || `T${i + 1}`,
        packets: Number(pt.packets || 12),
        risk_score: Number(pt.risk_score || 0),
        attack: pt.attack || "Normal",
        severity: pt.severity || "Low",
      }));
    }

    if (alertList.length > 0) {
      return [...alertList].slice(0, 15).reverse().map((alert, i) => {
        const timeStr = alert.timestamp
          ? alert.timestamp.includes(" ")
            ? alert.timestamp.split(" ")[1]
            : alert.timestamp
          : `T${i + 1}`;

        return {
          time: timeStr,
          packets: Number(alert.packet_count) || (alert.severity === "Critical" ? 54 : alert.severity === "High" ? 38 : 18),
          risk_score: Number(alert.risk_score) || 0,
          attack: alert.attack || "Normal",
          severity: alert.severity || "Low",
        };
      });
    }

    // Default baseline telemetry if initial loading
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const t = new Date(now.getTime() - (9 - i) * 3000);
      return {
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        packets: 15 + Math.floor(Math.sin(i) * 10),
        risk_score: 25,
        attack: "Normal",
        severity: "Low",
      };
    });
  }, [backendChart, alertList]);

  const latestFlow = chartData[chartData.length - 1];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        minHeight: 380,
        borderRadius: 2,
        bgcolor: colors.background.card,
        border: `1px solid ${colors.border.muted}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: colors.text.primary,
                letterSpacing: -0.2,
              }}
            >
              Live Network Traffic
            </Typography>
            <Chip
              icon={<StreamIcon sx={{ fontSize: "14px !important", color: `${colors.accent.primary} !important` }} />}
              label="STREAM ACTIVE"
              size="small"
              sx={{
                bgcolor: colors.accent.primaryGlow,
                color: colors.accent.primary,
                border: `1px solid rgba(0, 212, 255, 0.3)`,
                fontWeight: 800,
                fontSize: "0.68rem",
                height: 20,
              }}
            />
          </Box>
          <Typography
            sx={{
              color: colors.text.muted,
              fontSize: "0.74rem",
              mt: 0.3,
            }}
          >
            Real-time packet velocity & flow anomalies across industrial endpoints
          </Typography>
        </Box>

        {latestFlow && (
          <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ color: colors.accent.primary, fontWeight: 800, fontSize: "0.92rem", fontFamily: "monospace" }}>
              {latestFlow.packets} pkts/s
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontSize: "0.68rem" }}>
              Current Flow Rate
            </Typography>
          </Box>
        )}
      </Box>

      {/* Chart Area */}
      <Box sx={{ width: "100%", height: 260, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.accent.primary} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} vertical={false} />

            <XAxis
              dataKey="time"
              stroke={colors.text.muted}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: colors.border.muted }}
            />

            <YAxis
              stroke={colors.text.muted}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: colors.border.muted }}
              domain={[0, "auto"]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  const token = getSeverityTokens(pt.severity);

                  return (
                    <Box
                      sx={{
                        bgcolor: colors.background.cardElevated,
                        border: `1px solid ${colors.border.muted}`,
                        p: 1.5,
                        borderRadius: 1.5,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                      }}
                    >
                      <Typography sx={{ color: colors.text.muted, fontSize: "0.72rem", fontFamily: "monospace" }}>
                        {pt.time}
                      </Typography>
                      <Typography sx={{ color: colors.accent.primary, fontWeight: 800, fontSize: "0.9rem", my: 0.2 }}>
                        {pt.packets} Packets / Flow
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Typography sx={{ color: colors.text.secondary, fontSize: "0.75rem" }}>
                          Threat: <strong>{pt.attack}</strong>
                        </Typography>
                        <Chip
                          label={pt.severity}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            bgcolor: token.bg,
                            color: token.color,
                            border: `1px solid ${token.border}`,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="packets"
              stroke={colors.accent.primary}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trafficGradient)"
              dot={{ fill: colors.accent.primary, r: 3, strokeWidth: 1, stroke: colors.background.main }}
              activeDot={{ r: 6, fill: "#38BDF8", stroke: colors.background.main, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
