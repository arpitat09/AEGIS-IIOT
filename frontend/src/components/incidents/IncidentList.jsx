import { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
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
import SecurityIcon from "@mui/icons-material/Security";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HelpIcon from "@mui/icons-material/Help";

import StatusChip from "../common/StatusChip";
import { apiService } from "../../services/api";

const STATUS_CONFIG = {
  Open: { color: "#F97316", bg: "rgba(249, 115, 22, 0.12)" },
  Investigating: { color: "#38BDF8", bg: "rgba(56, 189, 248, 0.12)" },
  Contained: { color: "#FACC15", bg: "rgba(250, 204, 21, 0.12)" },
  Resolved: { color: "#22C55E", bg: "rgba(34, 197, 94, 0.12)" },
  "False Positive": { color: "#94A3B8", bg: "rgba(148, 163, 184, 0.12)" },
};

function IncidentList({ incidents = [], onIncidentUpdated }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const statusFilters = ["All", "Open", "Investigating", "Contained", "Resolved", "False Positive"];

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      setUpdatingId(incidentId);
      await apiService.updateIncident(incidentId, { status: newStatus });
      if (onIncidentUpdated) {
        onIncidentUpdated();
      }
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update incident status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Status filter
      if (selectedStatus !== "All") {
        const currentStatus = inc.status || "Investigating";
        if (currentStatus.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }
      // Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = `inc-${inc.id}`.includes(query) || `${inc.id}`.includes(query);
        const matchesSrc = inc.source_ip?.toLowerCase().includes(query);
        const matchesDst = inc.destination_ip?.toLowerCase().includes(query);
        const matchesAttack = inc.attack?.toLowerCase().includes(query);
        return matchesId || matchesSrc || matchesDst || matchesAttack;
      }
      return true;
    });
  }, [incidents, selectedStatus, searchTerm]);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        border: "1px solid #1F2937",
        overflow: "hidden",
      }}
    >
      {/* Header & Filter Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#F9FAFB",
            }}
          >
            Incident Operations & Lifecycle Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Triage, contain, and resolve active industrial network security events
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search by ID, IP, or Attack..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 240,
            "& .MuiInputBase-root": {
              bgcolor: "rgba(15, 23, 42, 0.8)",
              borderRadius: 2,
              color: "#F8FAFC",
              fontSize: "0.85rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(148, 163, 184, 0.15)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748B", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Status Filter Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 0.5 }}>
        {statusFilters.map((st) => (
          <Chip
            key={st}
            label={st}
            onClick={() => setSelectedStatus(st)}
            sx={{
              fontWeight: selectedStatus === st ? 800 : 500,
              bgcolor:
                selectedStatus === st
                  ? "#2563EB"
                  : "rgba(148, 163, 184, 0.08)",
              color: selectedStatus === st ? "#FFFFFF" : "#94A3B8",
              cursor: "pointer",
              "&:hover": {
                bgcolor: selectedStatus === st ? undefined : "rgba(148, 163, 184, 0.15)",
              },
            }}
          />
        ))}
      </Box>

      {/* Incident Table */}
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Attack</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Source IP</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Destination IP</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, bgcolor: "#0F172A", color: "#CBD5E1" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident) => {
                const status = incident.status || "Investigating";
                const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.Investigating;

                return (
                  <TableRow
                    key={incident.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(37, 99, 235, 0.08)",
                      },
                    }}
                  >
                    <TableCell
                      onClick={() => setSelectedIncident(incident)}
                      sx={{ fontWeight: 700, color: "#60A5FA", fontFamily: "monospace" }}
                    >
                      INC-{incident.id}
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)} sx={{ fontWeight: 600, color: "#F8FAFC" }}>
                      {incident.attack || "Unknown"}
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)}>
                      <StatusChip status={incident.severity || "Low"} />
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)} sx={{ fontFamily: "monospace", color: "#CBD5E1" }}>
                      {incident.source_ip || "-"}
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)} sx={{ fontFamily: "monospace", color: "#CBD5E1" }}>
                      {incident.destination_ip || "-"}
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)} sx={{ color: "#94A3B8", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {incident.timestamp || "-"}
                    </TableCell>

                    <TableCell onClick={() => setSelectedIncident(incident)}>
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          color: statusCfg.color,
                          bgcolor: statusCfg.bg,
                          border: `1px solid ${statusCfg.color}30`,
                        }}
                      />
                    </TableCell>

                    {/* Quick Status Action Buttons */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                        <Tooltip title="Investigate Incident" arrow>
                          <span>
                            <IconButton
                              size="small"
                              disabled={status === "Investigating" || updatingId === incident.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(incident.id, "Investigating");
                              }}
                              sx={{ color: "#38BDF8", bgcolor: "rgba(56, 189, 248, 0.08)" }}
                            >
                              <FindInPageIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Mark Contained" arrow>
                          <span>
                            <IconButton
                              size="small"
                              disabled={status === "Contained" || updatingId === incident.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(incident.id, "Contained");
                              }}
                              sx={{ color: "#FACC15", bgcolor: "rgba(250, 204, 21, 0.08)" }}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Resolve Incident" arrow>
                          <span>
                            <IconButton
                              size="small"
                              disabled={status === "Resolved" || updatingId === incident.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(incident.id, "Resolved");
                              }}
                              sx={{ color: "#22C55E", bgcolor: "rgba(34, 197, 94, 0.08)" }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Mark False Positive" arrow>
                          <span>
                            <IconButton
                              size="small"
                              disabled={status === "False Positive" || updatingId === incident.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(incident.id, "False Positive");
                              }}
                              sx={{ color: "#94A3B8", bgcolor: "rgba(148, 163, 184, 0.08)" }}
                            >
                              <HelpIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                  No security incidents matching current filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Incident Details & Analyst Triage Modal */}
      <Dialog
        open={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#0F172A",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 3,
              p: 1,
              color: "#F8FAFC",
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SecurityIcon sx={{ color: "#3B82F6" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Incident Triage & Forensics #INC-{selectedIncident?.id}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectedIncident(null)} sx={{ color: "#94A3B8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(148, 163, 184, 0.12)" }}>
          {selectedIncident && (
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Threat Classification
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                    {selectedIncident.attack} Attack
                  </Typography>
                </Box>
                <StatusChip status={selectedIncident.severity || "Low"} />
              </Box>

              <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Source IP Address
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: "#F8FAFC", fontWeight: 600 }}>
                    {selectedIncident.source_ip || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Destination Target
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: "#F8FAFC", fontWeight: 600 }}>
                    {selectedIncident.destination_ip || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Risk Score Index
                  </Typography>
                  <Typography sx={{ color: "#EF4444", fontWeight: 700 }}>
                    {selectedIncident.risk_score || 0}% / 100
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    ML Confidence
                  </Typography>
                  <Typography sx={{ color: "#22C55E", fontWeight: 700 }}>
                    {((selectedIncident.confidence || 0.95) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

              {/* Status Transition Toolbar */}
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 1, fontWeight: 700 }}>
                  UPDATE INCIDENT STATUS
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {["Open", "Investigating", "Contained", "Resolved", "False Positive"].map((st) => (
                    <Button
                      key={st}
                      variant={selectedIncident.status === st ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleStatusChange(selectedIncident.id, st)}
                      sx={{
                        fontSize: "0.72rem",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {st}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedIncident(null)} sx={{ color: "#94A3B8" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default IncidentList;
