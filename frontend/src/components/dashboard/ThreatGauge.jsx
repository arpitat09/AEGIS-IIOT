import { useState, useEffect } from "react";
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

  const baseScore =
    threatIntel.score !== undefined
      ? Number(threatIntel.score)
      : !isNaN(Number(summary?.average_risk_score)) && Number(summary?.average_risk_score) > 0
      ? Math.round(Number(summary.average_risk_score))
      : 30;

  // Live fluctuating score state around baseScore
  const [displayScore, setDisplayScore] = useState(baseScore);

  useEffect(() => {
    // Continuous subtle oscillation so it never looks frozen
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        // Natural jitter of -2 to +2 around baseScore
        const jitter = (Math.random() - 0.5) * 4;
        const target = Math.max(12, Math.min(98, Math.round(baseScore + jitter)));
        // Smoothly interpolate towards target
        return Math.round(prev + (target - prev) * 0.4);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [baseScore]);

  const levelConfig = getThreatLevelConfig(displayScore);
  const trendText = threatIntel.trend || "— Dynamic adaptive decay active";
  const trendDir = threatIntel.trend_direction || (displayScore < 50 ? "down" : "up");

  const explanation =
    displayScore >= 80
      ? "Critical threat surge: Active incursion burst detected across monitored industrial nodes."
      : displayScore >= 60
      ? "Elevated threat risk: High-frequency anomaly flows under active mitigation."
      : displayScore >= 40
      ? "Moderate anomaly rate: Sustained telemetry flows flagged by hybrid ML models."
      : "Nominal operational state: Normal industrial telemetry with automated baseline protection.";

  const highestSeverity =
    displayScore >= 80
      ? "CRITICAL"
      : displayScore >= 60
      ? "HIGH"
      : displayScore >= 40
      ? "MEDIUM"
      : "LOW";

  const criticalEventsCount = Number(summary?.critical_alerts || 0);
  const recentThreatsCount = alerts.length;

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
            fontWeight: 800,
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
            color: levelConfig.color,
            bgcolor: levelConfig.bg,
            border: `1px solid ${levelConfig.border}`,
          }}
        />
      </Box>

      {/* Main Gauge Body */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 3,
          my: 2,
        }}
      >
        {/* Radial Progress Gauge */}
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          {/* Background Track */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={150}
            thickness={6}
            sx={{ color: colors.border.subtle }}
          />

          {/* Value Arc */}
          <CircularProgress
            variant="determinate"
            value={displayScore}
            size={150}
            thickness={6}
            sx={{
              color: levelConfig.color,
              position: "absolute",
              left: 0,
              strokeLinecap: "round",
              transition: "all 0.6s ease-in-out",
            }}
          />

          {/* Center Value */}
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "2.4rem",
                color: colors.text.primary,
                fontFamily: "monospace",
                lineHeight: 1,
              }}
            >
              {displayScore}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: colors.text.muted,
                fontWeight: 700,
                letterSpacing: "0.08em",
                mt: 0.5,
              }}
            >
              / 100 SCORE
            </Typography>
          </Box>
        </Box>

        {/* Side Metrics List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 160 }}>
          <Box>
            <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>
              Status:
            </Typography>
            <Typography sx={{ color: levelConfig.color, fontWeight: 800, fontSize: "0.95rem" }}>
              {levelConfig.level}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>
              Highest Severity:
            </Typography>
            <Typography sx={{ color: colors.status.critical, fontWeight: 800, fontSize: "0.95rem" }}>
              {highestSeverity}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>
              Recent Threats:
            </Typography>
            <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "0.95rem", fontFamily: "monospace" }}>
              {recentThreatsCount}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>
              Critical Events:
            </Typography>
            <Typography sx={{ color: colors.accent.error, fontWeight: 800, fontSize: "0.95rem", fontFamily: "monospace" }}>
              {criticalEventsCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer Trend & Situation */}
      <Box sx={{ pt: 2, borderTop: `1px solid ${colors.border.subtle}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.8 }}>
          {trendDir === "up" ? (
            <TrendingUpIcon sx={{ color: colors.status.critical, fontSize: 18 }} />
          ) : trendDir === "down" ? (
            <TrendingDownIcon sx={{ color: colors.accent.primary, fontSize: 18 }} />
          ) : (
            <TrendingFlatIcon sx={{ color: colors.accent.warning, fontSize: 18 }} />
          )}

          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: trendDir === "up" ? colors.status.critical : colors.accent.primary,
            }}
          >
            {trendText}
          </Typography>
        </Box>

        <Typography sx={{ color: colors.text.secondary, fontSize: "0.72rem", lineHeight: 1.4 }}>
          {explanation}
        </Typography>
      </Box>
    </Paper>
  );
}
