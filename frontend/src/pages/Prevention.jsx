import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Security,
  Shield,
  Block,
  Speed,
  Refresh,
  LockOpen,
  Add,
  PowerSettingsNew,
} from "@mui/icons-material";

import { apiService } from "../services/api";
import { colors } from "../theme/colors";

export default function Prevention() {
  const [preventionData, setPreventionData] = useState(null);
  const [engineStatus, setEngineStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openManualBlock, setOpenManualBlock] = useState(false);
  const [blockIpAddress, setBlockIpAddress] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllPreventionData = useCallback(async () => {
    try {
      const [data, status] = await Promise.all([
        apiService.getPrevention(),
        apiService.getPreventionStatus(),
      ]);
      setPreventionData(data);
      setEngineStatus(status);
      setError(null);
    } catch (err) {
      console.error("Prevention API error:", err);
      setError("Unable to connect to the adaptive prevention system.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPreventionData();
    const interval = setInterval(fetchAllPreventionData, 4000);
    return () => clearInterval(interval);
  }, [fetchAllPreventionData]);

  const handleManualBlock = async () => {
    if (!blockIpAddress.trim()) return;
    setActionLoading(true);
    try {
      await apiService.blockIp(blockIpAddress, blockReason || "Manual Policy Enforcement");
      setOpenManualBlock(false);
      setBlockIpAddress("");
      setBlockReason("");
      fetchAllPreventionData();
    } catch (err) {
      console.error("Manual block error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async (ruleId) => {
    try {
      await apiService.unblockRule(ruleId);
      fetchAllPreventionData();
    } catch (err) {
      console.error("Unblock error:", err);
    }
  };

  if (loading && !preventionData) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: colors.accent.primary }} />
        <Typography sx={{ color: colors.text.muted, fontSize: "0.9rem" }}>
          Initializing Adaptive Prevention Telemetry...
        </Typography>
      </Box>
    );
  }

  const summary = preventionData?.summary || {};
  const recentActions = preventionData?.recent_actions || [];
  const firewallRules = preventionData?.firewall_rules || [];

  const isOnline = engineStatus?.engine_online && engineStatus?.status === "ACTIVE";
  const isDegraded = engineStatus?.status === "DEGRADED";

  const statusLabel = isOnline
    ? "PREVENTION ENGINE ONLINE"
    : isDegraded
    ? "PREVENTION ENGINE DEGRADED"
    : "PREVENTION ENGINE OFFLINE";

  const statusColor = isOnline
    ? colors.accent.primary
    : isDegraded
    ? colors.accent.warning
    : colors.accent.error;

  const statusBg = isOnline
    ? "rgba(0, 229, 168, 0.12)"
    : isDegraded
    ? "rgba(245, 158, 11, 0.12)"
    : "rgba(220, 38, 38, 0.12)";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* Top Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 229, 168, 0.1)",
              border: `1px solid ${colors.accent.primary}`,
              color: colors.accent.primary,
            }}
          >
            <Shield fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Adaptive Prevention Engine
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Real-time dynamic containment, IP blocking, and industrial PLC node isolation.
            </Typography>
          </Box>
        </Stack>

        {/* Dynamic Status Indicator */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: 2,
              bgcolor: statusBg,
              border: `1px solid ${statusColor}`,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: statusColor,
                boxShadow: `0 0 10px ${statusColor}`,
                animation: isOnline ? "pulse 2s infinite" : "none",
              }}
            />
            <Typography sx={{ color: statusColor, fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.5px" }}>
              {statusLabel}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenManualBlock(true)}
            sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800, fontSize: "0.75rem" }}
          >
            Block IP Rule
          </Button>

          <IconButton onClick={fetchAllPreventionData} sx={{ color: colors.text.muted }}>
            <Refresh fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(220, 38, 38, 0.1)", border: `1px solid ${colors.accent.error}` }}>
          {error}
        </Alert>
      )}

      {/* Prevention Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            title: "Threats Blocked",
            value: engineStatus?.blocked_ips ?? summary.threats_blocked ?? 0,
            icon: <Block sx={{ fontSize: 22, color: colors.accent.error }} />,
            color: colors.accent.error,
          },
          {
            title: "Active Firewall Rules",
            value: engineStatus?.total_actions ?? firewallRules.length ?? 0,
            icon: <Security sx={{ fontSize: 22, color: colors.accent.info }} />,
            color: colors.accent.info,
          },
          {
            title: "Rate-Limited Connections",
            value: engineStatus?.rate_limited ?? summary.rate_limited ?? 0,
            icon: <Speed sx={{ fontSize: 22, color: colors.accent.warning }} />,
            color: colors.accent.warning,
          },
          {
            title: "Sessions Terminated",
            value: engineStatus?.terminated_sessions ?? summary.sessions_terminated ?? 0,
            icon: <PowerSettingsNew sx={{ fontSize: 22, color: colors.accent.secondary }} />,
            color: colors.accent.secondary,
          },
        ].map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Paper
              sx={{
                p: 2.5,
                bgcolor: colors.background.paper,
                border: `1px solid ${colors.border.subtle}`,
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ color: colors.text.muted, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                  {stat.title}
                </Typography>
                {stat.icon}
              </Stack>
              <Typography sx={{ color: stat.color, fontSize: "1.8rem", fontWeight: 900 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Operational Policy & Health Overview */}
      <Paper
        sx={{
          p: 2.5,
          bgcolor: colors.background.paper,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "0.95rem", mb: 1.5 }}>
          ⚙️ Automated Containment Policy Specification
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
              <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted, textTransform: "uppercase" }}>Containment Mode</Typography>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: colors.accent.primary }}>
                {engineStatus?.mode || "Automated Dynamic Containment"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
              <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted, textTransform: "uppercase" }}>Action Execution Reliability</Typography>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: colors.accent.primary }}>
                {engineStatus?.success_rate || 99.8}% Success Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
              <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted, textTransform: "uppercase" }}>Last Prevention Action</Typography>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.text.secondary }}>
                {engineStatus?.last_action_time ? new Date(engineStatus.last_action_time).toLocaleTimeString() : "Monitoring Active"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Firewall Rules Table */}
      <Paper
        sx={{
          p: 2.5,
          bgcolor: colors.background.paper,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1rem" }}>
            Active Firewall Enforcement Rules
          </Typography>
          <Chip
            label={`${firewallRules.length} Active ACL Rules`}
            size="small"
            sx={{ bgcolor: "rgba(0, 229, 168, 0.15)", color: colors.accent.primary, fontWeight: 700, fontSize: "0.7rem" }}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(15, 23, 42, 0.8)" }}>
              <TableRow>
                <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>TARGET / SOURCE IP</TableCell>
                <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>ATTACK TRIGGER</TableCell>
                <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>SEVERITY</TableCell>
                <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>ENFORCEMENT</TableCell>
                <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {firewallRules.map((rule) => (
                <TableRow
                  key={rule.id}
                  sx={{ "&:hover": { bgcolor: "rgba(30, 41, 59, 0.4)" }, borderBottom: `1px solid ${colors.border.muted}` }}
                >
                  <TableCell sx={{ color: colors.accent.primary, fontWeight: 700, fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {rule.source_ip}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.secondary, fontSize: "0.82rem" }}>
                    {rule.attack}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rule.severity}
                      size="small"
                      sx={{
                        bgcolor: rule.severity === "Critical" ? "rgba(220, 38, 38, 0.2)" : "rgba(245, 158, 11, 0.2)",
                        color: rule.severity === "Critical" ? colors.accent.error : colors.accent.warning,
                        fontWeight: 800,
                        fontSize: "0.68rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: colors.accent.error, fontWeight: 700, fontSize: "0.82rem" }}>
                    {rule.action}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Active ACL"
                      size="small"
                      sx={{ bgcolor: "rgba(0, 229, 168, 0.15)", color: colors.accent.primary, fontWeight: 700, fontSize: "0.68rem" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleUnblock(rule.id)}
                      startIcon={<LockOpen sx={{ fontSize: 13 }} />}
                      sx={{ fontSize: "0.7rem", py: 0.2 }}
                    >
                      Unblock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Manual Block IP Dialog */}
      <Dialog
        open={openManualBlock}
        onClose={() => setOpenManualBlock(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: colors.background.paper,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: colors.text.primary }}>
          Add Manual IP Block Rule
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Adversary IP Address"
              fullWidth
              size="small"
              value={blockIpAddress}
              onChange={(e) => setBlockIpAddress(e.target.value)}
              placeholder="e.g. 198.51.100.23"
            />
            <TextField
              label="Policy Reason"
              fullWidth
              size="small"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Unauthorized Modbus write attempts"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenManualBlock(false)} sx={{ color: colors.text.muted }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!blockIpAddress.trim() || actionLoading}
            onClick={handleManualBlock}
            sx={{ fontWeight: 800 }}
          >
            Enforce Block
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
