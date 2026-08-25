import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/colors";

export default function LiveIndicator({ isLive = true, label }) {
  const displayLabel = label || (isLive ? "LIVE MONITORING" : "SYSTEM DISCONNECTED");
  const dotColor = isLive ? colors.status.safe : colors.status.critical;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderRadius: 1.5,
        bgcolor: isLive ? colors.status.safeBg : colors.status.criticalBg,
        border: `1px solid ${isLive ? colors.status.safeBorder : colors.status.criticalBorder}`,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
          animation: isLive ? "livePulse 2s infinite ease-in-out" : "none",
          "@keyframes livePulse": {
            "0%": { transform: "scale(0.95)", opacity: 0.8 },
            "50%": { transform: "scale(1.3)", opacity: 1 },
            "100%": { transform: "scale(0.95)", opacity: 0.8 },
          },
        }}
      />
      <Typography
        sx={{
          color: dotColor,
          fontWeight: 800,
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
}
