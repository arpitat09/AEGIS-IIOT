import { Box, Paper, Typography, LinearProgress } from "@mui/material";

import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const actionConfig = {
  "Block IP": {
    icon: <BlockRoundedIcon />,
    label: "Block IP",
    color: "#EF4444",
  },

  "Rate Limit": {
    icon: <SpeedRoundedIcon />,
    label: "Rate Limit",
    color: "#F59E0B",
  },

  "Terminate Session": {
    icon: <CancelRoundedIcon />,
    label: "Terminate Session",
    color: "#A855F7",
  },

  Alert: {
    icon: <NotificationsActiveRoundedIcon />,
    label: "Alert",
    color: "#3B82F6",
  },
};

function PreventionActions({ incidents = [] }) {
  const actionCounts = incidents.reduce((acc, incident) => {
    const action = incident.action || "Alert";

    acc[action] = (acc[action] || 0) + 1;

    return acc;
  }, {});

  const totalActions = incidents.length || 1;

  const actions = Object.entries(actionCounts)
    .map(([action, count]) => ({
      action,
      count,
      percentage: Math.round(
        (count / totalActions) * 100
      ),
      config:
        actionConfig[action] || {
          icon: <NotificationsActiveRoundedIcon />,
          label: action,
          color: "#64748B",
        },
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        border: "1px solid #1F2937",
        minHeight: 420,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#F8FAFC",
        }}
      >
        Prevention Actions
      </Typography>

      <Typography
        sx={{
          mt: 1,
          mb: 4,
          color: "#94A3B8",
          fontSize: "0.9rem",
        }}
      >
        Automated responses triggered by AEGIS-IIOT
      </Typography>

      {actions.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {actions.map((item) => (
            <Box key={item.action}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${item.config.color}20`,
                      color: item.config.color,
                    }}
                  >
                    {item.config.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#E2E8F0",
                      fontWeight: 600,
                    }}
                  >
                    {item.config.label}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#F8FAFC",
                    fontWeight: 700,
                  }}
                >
                  {item.count}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: "#1E293B",

                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.config.color,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            height: 250,
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
            No prevention actions recorded
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default PreventionActions;