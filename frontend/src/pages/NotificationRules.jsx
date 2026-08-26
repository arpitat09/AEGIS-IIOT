import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import PolicyIcon from "@mui/icons-material/Policy";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import ForumIcon from "@mui/icons-material/Forum";
import SmsIcon from "@mui/icons-material/Sms";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { colors } from "../theme/colors";
import { apiService } from "../services/api";

export default function NotificationRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    severity_threshold: "HIGH",
    min_risk_score: 70,
    min_event_count: 1,
    time_window_seconds: 60,
    notify_in_app: true,
    notify_email: true,
    notify_slack: true,
    notify_sms: false,
    escalate_after_minutes: 5,
    recipient_roles: "SECURITY_ANALYST,ADMIN",
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await apiService.getNotificationRules();
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to fetch notification rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleActive = async (rule) => {
    try {
      const updated = await apiService.updateNotificationRule(rule.id, {
        is_active: !rule.is_active,
      });
      setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    } catch (err) {
      console.warn("Toggle rule error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteNotificationRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.warn("Delete rule error:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const newRule = await apiService.createNotificationRule(formData);
      setRules((prev) => [...prev, newRule]);
      setOpenCreate(false);
      setFormData({
        name: "",
        severity_threshold: "HIGH",
        min_risk_score: 70,
        min_event_count: 1,
        time_window_seconds: 60,
        notify_in_app: true,
        notify_email: true,
        notify_slack: true,
        notify_sms: false,
        escalate_after_minutes: 5,
        recipient_roles: "SECURITY_ANALYST,ADMIN",
      });
    } catch (err) {
      console.warn("Create rule error:", err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
            Notification & Escalation Rules Engine
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Define deterministic condition triggers, multi-channel dispatch policies, and automatic SOC escalation timelines.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800, fontSize: "0.8rem" }}
        >
          Create Policy
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: colors.accent.primary }} />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {rules.map((rule) => (
            <Grid item xs={12} md={6} key={rule.id}>
              <Card
                sx={{
                  p: 2.5,
                  bgcolor: colors.background.paper,
                  border: `1px solid ${rule.is_active ? colors.border.subtle : colors.border.muted}`,
                  borderRadius: 2,
                  opacity: rule.is_active ? 1 : 0.6,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PolicyIcon sx={{ color: colors.accent.primary, fontSize: 20 }} />
                    <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.95rem" }}>
                      {rule.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Switch
                      checked={rule.is_active}
                      onChange={() => handleToggleActive(rule)}
                      size="small"
                      color="primary"
                    />
                    <IconButton size="small" onClick={() => handleDelete(rule.id)} sx={{ color: colors.text.muted }}>
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Criteria Box */}
                <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.6)", borderRadius: 1.5, border: `1px solid ${colors.border.muted}`, mb: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.text.secondary, mb: 0.5 }}>
                    <b>Trigger Condition:</b> Severity ≥ <code>{rule.severity_threshold}</code> (Risk Score ≥ {rule.min_risk_score}/100)
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.text.secondary, mb: 0.5 }}>
                    <b>Time Window:</b> {rule.time_window_seconds}s | <b>Escalation Delay:</b> {rule.escalate_after_minutes} mins
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.text.secondary }}>
                    <b>Recipients:</b> <font color="#00E5A8">{rule.recipient_roles}</font>
                  </Typography>
                </Box>

                {/* Active Channels */}
                <Typography sx={{ fontSize: "0.72rem", color: colors.text.muted, fontWeight: 700, mb: 1, textTransform: "uppercase" }}>
                  Active Dispatch Channels
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  <Chip
                    icon={<NotificationsActiveIcon sx={{ fontSize: "14px !important" }} />}
                    label="In-App SOC Bell"
                    size="small"
                    sx={{
                      bgcolor: rule.notify_in_app ? "rgba(0, 229, 168, 0.15)" : "rgba(255,255,255,0.05)",
                      color: rule.notify_in_app ? colors.accent.primary : colors.text.muted,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    icon={<EmailIcon sx={{ fontSize: "14px !important" }} />}
                    label="Email SMTP"
                    size="small"
                    sx={{
                      bgcolor: rule.notify_email ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.05)",
                      color: rule.notify_email ? colors.accent.info : colors.text.muted,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    icon={<ForumIcon sx={{ fontSize: "14px !important" }} />}
                    label="Slack / Teams"
                    size="small"
                    sx={{
                      bgcolor: rule.notify_slack ? "rgba(245, 158, 11, 0.15)" : "rgba(255,255,255,0.05)",
                      color: rule.notify_slack ? colors.accent.warning : colors.text.muted,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    icon={<SmsIcon sx={{ fontSize: "14px !important" }} />}
                    label="Twilio SMS"
                    size="small"
                    sx={{
                      bgcolor: rule.notify_sms ? "rgba(220, 38, 38, 0.15)" : "rgba(255,255,255,0.05)",
                      color: rule.notify_sms ? colors.accent.error : colors.text.muted,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Rule Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
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
          Create Notification & Escalation Policy
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Policy Name"
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Critical SCADA Attack Surge"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Severity Threshold"
                  fullWidth
                  size="small"
                  value={formData.severity_threshold}
                  onChange={(e) => setFormData({ ...formData, severity_threshold: e.target.value })}
                >
                  <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="ALL">ALL INCURSIONS</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Min Risk Score (0-100)"
                  fullWidth
                  size="small"
                  value={formData.min_risk_score}
                  onChange={(e) => setFormData({ ...formData, min_risk_score: Number(e.target.value) })}
                />
              </Grid>
            </Grid>

            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: colors.text.secondary }}>
              Enable Alert Channels:
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Switch
                  checked={formData.notify_in_app}
                  onChange={(e) => setFormData({ ...formData, notify_in_app: e.target.checked })}
                />
                <Typography sx={{ fontSize: "0.75rem", color: colors.text.primary }}>In-App</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Switch
                  checked={formData.notify_email}
                  onChange={(e) => setFormData({ ...formData, notify_email: e.target.checked })}
                />
                <Typography sx={{ fontSize: "0.75rem", color: colors.text.primary }}>Email</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Switch
                  checked={formData.notify_slack}
                  onChange={(e) => setFormData({ ...formData, notify_slack: e.target.checked })}
                />
                <Typography sx={{ fontSize: "0.75rem", color: colors.text.primary }}>Slack</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Switch
                  checked={formData.notify_sms}
                  onChange={(e) => setFormData({ ...formData, notify_sms: e.target.checked })}
                />
                <Typography sx={{ fontSize: "0.75rem", color: colors.text.primary }}>SMS</Typography>
              </Stack>
            </Stack>

            <TextField
              type="number"
              label="Escalate after minutes unacknowledged"
              fullWidth
              size="small"
              value={formData.escalate_after_minutes}
              onChange={(e) => setFormData({ ...formData, escalate_after_minutes: Number(e.target.value) })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: colors.text.muted }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.name}
            sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800 }}
          >
            Save Policy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
