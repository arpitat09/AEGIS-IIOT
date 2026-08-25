import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Alert,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import OverviewCards from "../components/dashboard/OverviewCards";
import ThreatGauge from "../components/dashboard/ThreatGauge";
import TrafficChart from "../components/dashboard/TrafficChart";
import AttackDistribution from "../components/dashboard/AttackDistribution";
import AlertPanel from "../components/dashboard/AlertPanel";
import IncidentTable from "../components/dashboard/IncidentTable";
import LiveIndicator from "../components/common/LiveIndicator";

import { apiService } from "../services/api";
import { useRealtimeStream } from "../hooks/useRealtimeStream";
import { colors } from "../theme/colors";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiService.getDashboardLive();
      setDashboardData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Command Center API error:", err);
      setError("Unable to connect to AEGIS-IIOT telemetry engine. Retrying stream sync...");
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-Time SSE Stream Hook
  const { isConnected } = useRealtimeStream((newAlert) => {
    setDashboardData((prev) => {
      if (!prev) return prev;
      const updatedAlerts = [newAlert, ...(prev.recent_alerts || [])].slice(0, 20);
      return {
        ...prev,
        recent_alerts: updatedAlerts,
        summary: {
          ...prev.summary,
          total_alerts: (prev.summary?.total_alerts || 0) + 1,
        },
      };
    });
    setLastUpdated(new Date());
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: colors.text.primary,
              letterSpacing: "-0.02em",
            }}
          >
            COMMAND CENTER
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              mt: 0.3,
            }}
          >
            Real-Time Adaptive Cyber Defense Overview
          </Typography>
        </Box>

        {/* Right Status Controls */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LiveIndicator isLive={!error && isConnected} />

          {lastUpdated && (
            <Typography
              variant="caption"
              sx={{
                color: colors.text.muted,
                fontFamily: "monospace",
                display: { xs: "none", sm: "block" },
              }}
            >
              SYNC: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}

          <Button
            size="small"
            variant="outlined"
            onClick={fetchData}
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

      {/* Error Alert */}
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

      {/* Row 1: Overview Cards (6 metrics) */}
      <OverviewCards
        summary={dashboardData?.summary}
        networkStatus={dashboardData?.network_status}
        dashboardData={dashboardData}
      />

      {/* Row 2: Threat Assessment & Traffic */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "5fr 7fr",
            xl: "4.5fr 7.5fr",
          },
          gap: 2.5,
          width: "100%",
        }}
      >
        <ThreatGauge
          dashboardData={dashboardData}
          summary={dashboardData?.summary}
          threatLevel={dashboardData?.threat_level}
          alerts={dashboardData?.recent_alerts}
        />
        <TrafficChart
          data={dashboardData?.traffic_chart}
          recentAlerts={dashboardData?.recent_alerts || []}
          dashboardData={dashboardData}
        />
      </Box>

      {/* Row 3: Live Alerts Feed & Attack Distribution */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "7fr 5fr",
          },
          gap: 2.5,
          width: "100%",
        }}
      >
        <AlertPanel alerts={dashboardData?.recent_alerts || []} />
        <AttackDistribution
          data={dashboardData?.attack_distribution || {}}
          dashboardData={dashboardData}
        />
      </Box>

      {/* Row 4: Real-Time Security Incidents */}
      <IncidentTable
        incidents={dashboardData?.incidents || dashboardData?.recent_alerts || []}
        onIncidentUpdated={fetchData}
      />
    </Box>
  );
}
