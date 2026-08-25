import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Chip,
  Grid,
  Divider,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import ShieldIcon from "@mui/icons-material/Shield";

import { colors, getThreatLevelConfig } from "../../theme/colors";

export default function ThreatGauge({ dashboardData, summary: propSummary, alerts: propAlerts }) {
  const summary = propSummary || dashboardData?.summary || {};
  const alerts = propAlerts || dashboardData?.recent_alerts || [];
  const threatIntel = dashboardData?.threat_level || {};

  // Extract score
  const threatScore =
    threatIntel.score !== undefined
      ? Number(threatIntel.score)
      : !isNaN(Number(summary?.average_risk_score)) && Number(summary?.average_risk_score) > 0
      ? Math.round(Number(summary.average_risk_score))
      : alerts.length > 0
      ? Math.round(
          alerts.reduce((total, a) => total + (Number(a.risk_score) || 0), 0) / alerts.length
        )
      : 0;

  const levelConfig = getThreatLevelConfig(threatScore);
  const trendText = threatIntel.trend || "— Stable compared with previous period";
  const trendDir = threatIntel.trend_direction || "stable";
  const explanation =
    threatIntel.explanation ||
    (threatScore >= 60
      ? "Elevated multi-vector incursion risk across monitored industrial endpoints."
      : "Network operations operating within nominal security baseline.");

  const highestSeverity =
    Number(summary?.critical_alerts || 0) > 0
      ? "CRITICAL"
      : Number(summary?.high_alerts || 0) > 0
      ? "HIGH"
      : alerts.length > 0
      ? alerts.find((a) => a.severity === "Critical")
        ? "CRITICAL"
        : alerts.find((a) => a.severity === "High")
        ? "HIGH"
        : alerts[0].severity?.toUpperCase() || levelConfig.level
      : levelConfig.level;

  const criticalEventsCount = Number(summary?.critical_alerts || 0);
  const recentThreatsCount = alerts.length;
  const gaugeValue = Math.min(Math.max(threatScore, 0), 100);

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        minHeight: 380,
        p: 3,
        borderRadius: 2,
        bgcolor: colors.background.card,
        border: `1px solid ${colors.border.muted}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.82rem",
              color: colors.text.muted,
              letterSpacing: "0.06em",
            }}
          >
            THREAT ASSESSMENT
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color: colors.text.primary,
              letterSpacing: -0.2,
            }}
          >
            CURRENT THREAT LEVEL
          </Typography>
        </Box>

        <Chip
          label={levelConfig.level}
          size="small"
          sx={{
            bgcolor: levelConfig.bg,
            color: levelConfig.color,
            border: `1px solid ${levelConfig.border}`,
            fontWeight: 800,
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
          }}
        />
      </Box>

      {/* Gauge and Central Metrics */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", my: 2 }}>
        {/* Circular Progress Gauge */}
        <Box
          sx={{
            position: "relative",
            width: 140,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={140}
            thickness={5}
            sx={{
              color: "rgba(148, 163, 184, 0.1)",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={gaugeValue}
            size={140}
            thickness={5}
            sx={{
              color: levelConfig.color,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: colors.text.primary, letterSpacing: -1 }}>
              {gaugeValue}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.68rem" }}>
              / 100 SCORE
            </Typography>
          </Box>
        </Box>

        {/* Telemetry Breakdown Columns */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700 }}>
              STATUS:
            </Typography>
            <Typography sx={{ color: levelConfig.color, fontWeight: 800, fontSize: "0.88rem" }}>
              {levelConfig.level}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700 }}>
              HIGHEST SEVERITY:
            </Typography>
            <Typography sx={{ color: colors.status.critical, fontWeight: 800, fontSize: "0.88rem" }}>
              {highestSeverity}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700 }}>
              RECENT THREATS:
            </Typography>
            <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "0.88rem" }}>
              {recentThreatsCount}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700 }}>
              CRITICAL EVENTS:
            </Typography>
            <Typography sx={{ color: colors.status.critical, fontWeight: 800, fontSize: "0.88rem" }}>
              {criticalEventsCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Situational Explanation & Trend */}
      <Box sx={{ bgcolor: "rgba(11, 18, 32, 0.6)", p: 1.5, borderRadius: 1.5, border: `1px solid ${colors.border.subtle}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
          {trendDir === "up" ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: colors.status.critical }} />
          ) : trendDir === "down" ? (
            <TrendingDownIcon sx={{ fontSize: 16, color: colors.status.safe }} />
          ) : (
            <TrendingFlatIcon sx={{ fontSize: 16, color: colors.text.muted }} />
          )}
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: colors.text.secondary }}>
            {trendText}
          </Typography>
        </Box>

        <Typography sx={{ color: colors.text.secondary, fontSize: "0.76rem", lineHeight: 1.4 }}>
          {explanation}
        </Typography>
      </Box>
    </Paper>
  );
}
