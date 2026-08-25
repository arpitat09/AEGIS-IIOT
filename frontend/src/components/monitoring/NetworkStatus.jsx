import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

import SpeedIcon from "@mui/icons-material/Speed";
import HubIcon from "@mui/icons-material/Hub";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";

import { apiService } from "../../services/api";

function NetworkStatus({ data = null }) {
  const [internalStatus, setInternalStatus] = useState(null);

  useEffect(() => {
    if (data) return; // Prop provided from parent

    let isMounted = true;
    const fetchNetworkStatus = async () => {
      try {
        const res = await apiService.getMonitoringLive();
        if (isMounted && res?.network_status) {
          setInternalStatus(res.network_status);
        }
      } catch (error) {
        console.error("Network status API error:", error);
      }
    };

    fetchNetworkStatus();
    const interval = setInterval(fetchNetworkStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [data]);

  const status = data || internalStatus;

  const metrics = [
    {
      title: "Packets / Second",
      value: status?.packets_per_second ?? 0,
      icon: <SpeedIcon />,
    },
    {
      title: "Active Connections",
      value: status?.active_connections ?? 0,
      icon: <HubIcon />,
    },
    {
      title: "Threats Detected",
      value: status?.threats_today ?? 0,
      icon: <SecurityIcon />,
    },
    {
      title: "Bandwidth",
      value: `${status?.bandwidth_mbps ?? 0} Mbps`,
      icon: <StorageIcon />,
    },
  ];

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
      {metrics.map((metric) => (
        <Paper
          key={metric.title}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "#111827",
            border: "1px solid #1E293B",
            minHeight: 145,
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-3px)",
              borderColor: "#2563EB",
            },
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
                variant="body2"
                sx={{
                  color: "#94A3B8",
                  mb: 1,
                }}
              >
                {metric.title}
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {metric.value}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(59, 130, 246, 0.15)",
                color: "#faa560",
              }}
            >
              {metric.icon}
            </Box>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 2,
              color: "#22C55E",
              fontWeight: 600,
            }}
          >
            ● LIVE
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default NetworkStatus;