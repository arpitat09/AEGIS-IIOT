import { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SensorsIcon from "@mui/icons-material/Sensors";
import SecurityIcon from "@mui/icons-material/Security";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HubIcon from "@mui/icons-material/Hub";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { colors } from "../../theme/colors";
import { apiService } from "../../services/api";

export default function IndustrialSecurityOverview({ dashboardData, onTriggerSimulation }) {
  const overview = dashboardData?.industrial_overview || {};
  const [simLoading, setSimLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);

  const handleSimulateModbus = async () => {
    setSimLoading(true);
    try {
      const res = await apiService.simulateModbus({
        scenario: "Unauthorized Modbus Function Request",
        source_ip: "198.51.100.23",
        destination_ip: "192.168.1.10",
      });
      setSnackMessage("⚡ Simulated Modbus TCP attack injected into PLC-02. Correlation engine triggered.");
      if (onTriggerSimulation) onTriggerSimulation();
    } catch (err) {
      console.warn("Modbus simulation error:", err);
    } finally {
      setSimLoading(false);
    }
  };

  const handleSimulateFdia = async () => {
    setSimLoading(true);
    try {
      const res = await apiService.simulateFdia({
        sensor_type: "temperature",
        attack_mode: "sudden_spike",
      });
      setSnackMessage("🚨 False Data Injection Attack (FDIA) simulated against Turbine Cooling Sensor (98.4°C).");
      if (onTriggerSimulation) onTriggerSimulation();
    } catch (err) {
      console.warn("FDIA simulation error:", err);
    } finally {
      setSimLoading(false);
    }
  };

  const taxonomy = overview?.attack_taxonomy || {};
  const netAtks = taxonomy.network_attacks || 0;
  const indAtks = taxonomy.industrial_attacks || 0;
  const cpAtks = taxonomy.cyber_physical_attacks || 0;
  const totalTax = netAtks + indAtks + cpAtks || 1;

  return (
    <Card
      sx={{
        p: 2.5,
        bgcolor: colors.background.paper,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: 2.5,
        width: "100%",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top Banner: Title & Operational Status Badges */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0, 229, 168, 0.12)",
              border: `1px solid ${colors.accent.primary}`,
              color: colors.accent.primary,
            }}
          >
            <PrecisionManufacturingIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1.05rem" }}>
              Industrial Cybersecurity & Cyber-Physical Overview
            </Typography>
            <Typography sx={{ color: colors.text.secondary, fontSize: "0.78rem" }}>
              Modbus TCP telemetry, Purdue Model zone protection, and False Data Injection (FDIA) defense.
            </Typography>
          </Box>
        </Stack>

        {/* Live Badges */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label="PREVENTION: ACTIVE"
            size="small"
            sx={{
              bgcolor: "rgba(0, 229, 168, 0.15)",
              color: colors.accent.primary,
              fontWeight: 800,
              fontSize: "0.68rem",
              border: "1px solid rgba(0, 229, 168, 0.4)",
            }}
          />
          <Chip
            label="MODBUS TCP: MONITORING (PORT 502)"
            size="small"
            sx={{
              bgcolor: "rgba(59, 130, 246, 0.15)",
              color: colors.accent.info,
              fontWeight: 800,
              fontSize: "0.68rem",
              border: "1px solid rgba(59, 130, 246, 0.4)",
            }}
          />
          <Chip
            label="SENSOR SHIELD: ARMED"
            size="small"
            sx={{
              bgcolor: "rgba(168, 85, 247, 0.15)",
              color: colors.accent.secondary,
              fontWeight: 800,
              fontSize: "0.68rem",
              border: "1px solid rgba(168, 85, 247, 0.4)",
            }}
          />
        </Stack>
      </Stack>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {[
          {
            label: "Modbus TCP Activity",
            val: overview.modbus_traffic_count ?? 12,
            sub: "Port 502 Sessions",
            color: colors.accent.info,
          },
          {
            label: "Protected Industrial Assets",
            val: overview.active_industrial_assets ?? 7,
            sub: "PLCs, SCADA & RTUs",
            color: colors.accent.primary,
          },
          {
            label: "FDIA Sensor Incursions",
            val: overview.fdia_alerts_count ?? 0,
            sub: "Physics Bound Violations",
            color: colors.accent.warning,
          },
          {
            label: "Cyber-Physical Incidents",
            val: overview.cyber_physical_incidents_count ?? 0,
            sub: "Correlated Multi-Source",
            color: colors.accent.error,
          },
        ].map((m, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(15, 23, 42, 0.6)",
                borderRadius: 2,
                border: `1px solid ${colors.border.muted}`,
              }}
            >
              <Typography sx={{ color: colors.text.muted, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                {m.label}
              </Typography>
              <Typography sx={{ color: m.color, fontSize: "1.6rem", fontWeight: 900, my: 0.2 }}>
                {m.val}
              </Typography>
              <Typography sx={{ color: colors.text.secondary, fontSize: "0.68rem" }}>
                {m.sub}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Attack Taxonomy Distribution Bar & Simulation Triggers */}
      <Grid container spacing={2} alignItems="center">
        {/* Left: Taxonomy Breakdown */}
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 2, bgcolor: "rgba(15, 23, 42, 0.5)", borderRadius: 2, border: `1px solid ${colors.border.muted}` }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: "0.75rem", fontWeight: 700, mb: 1 }}>
              Threat Taxonomy Classification
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: "0.72rem", color: colors.accent.info }}>
                ● Network: <b>{Math.round((netAtks / totalTax) * 100)}%</b>
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: colors.accent.warning }}>
                ● Industrial Protocol: <b>{Math.round((indAtks / totalTax) * 100)}%</b>
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: colors.accent.error }}>
                ● Cyber-Physical (FDIA): <b>{Math.round((cpAtks / totalTax) * 100)}%</b>
              </Typography>
            </Stack>

            <Typography sx={{ fontSize: "0.72rem", color: colors.text.muted }}>
              Most Targeted Hardware: <font color="#00E5A8"><b>{overview.most_targeted_asset || "PLC-02 (Siemens S7-1500)"}</b></font> ({overview.most_targeted_ip || "192.168.1.10"})
            </Typography>
          </Box>
        </Grid>

        {/* Right: Quick Simulation Triggers */}
        <Grid item xs={12} md={5}>
          <Stack spacing={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={simLoading}
              onClick={handleSimulateModbus}
              startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                borderColor: "rgba(59, 130, 246, 0.4)",
                color: colors.accent.info,
                justifyContent: "flex-start",
                "&:hover": { bgcolor: "rgba(59, 130, 246, 0.1)", borderColor: colors.accent.info },
              }}
            >
              Simulate Modbus TCP Incursion (Port 502)
            </Button>

            <Button
              size="small"
              variant="outlined"
              disabled={simLoading}
              onClick={handleSimulateFdia}
              startIcon={<SensorsIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                borderColor: "rgba(220, 38, 38, 0.4)",
                color: colors.accent.error,
                justifyContent: "flex-start",
                "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)", borderColor: colors.accent.error },
              }}
            >
              Simulate FDIA Sensor Tampering (95°C Spike)
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Snackbar feedback */}
      <Snackbar
        open={Boolean(snackMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info" sx={{ bgcolor: "rgba(15, 23, 42, 0.95)", color: colors.text.primary, border: `1px solid ${colors.accent.primary}` }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
