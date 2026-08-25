import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PolicyIcon from "@mui/icons-material/Policy";

import { apiService } from "../services/api";
import { colors } from "../theme/colors";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");

  const eventTypes = [
    "All",
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "ACCOUNT_LOCKED_BRUTE_FORCE",
    "PASSWORD_CHANGED",
    "USER_LOGOUT",
  ];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAuditLogs({ limit: 200 });
      setLogs(data?.logs || []);
    } catch (err) {
      console.warn("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedEvent !== "All" && log.event !== selectedEvent) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesUser = log.username?.toLowerCase().includes(q);
        const matchesEvent = log.event?.toLowerCase().includes(q);
        const matchesIp = log.ip_address?.toLowerCase().includes(q);
        const matchesDetails = log.details?.toLowerCase().includes(q);
        return matchesUser || matchesEvent || matchesIp || matchesDetails;
      }
      return true;
    });
  }, [logs, selectedEvent, searchTerm]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <PolicyIcon sx={{ color: colors.accent.primary, fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Security Audit Logs
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
            Immutable administrative and operator event audit trail
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search by user, IP, event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            minWidth: 260,
            "& .MuiInputBase-root": {
              bgcolor: colors.background.card,
              color: colors.text.primary,
              borderRadius: 2,
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
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5 }}>
        {eventTypes.map((ev) => (
          <Chip
            key={ev}
            label={ev.replace(/_/g, " ")}
            onClick={() => setSelectedEvent(ev)}
            sx={{
              fontWeight: selectedEvent === ev ? 800 : 500,
              bgcolor: selectedEvent === ev ? colors.accent.primary : "rgba(148, 163, 184, 0.08)",
              color: selectedEvent === ev ? colors.background.main : colors.text.secondary,
              cursor: "pointer",
              fontSize: "0.72rem",
            }}
          />
        ))}
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={36} sx={{ color: colors.accent.primary }} />
          </Box>
        ) : filteredLogs.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Operator / User</TableCell>
                  <TableCell>Security Event</TableCell>
                  <TableCell>Origin IP</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trace Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => {
                  const isFail = log.status === "FAILED" || log.status === "BLOCKED";
                  const isWarn = log.status === "WARNING";

                  return (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ color: colors.text.muted, fontFamily: "monospace", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {log.timestamp}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.text.primary }}>
                        {log.username}
                      </TableCell>
                      <TableCell sx={{ color: colors.accent.primary, fontWeight: 600, fontSize: "0.82rem" }}>
                        {log.event}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", color: colors.text.secondary }}>
                        {log.ip_address}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.68rem",
                            height: 20,
                            color: isFail ? colors.status.critical : isWarn ? colors.status.warning : colors.status.safe,
                            bgcolor: isFail ? colors.status.criticalBg : isWarn ? colors.status.warningBg : colors.status.safeBg,
                            border: `1px solid ${isFail ? colors.status.criticalBorder : isWarn ? colors.status.warningBorder : colors.status.safeBorder}`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: colors.text.secondary, fontSize: "0.82rem" }}>
                        {log.details || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="NO AUDIT LOGS FOUND"
            description="No system audit records matching the specified filters."
          />
        )}
      </Paper>
    </Box>
  );
}
