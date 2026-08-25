import {
  Box,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

function ResponseTimeline({ incidents = [] }) {
  const recentIncidents = incidents.slice(0, 5);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "#EF4444";

      case "High":
        return "#F97316";

      case "Medium":
        return "#F59E0B";

      case "Low":
        return "#22C55E";

      default:
        return "#64748B";
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        border: "1px solid #1F2937",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#F8FAFC",
        }}
      >
        Response Timeline
      </Typography>

      <Typography
        sx={{
          mt: 1,
          mb: 4,
          color: "#94A3B8",
          fontSize: "0.9rem",
        }}
      >
        Recent threat detection and automated response activity
      </Typography>

      {recentIncidents.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {recentIncidents.map((incident, index) => (
            <Box
              key={incident.id}
              sx={{
                position: "relative",
                display: "flex",
                gap: 2.5,
              }}
            >
              {/* Timeline line */}
              {index !== recentIncidents.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 19,
                    top: 45,
                    bottom: -25,
                    width: 2,
                    bgcolor: "#334155",
                  }}
                />
              )}

              {/* Timeline icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "50%",
                  bgcolor: `${getSeverityColor(
                    incident.severity
                  )}20`,
                  color: getSeverityColor(
                    incident.severity
                  ),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <SensorsRoundedIcon />
              </Box>

              {/* Incident content */}
              <Box
                sx={{
                  flex: 1,
                  pb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#F8FAFC",
                        fontWeight: 700,
                      }}
                    >
                      {incident.attack || "Unknown"} Threat Detected
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: "#94A3B8",
                        fontSize: "0.85rem",
                      }}
                    >
                      {incident.source_ip || "Unknown source"} →{" "}
                      {incident.destination_ip || "Unknown destination"}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: "0.8rem",
                    }}
                  >
                    {incident.timestamp || "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<PsychologyRoundedIcon />}
                    label="ML Classified"
                    size="small"
                    sx={{
                      bgcolor: "rgba(59, 130, 246, 0.12)",
                      color: "#60A5FA",
                    }}
                  />

                  <Chip
                    icon={<SecurityRoundedIcon />}
                    label={`Risk: ${
                      incident.risk_score ?? 0
                    }`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(245, 158, 11, 0.12)",
                      color: "#FBBF24",
                    }}
                  />

                  <Chip
                    icon={<ShieldRoundedIcon />}
                    label={
                      incident.action || "Alert"
                    }
                    size="small"
                    sx={{
                      bgcolor: `${getSeverityColor(
                        incident.severity
                      )}20`,
                      color: getSeverityColor(
                        incident.severity
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#94A3B8",
            }}
          >
            No response activity available
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ResponseTimeline;