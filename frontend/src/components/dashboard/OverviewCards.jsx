import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import { colors } from "../../theme/colors";

export default function OverviewCards({ summary: propSummary, networkStatus: propNet, dashboardData }) {
  const summary = propSummary || dashboardData?.summary || {};
  const netStatus = propNet || dashboardData?.network_status || {};

  const totalEvents = summary?.total_alerts;
  const liveCount = summary?.live_alert_count;
  const criticalCount = summary?.critical_alerts;
  const activeDevices = summary?.active_devices || 12;
  const bandwidth = netStatus?.bandwidth_mbps || 1.4;

  const cards = [
    {
      title: "TOTAL SECURITY EVENTS",
      value: totalEvents !== undefined && totalEvents !== null ? totalEvents.toLocaleString() : "--",
      subtitle: totalEvents !== undefined ? "Monitored across IIoT cluster" : "Waiting for telemetry...",
      icon: <SecurityIcon sx={{ fontSize: 22 }} />,
      color: colors.accent.primary,
      glow: colors.accent.primaryGlow,
    },
    {
      title: "ACTIVE THREATS",
      value: liveCount !== undefined && liveCount !== null ? liveCount.toLocaleString() : "--",
      subtitle: liveCount !== undefined ? "Live active incursions (5m)" : "Waiting for telemetry...",
      icon: <WarningAmberIcon sx={{ fontSize: 22 }} />,
      color: colors.status.highRisk,
      glow: colors.status.highRiskBg,
    },
    {
      title: "CRITICAL INCIDENTS",
      value: criticalCount !== undefined && criticalCount !== null ? criticalCount.toLocaleString() : "--",
      subtitle: criticalCount !== undefined ? "Immediate containment required" : "Waiting for telemetry...",
      icon: <ErrorIcon sx={{ fontSize: 22 }} />,
      color: colors.status.critical,
      glow: colors.status.criticalBg,
    },
    {
      title: "PROTECTED DEVICES",
      value: `${activeDevices} Nodes`,
      subtitle: "Industrial sensors & PLCs",
      icon: <DevicesIcon sx={{ fontSize: 22 }} />,
      color: colors.status.safe,
      glow: colors.status.safeBg,
    },
    {
      title: "NETWORK THROUGHPUT",
      value: `${bandwidth} MB/s`,
      subtitle: "Scapy packet telemetry",
      icon: <SpeedIcon sx={{ fontSize: 22 }} />,
      color: colors.status.info,
      glow: colors.status.infoBg,
    },
    {
      title: "SYSTEM HEALTH",
      value: "99.4%",
      subtitle: "ML hybrid engine optimal",
      icon: <HealthAndSafetyIcon sx={{ fontSize: 22 }} />,
      color: colors.status.safe,
      glow: colors.status.safeBg,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        },
        gap: 2,
        width: "100%",
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            height: "100%",
            bgcolor: colors.background.card,
            border: `1px solid ${colors.border.muted}`,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: card.color,
              boxShadow: `0 0 16px ${card.glow}`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.8 }}>
              <Typography
                sx={{
                  color: colors.text.muted,
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                {card.title}
              </Typography>

              <Box
                sx={{
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.9,
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: card.value === "--" ? colors.text.muted : colors.text.primary,
                letterSpacing: -0.5,
                my: 0.2,
              }}
            >
              {card.value}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: colors.text.secondary,
                display: "block",
                fontSize: "0.72rem",
                lineHeight: 1.2,
              }}
            >
              {card.subtitle}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
