import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Divider,
  Stack,
  Chip,
  Button,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

import { colors, getSeverityTokens } from "../../theme/colors";
import { apiService } from "../../services/api";
import { useRealtimeStream } from "../../hooks/useRealtimeStream";

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [ackLoadingId, setAckLoadingId] = useState(null);

  const fetchNotificationCounts = useCallback(async () => {
    try {
      const data = await apiService.getUnreadNotificationCount();
      setUnreadCount(data.unread_count || 0);
      setCriticalCount(data.critical_count || 0);
    } catch (err) {
      console.warn("Unread notification count error:", err);
    }
  }, []);

  const fetchNotificationsList = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab === "ALL" ? {} : activeTab === "UNREAD" ? { status: "UNREAD" } : { severity: "Critical" };
      const data = await apiService.getNotifications(params);
      setNotifications(Array.isArray(data) ? data : []);
      fetchNotificationCounts();
    } catch (err) {
      console.warn("Fetch notifications list error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fetchNotificationCounts]);

  // Real-time notification arrival listener
  useRealtimeStream((alert) => {
    fetchNotificationCounts();
  });

  useEffect(() => {
    fetchNotificationCounts();
    const interval = setInterval(fetchNotificationCounts, 10000);
    return () => clearInterval(interval);
  }, [fetchNotificationCounts]);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    fetchNotificationsList();
  };

  const handleClose = () => setAnchorEl(null);

  const handleMarkAllRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      setUnreadCount(0);
      setCriticalCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" })));
    } catch (err) {
      console.warn("Mark all read error:", err);
    }
  };

  const handleAcknowledge = async (e, notifId) => {
    e.stopPropagation();
    setAckLoadingId(notifId);
    try {
      await apiService.acknowledgeNotification(notifId, { username: "SOC Analyst" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, status: "ACKNOWLEDGED", acknowledged_by: "SOC Analyst" } : n))
      );
      fetchNotificationCounts();
    } catch (err) {
      console.warn("Acknowledge error:", err);
    } finally {
      setAckLoadingId(null);
    }
  };

  const handleViewIncident = (incidentId) => {
    handleClose();
    if (incidentId) {
      navigate(`/incidents?id=${incidentId}`);
    } else {
      navigate("/incidents");
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Real-Time SOC Notification Center" arrow>
        <IconButton
          onClick={handleOpen}
          sx={{
            color: criticalCount > 0 ? colors.accent.error : unreadCount > 0 ? colors.accent.primary : colors.text.secondary,
            bgcolor: "rgba(15, 23, 42, 0.6)",
            border: `1px solid ${criticalCount > 0 ? colors.accent.error : colors.border.muted}`,
            position: "relative",
            "&:hover": {
              bgcolor: "rgba(30, 41, 59, 0.8)",
              borderColor: colors.accent.primary,
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color={criticalCount > 0 ? "error" : "primary"}
            max={99}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.68rem",
                height: 18,
                minWidth: 18,
                fontWeight: 700,
                animation: criticalCount > 0 ? "pulse 2s infinite" : "none",
              },
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: { xs: 340, sm: 420 },
            maxHeight: 560,
            bgcolor: colors.background.paper,
            border: `1px solid ${colors.border.subtle}`,
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0, 229, 168, 0.1)",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: "rgba(15, 23, 42, 0.9)", borderBottom: `1px solid ${colors.border.muted}` }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <SecurityIcon sx={{ color: colors.accent.primary, fontSize: 18 }} />
              <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.95rem" }}>
                Security Notifications
              </Typography>
            </Stack>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} Unread`}
                size="small"
                sx={{
                  bgcolor: "rgba(0, 229, 168, 0.15)",
                  color: colors.accent.primary,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            )}
          </Stack>

          {/* Filter Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              minHeight: 32,
              mt: 1.5,
              "& .MuiTab-root": {
                minHeight: 30,
                py: 0,
                px: 1.5,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: colors.text.muted,
                "&.Mui-selected": { color: colors.accent.primary },
              },
              "& .MuiTabs-indicator": { bgcolor: colors.accent.primary, height: 2 },
            }}
          >
            <Tab label="ALL" value="ALL" />
            <Tab label="UNREAD" value="UNREAD" />
            <Tab label="CRITICAL ONLY" value="CRITICAL" />
          </Tabs>
        </Box>

        {/* Notification List */}
        <Box sx={{ maxHeight: 380, overflowY: "auto", p: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} sx={{ color: colors.accent.primary }} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5, color: colors.text.muted }}>
              <CheckCircleIcon sx={{ fontSize: 36, color: colors.accent.primary, mb: 1, opacity: 0.6 }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>All Systems Secure</Typography>
              <Typography sx={{ fontSize: "0.72rem", color: colors.text.muted }}>
                No active security alerts pending triage.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n) => {
                const isCrit = n.severity === "Critical";
                const isHigh = n.severity === "High";
                const isUnread = n.status === "UNREAD";
                const isAck = n.status === "ACKNOWLEDGED";
                const tokens = getSeverityTokens(n.severity);

                return (
                  <ListItem
                    key={n.id}
                    disablePadding
                    sx={{
                      mb: 1,
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: isUnread
                        ? isCrit
                          ? "rgba(220, 38, 38, 0.08)"
                          : "rgba(15, 23, 42, 0.7)"
                        : "rgba(15, 23, 42, 0.3)",
                      border: `1px solid ${isUnread ? (isCrit ? "rgba(220, 38, 38, 0.4)" : colors.border.subtle) : colors.border.muted}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(30, 41, 59, 0.6)",
                      },
                    }}
                  >
                    {/* Top Row: Severity + Time + Status */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", mb: 0.8 }}>
                      <Stack direction="row" alignItems="center" gap={0.8}>
                        <Chip
                          label={n.severity}
                          size="small"
                          sx={{
                            bgcolor: tokens.bg,
                            color: tokens.text,
                            border: `1px solid ${tokens.border}`,
                            fontWeight: 800,
                            fontSize: "0.65rem",
                            height: 18,
                          }}
                        />
                        <Typography sx={{ color: colors.accent.primary, fontSize: "0.75rem", fontWeight: 700 }}>
                          {n.attack_type || "Security Threat"}
                        </Typography>
                      </Stack>

                      <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem" }}>
                        {n.created_at || "Just now"}
                      </Typography>
                    </Stack>

                    {/* Title & Message */}
                    <Typography sx={{ color: colors.text.primary, fontSize: "0.82rem", fontWeight: 700, mb: 0.5 }}>
                      {n.title}
                    </Typography>

                    {/* Affected Asset & Source */}
                    <Typography sx={{ color: colors.text.secondary, fontSize: "0.72rem", mb: 1 }}>
                      <b>Target:</b> <font color="#00E5A8">{n.affected_asset || "PLC-02"}</font> | <b>Source:</b> <code>{n.source_ip || "External"}</code>
                      {n.action_taken && (
                        <span> | <b>Action:</b> <font color="#8AFF80">{n.action_taken}</font></span>
                      )}
                    </Typography>

                    {/* Action Bar */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%", pt: 0.5, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                      <Stack direction="row" gap={1}>
                        {!isAck ? (
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={ackLoadingId === n.id}
                            onClick={(e) => handleAcknowledge(e, n.id)}
                            startIcon={ackLoadingId === n.id ? <CircularProgress size={12} /> : <CheckIcon sx={{ fontSize: 13 }} />}
                            sx={{
                              fontSize: "0.68rem",
                              py: 0.2,
                              px: 1,
                              borderColor: isCrit ? "rgba(220, 38, 38, 0.6)" : colors.border.subtle,
                              color: isCrit ? colors.accent.error : colors.accent.primary,
                              fontWeight: 700,
                              "&:hover": {
                                bgcolor: isCrit ? "rgba(220, 38, 38, 0.15)" : "rgba(0, 229, 168, 0.15)",
                              },
                            }}
                          >
                            ACKNOWLEDGE
                          </Button>
                        ) : (
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: "12px !important", color: "#00E5A8" }} />}
                            label="Acknowledged"
                            size="small"
                            sx={{
                              bgcolor: "rgba(0, 229, 168, 0.1)",
                              color: colors.accent.primary,
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              height: 20,
                            }}
                          />
                        )}
                      </Stack>

                      <Button
                        size="small"
                        onClick={() => handleViewIncident(n.incident_id)}
                        endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                        sx={{
                          fontSize: "0.68rem",
                          color: colors.text.secondary,
                          fontWeight: 700,
                          py: 0.2,
                          "&:hover": { color: colors.accent.primary },
                        }}
                      >
                        VIEW INCIDENT
                      </Button>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Divider sx={{ borderColor: colors.border.muted }} />
        <Box sx={{ p: 1.2, bgcolor: "rgba(15, 23, 42, 0.95)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            size="small"
            onClick={handleMarkAllRead}
            startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: "0.72rem", color: colors.text.muted, "&:hover": { color: colors.text.primary } }}
          >
            Mark all read
          </Button>

          <Button
            size="small"
            onClick={() => {
              handleClose();
              navigate("/incidents");
            }}
            sx={{ fontSize: "0.72rem", color: colors.accent.primary, fontWeight: 700 }}
          >
            Open Incident Center →
          </Button>
        </Box>
      </Popover>
    </>
  );
}
