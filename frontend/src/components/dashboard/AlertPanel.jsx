import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { colors, getSeverityTokens } from "../../theme/colors";
import SeverityBadge from "../common/SeverityBadge";
import EmptyState from "../common/EmptyState";

export default function AlertPanel({ alerts = [] }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const severityFilters = ["All", "Critical", "High", "Medium", "Low"];

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedSeverity !== "All" && alert.severity?.toLowerCase() !== selectedSeverity.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSource = alert.source_ip?.toLowerCase().includes(query);
        const matchesDest = alert.destination_ip?.toLowerCase().includes(query);
        const matchesAttack = alert.attack?.toLowerCase().includes(query);
        const matchesAction = alert.action?.toLowerCase().includes(query);
        return matchesSource || matchesDest || matchesAttack || matchesAction;
      }
      return true;
    });
  }, [alerts, selectedSeverity, searchTerm]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 420,
        borderRadius: 2,
        bgcolor: colors.background.card,
        border: `1px solid ${colors.border.muted}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1.05rem" }}>
              Live Security Alerts
            </Typography>
            <Chip
              label={`${filteredAlerts.length} Active`}
              size="small"
              sx={{
                bgcolor: colors.accent.primaryGlow,
                color: colors.accent.primary,
                fontWeight: 800,
                fontSize: "0.68rem",
                height: 20,
              }}
            />
          </Box>
          <Typography sx={{ color: colors.text.muted, fontSize: "0.74rem", mt: 0.2 }}>
            Real-time automated detection feed from IIoT nodes
          </Typography>
        </Box>

        <Button
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
          onClick={() => navigate("/incidents")}
          sx={{
            color: colors.accent.primary,
            fontSize: "0.75rem",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { bgcolor: colors.accent.primaryGlow },
          }}
        >
          View All Alerts
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Box sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Filter by IP or Attack..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 140,
            "& .MuiInputBase-root": {
              height: 28,
              fontSize: "0.75rem",
              bgcolor: colors.background.secondary,
              borderRadius: 1.5,
              color: colors.text.primary,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.border.muted,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.text.muted, fontSize: 16 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 0.5 }}>
          {severityFilters.map((sev) => {
            const token = getSeverityTokens(sev);
            const isSelected = selectedSeverity === sev;

            return (
              <Chip
                key={sev}
                label={sev}
                size="small"
                onClick={() => setSelectedSeverity(sev)}
                sx={{
                  height: 24,
                  fontSize: "0.68rem",
                  fontWeight: isSelected ? 800 : 600,
                  bgcolor: isSelected
                    ? sev === "All"
                      ? colors.accent.primary
                      : token.color
                    : "rgba(148, 163, 184, 0.08)",
                  color: isSelected ? colors.background.main : colors.text.secondary,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Alert Feed */}
      {filteredAlerts.length > 0 ? (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 0.5,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {filteredAlerts.map((alert, index) => {
            const token = getSeverityTokens(alert.severity);

            return (
              <Box
                key={alert.id || index}
                onClick={() => setSelectedAlert(alert)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.2,
                  borderRadius: 1.5,
                  bgcolor: index === 0 ? "rgba(21, 31, 46, 0.9)" : "rgba(11, 18, 32, 0.6)",
                  border: `1px solid ${index === 0 ? "rgba(0, 212, 255, 0.3)" : colors.border.subtle}`,
                  borderLeft: `3px solid ${token.color}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(21, 31, 46, 1)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.85rem" }}>
                      {alert.attack} Attack Detected
                    </Typography>
                    <SeverityBadge severity={alert.severity} size="small" />
                  </Box>

                  <Typography sx={{ color: colors.text.secondary, fontSize: "0.72rem", fontFamily: "monospace", mt: 0.2 }}>
                    Source: {alert.source_ip || "10.0.0.X"} → Target: {alert.destination_ip || "192.168.1.X"}
                  </Typography>

                  <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem" }}>
                    Risk Score: <span style={{ color: token.color, fontWeight: 700 }}>{alert.risk_score || 0}</span> • Time: {alert.timestamp || "Just now"}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ color: colors.accent.primary, fontSize: "0.72rem", fontWeight: 700 }}>
                    {alert.action || "Log Event"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.muted, fontSize: "0.65rem" }}>
                    Click for telemetry
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <EmptyState
          title="NO ACTIVE SECURITY ALERTS"
          description="Network activity is currently within normal parameters."
        />
      )}

      {/* Forensic Telemetry Modal */}
      <Dialog
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: colors.background.card,
              border: `1px solid ${colors.border.muted}`,
              borderRadius: 2,
              p: 1,
              color: colors.text.primary,
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SecurityIcon sx={{ color: colors.accent.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Forensic Incident Telemetry #{selectedAlert?.id}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectedAlert(null)} sx={{ color: colors.text.muted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: colors.border.muted }}>
          {selectedAlert && (
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Threat Classification
                  </Typography>
                  <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 800 }}>
                    {selectedAlert.attack} Incursion
                  </Typography>
                </Box>
                <SeverityBadge severity={selectedAlert.severity} />
              </Box>

              <Divider sx={{ borderColor: colors.border.muted }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Source Endpoint
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: colors.text.primary, fontWeight: 600 }}>
                    {selectedAlert.source_ip}:{selectedAlert.source_port || "any"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Target Host
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: colors.text.primary, fontWeight: 600 }}>
                    {selectedAlert.destination_ip}:{selectedAlert.destination_port || "any"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Protocol / Service
                  </Typography>
                  <Typography sx={{ color: colors.accent.primary, fontWeight: 600 }}>
                    {selectedAlert.protocol?.toUpperCase() || "TCP"} / {selectedAlert.service || "general"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Risk Score
                  </Typography>
                  <Typography sx={{ color: colors.status.critical, fontWeight: 700 }}>
                    {selectedAlert.risk_score}% / 100
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: colors.border.muted }} />

              <Box sx={{ bgcolor: "rgba(11, 18, 32, 0.7)", p: 1.5, borderRadius: 1.5, border: `1px solid ${colors.border.subtle}` }}>
                <Typography variant="caption" sx={{ color: colors.accent.primary, fontWeight: 800 }}>
                  RECOMMENDED CONTAINMENT ACTION
                </Typography>
                <Typography sx={{ color: colors.text.primary, fontSize: "0.82rem", mt: 0.5 }}>
                  {selectedAlert.action === "Block IP"
                    ? `Automated firewall drop applied for ${selectedAlert.source_ip}. Target isolated.`
                    : selectedAlert.action === "Terminate Session"
                    ? `Active TCP socket closed on target ${selectedAlert.destination_ip}.`
                    : `Telemetry logged to database repository. Continuing active flow monitoring.`}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedAlert(null)} sx={{ color: colors.text.muted }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
