import { useState, useEffect } from "react";
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
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { colors, getSeverityTokens } from "../../theme/colors";
import { apiService } from "../../services/api";

export default function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchRecentEvents = async () => {
    try {
      const data = await apiService.getDashboard();
      const recent = data?.recent_alerts || [];
      
      const mapped = recent.slice(0, 8).map((alert, idx) => {
        const isCrit = alert.severity === "Critical";
        const isHigh = alert.severity === "High";

        return {
          id: alert.id || `notif-${idx}`,
          title: `${alert.attack || "Security"} Event Detected`,
          description: `${alert.source_ip || "External"} → ${alert.destination_ip || "Internal"} (${alert.action || "Monitored"})`,
          severity: alert.severity || "Medium",
          time: alert.timestamp || "Just now",
          type: isCrit ? "critical" : isHigh ? "warning" : "info",
        };
      });

      // Add system health notification
      mapped.push({
        id: "sys-0",
        title: "AEGIS-IIOT Engine Synchronized",
        description: "Scapy packet sniffer and ML hybrid classifiers active.",
        severity: "Normal",
        time: "Active",
        type: "success",
      });

      setNotifications(mapped);
      setUnreadCount(mapped.filter((n) => n.type === "critical" || n.type === "warning").length);
    } catch (err) {
      console.warn("NotificationCenter fetch warning:", err);
    }
  };

  useEffect(() => {
    fetchRecentEvents();
    const interval = setInterval(fetchRecentEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Security Notification Center" arrow>
        <IconButton
          onClick={handleOpen}
          sx={{
            color: unreadCount > 0 ? colors.accent.primary : colors.text.secondary,
            bgcolor: "rgba(15, 23, 42, 0.6)",
            border: `1px solid ${colors.border.muted}`,
            "&:hover": {
              bgcolor: "rgba(30, 41, 59, 0.8)",
              borderColor: colors.accent.primary,
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsNoneIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: colors.background.card,
              border: `1px solid ${colors.border.muted}`,
              borderRadius: 2,
              p: 2,
              width: 360,
              maxHeight: 460,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Security Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} New`}
                size="small"
                sx={{
                  bgcolor: colors.status.criticalBg,
                  color: colors.status.critical,
                  border: `1px solid ${colors.status.criticalBorder}`,
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  height: 20,
                }}
              />
            )}
          </Box>

          <Button
            size="small"
            startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
            onClick={handleMarkAllRead}
            sx={{
              color: colors.text.muted,
              fontSize: "0.72rem",
              p: 0,
              minWidth: "auto",
              "&:hover": { color: colors.accent.primary },
            }}
          >
            Mark Read
          </Button>
        </Box>

        <Divider sx={{ borderColor: colors.border.muted, mb: 1.5 }} />

        <Stack spacing={1} sx={{ maxHeight: 340, overflowY: "auto", pr: 0.5 }}>
          {notifications.map((notif) => {
            const token = getSeverityTokens(notif.severity);

            return (
              <Box
                key={notif.id}
                sx={{
                  p: 1.2,
                  borderRadius: 1.5,
                  bgcolor: "rgba(11, 18, 32, 0.6)",
                  border: `1px solid ${colors.border.subtle}`,
                  borderLeft: `3px solid ${token.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.3,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(21, 31, 46, 0.8)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.82rem" }}>
                    {notif.title}
                  </Typography>
                  <Typography sx={{ color: colors.text.muted, fontSize: "0.68rem" }}>
                    {notif.time}
                  </Typography>
                </Box>

                <Typography sx={{ color: colors.text.secondary, fontSize: "0.74rem" }}>
                  {notif.description}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Popover>
    </>
  );
}
