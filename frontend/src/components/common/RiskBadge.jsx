import { Box, Typography } from "@mui/material";
import { getThreatLevelConfig } from "../../theme/colors";

export default function RiskBadge({ score = 0, showScoreOnly = false }) {
  const num = Number(score) || 0;
  const cfg = getThreatLevelConfig(num);

  if (showScoreOnly) {
    return (
      <Typography
        component="span"
        sx={{
          color: cfg.color,
          fontWeight: 800,
          fontFamily: "monospace",
          fontSize: "0.85rem",
        }}
      >
        {num}%
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1,
        py: 0.3,
        borderRadius: 1,
        bgcolor: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Typography
        sx={{
          color: cfg.color,
          fontWeight: 800,
          fontSize: "0.72rem",
          fontFamily: "monospace",
        }}
      >
        {num}%
      </Typography>
      <Typography
        sx={{
          color: cfg.color,
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.05em",
        }}
      >
        {cfg.level}
      </Typography>
    </Box>
  );
}
