import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import RadarIcon from "@mui/icons-material/Radar";
import RefreshIcon from "@mui/icons-material/Refresh";

import NetworkStatus from "../components/monitoring/NetworkStatus";
import PacketRateChart from "../components/monitoring/PacketRateChart";
import TrafficTable from "../components/monitoring/TrafficTable";
import ActiveDevices from "../components/monitoring/ActiveDevices";
import LiveIndicator from "../components/common/LiveIndicator";

import { apiService } from "../services/api";
import { colors } from "../theme/colors";

export default function Monitoring() {
  const [monitoringData, setMonitoringData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMonitoringData = async () => {
    try {
      const data = await apiService.getMonitoringLive();
      setMonitoringData(data);
      setError(null);
    } catch (err) {
      console.error("Monitoring API error:", err);
      setError("Unable to connect to the AEGIS-IIOT live packet capture engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <RadarIcon sx={{ color: colors.accent.primary, fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Live Network Monitoring
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.3 }}>
            Real-time Scapy packet inspection, bandwidth utilization, and industrial node flows
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <LiveIndicator isLive={!error} />
          <Button
            size="small"
            variant="outlined"
            onClick={loadMonitoringData}
            startIcon={<RefreshIcon fontSize="small" />}
            sx={{
              borderColor: colors.border.muted,
              color: colors.text.secondary,
              "&:hover": { borderColor: colors.accent.primary, color: colors.text.primary },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            bgcolor: colors.status.criticalBg,
            color: "#FCA5A5",
            border: `1px solid ${colors.status.criticalBorder}`,
          }}
        >
          {error}
        </Alert>
      )}

      <NetworkStatus data={monitoringData?.network_status} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
        }}
      >
        <PacketRateChart data={monitoringData?.traffic_chart} />
        <ActiveDevices devices={monitoringData?.devices} />
      </Box>

      <TrafficTable data={monitoringData?.traffic} />
    </Box>
  );
}
