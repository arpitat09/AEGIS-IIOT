/**
 * AEGIS-IIOT SOC Theme Design Tokens
 * Enterprise Cybersecurity Dark Color Palette
 */

export const colors = {
  // Backgrounds
  background: {
    main: "#070B14",
    secondary: "#0B1220",
    card: "#111827",
    cardElevated: "#151F2E",
    sidebar: "#080D17",
    overlay: "rgba(7, 11, 20, 0.85)",
  },

  // Accents
  accent: {
    primary: "#00D4FF", // Electric Cyan
    primaryGlow: "rgba(0, 212, 255, 0.2)",
    secondary: "#2563EB", // Cobalt Blue
    secondaryGlow: "rgba(37, 99, 235, 0.2)",
  },

  // Cybersecurity Status Colors
  status: {
    safe: "#22C55E", // Emerald Green
    safeBg: "rgba(34, 197, 94, 0.12)",
    safeBorder: "rgba(34, 197, 94, 0.3)",

    warning: "#F59E0B", // Amber
    warningBg: "rgba(245, 158, 11, 0.12)",
    warningBorder: "rgba(245, 158, 11, 0.3)",

    highRisk: "#F97316", // Orange
    highRiskBg: "rgba(249, 115, 22, 0.12)",
    highRiskBorder: "rgba(249, 115, 22, 0.3)",

    critical: "#EF4444", // Crimson
    criticalBg: "rgba(239, 68, 68, 0.12)",
    criticalBorder: "rgba(239, 68, 68, 0.3)",
    criticalDark: "#7F1D1D",

    info: "#38BDF8", // Sky Blue
    infoBg: "rgba(56, 189, 248, 0.12)",
    infoBorder: "rgba(56, 189, 248, 0.3)",
  },

  // Text
  text: {
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    muted: "#64748B",
    inverse: "#070B14",
  },

  // Borders & Dividers
  border: {
    muted: "#1E293B",
    subtle: "rgba(148, 163, 184, 0.12)",
    focus: "#00D4FF",
  },
};

/**
 * Maps severity strings to color tokens
 */
export function getSeverityTokens(severity) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return {
        color: colors.status.critical,
        bg: colors.status.criticalBg,
        border: colors.status.criticalBorder,
        label: "CRITICAL",
      };
    case "high":
      return {
        color: colors.status.highRisk,
        bg: colors.status.highRiskBg,
        border: colors.status.highRiskBorder,
        label: "HIGH",
      };
    case "medium":
      return {
        color: colors.status.warning,
        bg: colors.status.warningBg,
        border: colors.status.warningBorder,
        label: "MEDIUM",
      };
    case "low":
    case "normal":
      return {
        color: colors.status.safe,
        bg: colors.status.safeBg,
        border: colors.status.safeBorder,
        label: severity?.toUpperCase() || "LOW",
      };
    default:
      return {
        color: colors.text.muted,
        bg: "rgba(148, 163, 184, 0.1)",
        border: colors.border.subtle,
        label: severity?.toUpperCase() || "UNKNOWN",
      };
  }
}

/**
 * Maps Threat Level Score (0-100) to Level Configuration
 */
export function getThreatLevelConfig(score) {
  const numScore = Number(score) || 0;
  if (numScore >= 81) {
    return {
      level: "CRITICAL",
      color: colors.status.critical,
      bg: colors.status.criticalBg,
      border: colors.status.criticalBorder,
    };
  } else if (numScore >= 61) {
    return {
      level: "HIGH RISK",
      color: colors.status.highRisk,
      bg: colors.status.highRiskBg,
      border: colors.status.highRiskBorder,
    };
  } else if (numScore >= 41) {
    return {
      level: "MODERATE",
      color: colors.status.warning,
      bg: colors.status.warningBg,
      border: colors.status.warningBorder,
    };
  } else if (numScore >= 21) {
    return {
      level: "LOW",
      color: colors.accent.primary,
      bg: colors.accent.primaryGlow,
      border: "rgba(0, 212, 255, 0.3)",
    };
  } else {
    return {
      level: "SECURE",
      color: colors.status.safe,
      bg: colors.status.safeBg,
      border: colors.status.safeBorder,
    };
  }
}
