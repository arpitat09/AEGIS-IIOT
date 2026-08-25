import { Box, Paper, Typography } from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function SummaryCard({ title, value, subtitle, icon, iconBg }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        border: "1px solid #1F2937",
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#F8FAFC",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        sx={{
          mt: 2,
          color: "#64748B",
          fontSize: "0.8rem",
        }}
      >
        {subtitle}
      </Typography>
    </Paper>
  );
}

function IncidentSummary({ incidents = [] }) {
  const totalIncidents = incidents.length;

  const criticalThreats = incidents.filter(
    (incident) =>
      incident.severity?.toLowerCase() === "critical"
  ).length;

  const blockedAttacks = incidents.filter(
    (incident) =>
      incident.action?.toLowerCase().includes("block")
  ).length;

  const resolvedIncidents = incidents.filter(
    (incident) =>
      incident.status?.toLowerCase() === "resolved"
  ).length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 3,
      }}
    >
      <SummaryCard
        title="Total Incidents"
        value={totalIncidents}
        subtitle="Detected security events"
        icon={
          <WarningAmberRoundedIcon
            sx={{
              color: "#F59E0B",
              fontSize: 26,
            }}
          />
        }
        iconBg="rgba(245, 158, 11, 0.12)"
      />

      <SummaryCard
        title="Critical Threats"
        value={criticalThreats}
        subtitle="Require immediate attention"
        icon={
          <ReportProblemRoundedIcon
            sx={{
              color: "#EF4444",
              fontSize: 26,
            }}
          />
        }
        iconBg="rgba(239, 68, 68, 0.12)"
      />

      <SummaryCard
        title="Blocked Attacks"
        value={blockedAttacks}
        subtitle="Automatic prevention applied"
        icon={
          <BlockRoundedIcon
            sx={{
              color: "#A855F7",
              fontSize: 26,
            }}
          />
        }
        iconBg="rgba(168, 85, 247, 0.12)"
      />

      <SummaryCard
        title="Resolved Incidents"
        value={resolvedIncidents}
        subtitle="Successfully handled events"
        icon={
          <CheckCircleRoundedIcon
            sx={{
              color: "#22C55E",
              fontSize: 26,
            }}
          />
        }
        iconBg="rgba(34, 197, 94, 0.12)"
      />
    </Box>
  );
}

export default IncidentSummary;