import { useState, useEffect } from "react";
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
  Alert,
  TextField,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import ForumIcon from "@mui/icons-material/Forum";
import SmsIcon from "@mui/icons-material/Sms";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import HubIcon from "@mui/icons-material/Hub";

import { colors } from "../theme/colors";
import { apiService } from "../services/api";

export default function Integrations() {
  const [channels, setChannels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await apiService.getIntegrationsStatus();
      setChannels(data);
    } catch (err) {
      console.warn("Failed to fetch integrations status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTest = async (channelKey) => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const result = await apiService.testIntegration({ channel: channelKey });
      setTestResult({
        channel: channelKey,
        success: result.success,
        message: result.message || "Test dispatch completed successfully.",
      });
    } catch (err) {
      setTestResult({
        channel: channelKey,
        success: false,
        message: "Failed to dispatch test notification.",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const channelList = [
    {
      key: "IN_APP",
      title: "In-App SOC Notification Center",
      icon: <NotificationsActiveIcon sx={{ fontSize: 28, color: colors.accent.primary }} />,
      desc: "Instant Server-Sent Events (SSE) push to all active authenticated SOC analyst browser sessions.",
      status: channels?.in_app?.status || "Connected",
      badgeColor: colors.accent.primary,
    },
    {
      key: "EMAIL",
      title: "Email SMTP Gateway",
      icon: <EmailIcon sx={{ fontSize: 28, color: colors.accent.info }} />,
      desc: "Sends HTML incident telemetry reports to security distribution lists upon High/Critical alert triage.",
      status: channels?.email?.status || "Connected",
      badgeColor: colors.accent.info,
    },
    {
      key: "SLACK",
      title: "Slack & Microsoft Teams",
      icon: <ForumIcon sx={{ fontSize: 28, color: colors.accent.warning }} />,
      desc: "Posts real-time incident summaries and containment triggers to enterprise security channels.",
      status: channels?.slack?.status || "Connected",
      badgeColor: colors.accent.warning,
    },
    {
      key: "SMS",
      title: "Twilio SMS Critical Incursion",
      icon: <SmsIcon sx={{ fontSize: 28, color: colors.accent.error }} />,
      desc: "Dispatches SMS alerts to on-call OT engineers for P1-Critical unacknowledged incursions.",
      status: channels?.sms?.status || "Connected",
      badgeColor: colors.accent.error,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
        <HubIcon sx={{ color: colors.accent.primary, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
            Enterprise Notification & SIEM Integrations
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Configure and verify multi-channel dispatch pipelines for real-time cyber threat escalation.
          </Typography>
        </Box>
      </Stack>

      {testResult && (
        <Alert
          severity={testResult.success ? "success" : "error"}
          sx={{ mb: 3, bgcolor: "rgba(15, 23, 42, 0.9)", border: `1px solid ${colors.border.subtle}` }}
        >
          <b>[{testResult.channel}]</b> {testResult.message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: colors.accent.primary }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {channelList.map((ch) => (
            <Grid item xs={12} md={6} key={ch.key}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: colors.background.paper,
                  border: `1px solid ${colors.border.subtle}`,
                  borderRadius: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    {ch.icon}
                    <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1rem" }}>
                      {ch.title}
                    </Typography>
                  </Stack>
                  <Chip
                    label={ch.status}
                    size="small"
                    sx={{
                      bgcolor: "rgba(0, 229, 168, 0.15)",
                      color: ch.badgeColor,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                    }}
                  />
                </Stack>

                <Typography sx={{ color: colors.text.secondary, fontSize: "0.82rem", lineHeight: 1.5, flex: 1, mb: 2.5 }}>
                  {ch.desc}
                </Typography>

                <Divider sx={{ borderColor: colors.border.muted, mb: 2 }} />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: "0.72rem", color: colors.text.muted }}>
                    Env: <code>{ch.key} Configuration</code>
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={testLoading}
                    onClick={() => handleTest(ch.key)}
                    startIcon={<SendIcon sx={{ fontSize: 13 }} />}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      borderColor: colors.border.subtle,
                      color: colors.text.primary,
                      "&:hover": { borderColor: colors.accent.primary, bgcolor: "rgba(0, 229, 168, 0.05)" },
                    }}
                  >
                    Send Test Alert
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
