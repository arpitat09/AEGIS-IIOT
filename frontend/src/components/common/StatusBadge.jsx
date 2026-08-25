import { Chip } from "@mui/material";
import { colors } from "../../theme/colors";

const STATUS_MAP = {
  active: { color: colors.status.critical, bg: colors.status.criticalBg, border: colors.status.criticalBorder },
  investigating: { color: colors.status.info, bg: colors.status.infoBg, border: colors.status.infoBorder },
  contained: { color: colors.status.warning, bg: colors.status.warningBg, border: colors.status.warningBorder },
  resolved: { color: colors.status.safe, bg: colors.status.safeBg, border: colors.status.safeBorder },
  "false positive": { color: colors.text.muted, bg: "rgba(148, 163, 184, 0.1)", border: colors.border.subtle },
  open: { color: colors.status.highRisk, bg: colors.status.highRiskBg, border: colors.status.highRiskBorder },
  online: { color: colors.status.safe, bg: colors.status.safeBg, border: colors.status.safeBorder },
  offline: { color: colors.status.critical, bg: colors.status.criticalBg, border: colors.status.criticalBorder },
  blocked: { color: colors.status.critical, bg: colors.status.criticalBg, border: colors.status.criticalBorder },
};

export default function StatusBadge({ status = "Investigating", size = "small" }) {
  const normalized = status?.toLowerCase() || "investigating";
  const cfg = STATUS_MAP[normalized] || STATUS_MAP.investigating;

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        color: cfg.color,
        bgcolor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontWeight: 700,
        fontSize: size === "small" ? "0.7rem" : "0.78rem",
        height: size === "small" ? 22 : 26,
        textTransform: "capitalize",
      }}
    />
  );
}
