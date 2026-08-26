import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import BlockIcon from "@mui/icons-material/Block";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { colors, getSeverityTokens } from "../theme/colors";
import { apiService } from "../services/api";

const STATUS_TABS = ["ALL", "NEW", "ACKNOWLEDGED", "INVESTIGATING", "CONTAINED", "RESOLVED", "CLOSED"];

export default function Incidents() {
  const [searchParams] = useSearchParams();
  const directId = searchParams.get("id");

  const [incidents, setIncidents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [noteText, setNoteText] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [incData, sumData] = await Promise.all([
        apiService.getIncidents({ status: activeTab, search: searchQuery }),
        apiService.getIncidentSummary(),
      ]);
      setIncidents(Array.isArray(incData) ? incData : []);
      setSummary(sumData);

      if (directId && Array.isArray(incData)) {
        const found = incData.find((i) => String(i.id) === String(directId) || i.incident_code === directId);
        if (found) setSelectedIncident(found);
      }
    } catch (err) {
      console.warn("Failed to fetch incidents:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, directId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (newStatus) => {
    if (!selectedIncident) return;
    setActionLoading(true);
    try {
      const updated = await apiService.updateIncidentStatus(selectedIncident.id, {
        status: newStatus,
        notes: noteText || undefined,
        username: "SOC Analyst",
      });
      setSelectedIncident(updated);
      setNoteText("");
      fetchData();
    } catch (err) {
      console.warn("Status change error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleContainment = async (actionType) => {
    if (!selectedIncident) return;
    setActionLoading(true);
    try {
      const updated = await apiService.containIncident(selectedIncident.id, {
        action: actionType,
        username: "SOC Analyst",
      });
      setSelectedIncident(updated);
      fetchData();
    } catch (err) {
      console.warn("Containment error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Top Header */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" gap={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary, letterSpacing: "-0.5px" }}>
            Incident Response & Containment Center
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Correlated industrial cybersecurity incidents, AI root-cause interpretation, and mitigation workflows.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchData}
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: colors.border.subtle,
            color: colors.text.primary,
            fontSize: "0.8rem",
            "&:hover": { borderColor: colors.accent.primary, bgcolor: "rgba(0, 229, 168, 0.05)" },
          }}
        >
          Refresh Telemetry
        </Button>
      </Stack>

      {/* Metric Counters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Active Incidents", val: summary?.active_count ?? 0, color: colors.accent.warning },
          { label: "Critical Priority", val: summary?.critical ?? 0, color: colors.accent.error },
          { label: "Contained Threats", val: summary?.contained_count ?? 0, color: colors.accent.primary },
          { label: "Total Correlated", val: summary?.total ?? 0, color: colors.text.primary },
        ].map((m, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card sx={{ p: 2, bgcolor: colors.background.paper, border: `1px solid ${colors.border.subtle}`, borderRadius: 2 }}>
              <Typography sx={{ color: colors.text.muted, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                {m.label}
              </Typography>
              <Typography sx={{ color: m.color, fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.2, mt: 0.5 }}>
                {m.val}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Bar & Tabs */}
      <Card sx={{ bgcolor: colors.background.paper, border: `1px solid ${colors.border.subtle}`, borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" sx={{ p: 1.5, gap: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontSize: "0.78rem",
                fontWeight: 700,
                color: colors.text.muted,
                "&.Mui-selected": { color: colors.accent.primary },
              },
              "& .MuiTabs-indicator": { bgcolor: colors.accent.primary },
            }}
          >
            {STATUS_TABS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <TextField
            size="small"
            placeholder="Search IP, Asset, or Incident ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: colors.text.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: 280 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(15, 23, 42, 0.6)",
                fontSize: "0.8rem",
                color: colors.text.primary,
                "& fieldset": { borderColor: colors.border.muted },
              },
            }}
          />
        </Stack>
      </Card>

      {/* Incident List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: colors.accent.primary }} />
        </Box>
      ) : incidents.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", bgcolor: colors.background.paper, border: `1px solid ${colors.border.subtle}` }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: colors.accent.primary, mb: 1, opacity: 0.7 }} />
          <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "1.1rem" }}>
            No Incidents Found
          </Typography>
          <Typography sx={{ color: colors.text.muted, fontSize: "0.85rem" }}>
            There are no incidents matching the current filter criteria.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {incidents.map((inc) => {
            const tokens = getSeverityTokens(inc.severity);
            const isCrit = inc.severity === "Critical";

            return (
              <Grid item xs={12} md={6} lg={4} key={inc.id}>
                <Card
                  onClick={() => setSelectedIncident(inc)}
                  sx={{
                    p: 2.5,
                    bgcolor: colors.background.paper,
                    border: `1px solid ${isCrit ? "rgba(220, 38, 38, 0.4)" : colors.border.subtle}`,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: colors.accent.primary,
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  {/* Top: Code + Priority + Status */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography sx={{ color: colors.accent.primary, fontWeight: 800, fontSize: "0.85rem" }}>
                        {inc.incident_code || `AEGIS-INC-${inc.id}`}
                      </Typography>
                      <Chip
                        label={inc.priority || "P2-High"}
                        size="small"
                        sx={{
                          bgcolor: isCrit ? "rgba(220, 38, 38, 0.2)" : "rgba(245, 158, 11, 0.15)",
                          color: isCrit ? colors.accent.error : colors.accent.warning,
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          height: 18,
                        }}
                      />
                    </Stack>

                    <Chip
                      label={inc.status || "NEW"}
                      size="small"
                      sx={{
                        bgcolor: inc.status === "CONTAINED" ? "rgba(0, 229, 168, 0.15)" : "rgba(255,255,255,0.08)",
                        color: inc.status === "CONTAINED" ? colors.accent.primary : colors.text.secondary,
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        height: 20,
                      }}
                    />
                  </Stack>

                  {/* Title */}
                  <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.95rem", mb: 1 }}>
                    {inc.title}
                  </Typography>

                  {/* Telemetry Stats */}
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}`, mb: 2 }}>
                    <Typography sx={{ fontSize: "0.75rem", color: colors.text.secondary, mb: 0.5 }}>
                      <b>Target:</b> <font color="#00E5A8">{inc.affected_asset || "PLC-02"}</font> ({inc.destination_ip || "Internal"})
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: colors.text.secondary, mb: 0.5 }}>
                      <b>Attacker:</b> <code>{inc.source_ip || "External"}</code>
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <Typography sx={{ fontSize: "0.7rem", color: colors.text.muted }}>
                        Events: <b>{inc.event_count || 1}</b>
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: isCrit ? colors.accent.error : colors.accent.warning, fontWeight: 700 }}>
                        Risk: {inc.risk_score || 75}/100
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Bottom Action Footer */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted }}>
                      Seen: {inc.last_seen || "Recent"}
                    </Typography>
                    <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />} sx={{ fontSize: "0.72rem", color: colors.accent.primary, fontWeight: 700 }}>
                      Investigate
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Incident Deep-Dive Dialog */}
      <Dialog
        open={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: colors.background.paper,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: 2.5,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)",
          },
        }}
      >
        {selectedIncident && (
          <>
            <DialogTitle sx={{ p: 2.5, bgcolor: "rgba(15, 23, 42, 0.9)", borderBottom: `1px solid ${colors.border.muted}` }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <SecurityIcon sx={{ color: colors.accent.primary }} />
                  <Box>
                    <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1.1rem" }}>
                      {selectedIncident.incident_code || `AEGIS-INC-${selectedIncident.id}`}
                    </Typography>
                    <Typography sx={{ color: colors.text.muted, fontSize: "0.75rem" }}>
                      {selectedIncident.title}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setSelectedIncident(null)} sx={{ color: colors.text.muted }}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {/* Telemetry Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted, textTransform: "uppercase" }}>Severity</Typography>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: colors.accent.error }}>
                      {selectedIncident.severity}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted, textTransform: "uppercase" }}>Risk Score</Typography>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: colors.accent.warning }}>
                      {selectedIncident.risk_score}/100
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted, textTransform: "uppercase" }}>Event Count</Typography>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: colors.accent.primary }}>
                      {selectedIncident.event_count || 1}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}` }}>
                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted, textTransform: "uppercase" }}>Current State</Typography>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: colors.text.primary }}>
                      {selectedIncident.status}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* AI Incident Summary Box */}
              <Box sx={{ p: 2.5, bgcolor: "rgba(13, 148, 136, 0.08)", border: `1px solid rgba(13, 148, 136, 0.3)`, borderRadius: 2, mb: 3 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ color: colors.accent.primary, fontSize: 20 }} />
                  <Typography sx={{ color: colors.accent.primary, fontWeight: 800, fontSize: "0.95rem" }}>
                    AI Incident Forensic Summary
                  </Typography>
                </Stack>
                <Typography sx={{ color: colors.text.primary, fontSize: "0.82rem", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                  {selectedIncident.ai_summary || "Analyzing incident telemetry..."}
                </Typography>
              </Box>

              {/* Tactical Response Playbook */}
              <Box sx={{ p: 2, bgcolor: "rgba(15, 23, 42, 0.6)", border: `1px solid ${colors.border.muted}`, borderRadius: 2, mb: 3 }}>
                <Typography sx={{ color: colors.text.secondary, fontWeight: 700, fontSize: "0.85rem", mb: 1 }}>
                  🛡️ AI Recommended Response Playbook
                </Typography>
                <Typography sx={{ color: colors.text.primary, fontSize: "0.8rem", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                  {selectedIncident.ai_recommended_response || "1. Verify source authorization\n2. Maintain containment\n3. Review PLC logs"}
                </Typography>
              </Box>

              {/* Add Note */}
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add investigation findings or analyst notes..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(15, 23, 42, 0.6)",
                    fontSize: "0.82rem",
                    color: colors.text.primary,
                    "& fieldset": { borderColor: colors.border.muted },
                  },
                }}
              />
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: "rgba(15, 23, 42, 0.9)", borderTop: `1px solid ${colors.border.muted}`, justifyContent: "space-between" }}>
              <Stack direction="row" gap={1}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={actionLoading}
                  onClick={() => handleContainment("Block IP")}
                  startIcon={<BlockIcon />}
                  sx={{ fontSize: "0.75rem", fontWeight: 700 }}
                >
                  BLOCK IP
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={actionLoading}
                  onClick={() => handleContainment("Isolate Device")}
                  startIcon={<ShieldIcon />}
                  sx={{ fontSize: "0.75rem", fontWeight: 700 }}
                >
                  ISOLATE DEVICE
                </Button>
              </Stack>

              <Stack direction="row" gap={1}>
                {selectedIncident.status === "NEW" && (
                  <Button
                    variant="contained"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange("ACKNOWLEDGED")}
                    sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800, fontSize: "0.75rem" }}
                  >
                    ACKNOWLEDGE
                  </Button>
                )}
                {selectedIncident.status !== "RESOLVED" && selectedIncident.status !== "CLOSED" && (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange("RESOLVED")}
                    sx={{ fontWeight: 800, fontSize: "0.75rem" }}
                  >
                    MARK RESOLVED
                  </Button>
                )}
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
