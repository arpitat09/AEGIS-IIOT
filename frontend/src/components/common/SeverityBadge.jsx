import { Chip } from "@mui/material";
import { getSeverityTokens } from "../../theme/colors";

export default function SeverityBadge({ severity = "Low", size = "small" }) {
  const token = getSeverityTokens(severity);

  return (
    <Chip
      label={token.label}
      size={size}
      sx={{
        color: token.color,
        bgcolor: token.bg,
        border: `1px solid ${token.border}`,
        fontWeight: 800,
        fontSize: size === "small" ? "0.68rem" : "0.75rem",
        height: size === "small" ? 20 : 24,
        letterSpacing: "0.04em",
      }}
    />
  );
}
