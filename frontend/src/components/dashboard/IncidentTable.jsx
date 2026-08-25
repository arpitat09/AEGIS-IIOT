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
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Button,
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
import FindInPageIcon from "@mui/icons-material/FindInPage";

import { colors } from "../../theme/colors";
import SeverityBadge from "../common/SeverityBadge";
import StatusBadge from "../common/StatusBadge";
import RiskBadge from "../common/RiskBadge";
import EmptyState from "../common/EmptyState";
import { apiService } from "../../services/api";

export default function IncidentTable({ incidents = [], onIncidentUpdated }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [attackFilter, setAttackFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      if (severityFilter !== "All" && item.severity?.toLowerCase() !== severityFilter.toLowerCase()) {
        return false;
      }
      if (attackFilter !== "All" && item.attack?.toLowerCase() !== attackFilter.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesId = `inc-${item.id}`.includes(q) || `${item.id}`.includes(q);
        const matchesSource = item.source_ip?.toLowerCase().includes(q);
        const matchesDest = item.destination_ip?.toLowerCase().includes(q);
        const matchesAttack = item.attack?.toLowerCase().includes(q);
        return matchesId || matchesSource || matchesDest || matchesAttack;
      }
      return true;
    });
  }, [incidents, severityFilter, attackFilter, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiService.updateIncident(id, { status });
      if (onIncidentUpdated) onIncidentUpdated();
      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const paginatedItems = filteredIncidents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: colors.background.card,
        border: `1px solid ${colors.border.muted}`,
      }}
    >
      {/* Header & Filters */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary, letterSpacing: -0.2 }}>
            Real-Time Security Incidents
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.2 }}>
            Correlated cyber events requiring security operations triage
          </Typography>
        </Box>

        {/* Filter Controls */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search ID, IP, or Attack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 200,
              "& .MuiInputBase-root": {
                bgcolor: colors.background.secondary,
                borderRadius: 1.5,
                color: colors.text.primary,
                fontSize: "0.82rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.border.muted,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.text.muted, fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              sx={{
                bgcolor: colors.background.secondary,
                color: colors.text.primary,
                fontSize: "0.82rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border.muted },
              }}
            >
              <MenuItem value="All">All Severity</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={attackFilter}
              onChange={(e) => setAttackFilter(e.target.value)}
              sx={{
                bgcolor: colors.background.secondary,
                color: colors.text.primary,
                fontSize: "0.82rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.border.muted },
              }}
            >
              <MenuItem value="All">All Attacks</MenuItem>
              <MenuItem value="Probe">Probe</MenuItem>
              <MenuItem value="DoS">DoS</MenuItem>
              <MenuItem value="R2L">R2L</MenuItem>
              <MenuItem value="U2R">U2R</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
      {filteredIncidents.length > 0 ? (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Incident ID</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Attack Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Protocol</TableCell>
                  <TableCell>Risk Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedItems.map((inc) => (
                  <TableRow
                    key={inc.id}
                    hover
                    onClick={() => setSelectedIncident(inc)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgba(0, 212, 255, 0.04)" },
                    }}
                  >
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: colors.accent.primary }}>
                      INC-{inc.id}
                    </TableCell>

                    <TableCell sx={{ color: colors.text.muted, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      {inc.timestamp || "-"}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 700, color: colors.text.primary }}>
                      {inc.attack || "Unknown"}
                    </TableCell>

                    <TableCell>
                      <SeverityBadge severity={inc.severity} size="small" />
                    </TableCell>

                    <TableCell sx={{ fontFamily: "monospace", color: colors.text.secondary }}>
                      {inc.source_ip || "-"}
                    </TableCell>

                    <TableCell sx={{ fontFamily: "monospace", color: colors.text.secondary }}>
                      {inc.destination_ip || "-"}
                    </TableCell>

                    <TableCell sx={{ color: colors.accent.primary, fontWeight: 600, fontSize: "0.78rem" }}>
                      {inc.protocol?.toUpperCase() || "TCP"}
                    </TableCell>

                    <TableCell>
                      <RiskBadge score={inc.risk_score} showScoreOnly />
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={inc.status || "Active"} size="small" />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                        }}
                        sx={{
                          fontSize: "0.7rem",
                          py: 0.2,
                          px: 1,
                          borderColor: colors.border.muted,
                          color: colors.accent.primary,
                          "&:hover": { borderColor: colors.accent.primary, bgcolor: colors.accent.primaryGlow },
                        }}
                      >
                        Investigate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredIncidents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: colors.text.secondary,
              borderColor: colors.border.muted,
              "& .MuiTablePagination-select": { color: colors.text.primary },
            }}
          />
        </>
      ) : (
        <EmptyState
          title="NO INCIDENTS RECORDED"
          description="No security incidents matching current query criteria."
        />
      )}

      {/* Forensic Triage Dialog */}
      <Dialog
        open={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
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
              Incident Triage #INC-{selectedIncident?.id}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectedIncident(null)} sx={{ color: colors.text.muted }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: colors.border.muted }}>
          {selectedIncident && (
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Threat Classification
                  </Typography>
                  <Typography variant="h5" sx={{ color: colors.text.primary, fontWeight: 800 }}>
                    {selectedIncident.attack} Attack
                  </Typography>
                </Box>
                <SeverityBadge severity={selectedIncident.severity} />
              </Box>

              <Divider sx={{ borderColor: colors.border.muted }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Source Endpoint
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: colors.text.primary, fontWeight: 600 }}>
                    {selectedIncident.source_ip || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Target Host
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", color: colors.text.primary, fontWeight: 600 }}>
                    {selectedIncident.destination_ip || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Risk Score
                  </Typography>
                  <Typography sx={{ color: colors.status.critical, fontWeight: 700 }}>
                    {selectedIncident.risk_score}% / 100
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Protocol / Service
                  </Typography>
                  <Typography sx={{ color: colors.accent.primary, fontWeight: 600 }}>
                    {selectedIncident.protocol?.toUpperCase()} / {selectedIncident.service || "general"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: colors.border.muted }} />

              {/* Status Action Buttons */}
              <Box>
                <Typography variant="caption" sx={{ color: colors.text.muted, display: "block", mb: 1, fontWeight: 700 }}>
                  UPDATE INCIDENT STATUS
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {["Open", "Investigating", "Contained", "Resolved", "False Positive"].map((st) => (
                    <Button
                      key={st}
                      variant={selectedIncident.status === st ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleStatusUpdate(selectedIncident.id, st)}
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        borderColor: colors.border.muted,
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
          <Button onClick={() => setSelectedIncident(null)} sx={{ color: colors.text.muted }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
