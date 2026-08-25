import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";

import MemoryIcon from "@mui/icons-material/Memory";
import { apiService } from "../../services/api";

function ActiveDevices({ devices: propDevices = null }) {
  const [internalDevices, setInternalDevices] = useState([]);

  useEffect(() => {
    if (propDevices) return;

    let isMounted = true;
    const fetchDevices = async () => {
      try {
        const data = await apiService.getMonitoringLive();
        if (isMounted && data?.devices) {
          setInternalDevices(data.devices);
        }
      } catch (error) {
        console.error("Active devices API error:", error);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [propDevices]);

  const devices = propDevices || internalDevices;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "online":
        return "success";
      case "warning":
        return "warning";
      case "offline":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        minHeight: 420,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Active Devices
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
            }}
          >
            Devices detected from live network traffic
          </Typography>
        </Box>

        <Chip
          label={`${devices.length} Active`}
          color="success"
          size="small"
        />
      </Box>

      {devices.length === 0 ? (
        <Box
          sx={{
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94A3B8",
          }}
        >
          No active devices detected.
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {devices.map((device, index) => (
            <Box
              key={`${device.ip}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#0F172A",
                border: "1px solid #1E293B",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(59, 130, 246, 0.15)",
                    color: "#60A5FA",
                    width: 40,
                    height: 40,
                  }}
                >
                  <MemoryIcon fontSize="small" />
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                  >
                    {device.name || "Unknown Device"}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                    }}
                  >
                    {device.ip}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={device.status || "Unknown"}
                color={getStatusColor(device.status)}
                size="small"
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default ActiveDevices;