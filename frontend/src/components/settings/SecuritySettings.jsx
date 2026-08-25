import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Stack,
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import LockResetIcon from "@mui/icons-material/LockReset";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import DevicesIcon from "@mui/icons-material/Devices";

import { apiService } from "../../services/api";
import { colors } from "../../theme/colors";

function calculateStrength(pass) {
  let score = 0;
  if (!pass) return { score: 0, label: "None", color: colors.text.muted };
  if (pass.length >= 12) score += 25;
  if (/[A-Z]/.test(pass)) score += 25;
  if (/[a-z]/.test(pass) && /\d/.test(pass)) score += 25;
  if (/[!@#$%^&*(),.?":{}|<>_\-+=[\]]/.test(pass)) score += 25;

  if (score <= 25) return { score: 25, label: "Weak", color: colors.status.critical };
  if (score <= 50) return { score: 50, label: "Fair", color: colors.status.warning };
  if (score <= 75) return { score: 75, label: "Strong", color: colors.status.info };
  return { score: 100, label: "Very Strong", color: colors.status.safe };
}

export default function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = calculateStrength(newPassword);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setStatus({ type: "error", message: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 12) {
      setStatus({ type: "error", message: "Password must be at least 12 characters long." });
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.changePassword(oldPassword, newPassword);
      setStatus({ type: "success", message: res.message || "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Failed to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3.5, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <SecurityIcon sx={{ color: colors.accent.primary }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text.primary }}>
          Security & Authentication Policies
        </Typography>
      </Box>

      {status && (
        <Alert severity={status.type} sx={{ mb: 3, fontSize: "0.82rem" }}>
          {status.message}
        </Alert>
      )}

      {/* Password Change Form */}
      <Box component="form" onSubmit={handleChangePassword} sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1.5 }}>
          Change Enterprise Password
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 460 }}>
          <TextField
            size="small"
            type="password"
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <TextField
              fullWidth
              size="small"
              type="password"
              label="New Password (Min. 12 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            {newPassword && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: colors.text.muted }}>
                    Password Strength:
                  </Typography>
                  <Typography variant="caption" sx={{ color: strength.color, fontWeight: 700 }}>
                    {strength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={strength.score}
                  sx={{
                    height: 5,
                    borderRadius: 2,
                    bgcolor: colors.border.muted,
                    "& .MuiLinearProgress-bar": { bgcolor: strength.color },
                  }}
                />
              </Box>
            )}
          </Box>

          <TextField
            size="small"
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<LockResetIcon />}
            sx={{
              fontWeight: 700,
              bgcolor: colors.accent.primary,
              color: colors.background.main,
              width: "fit-content",
              "&:hover": { bgcolor: "#38BDF8" },
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: colors.border.muted, my: 3 }} />

      {/* Multi-Factor Authentication */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary }}>
              Two-Factor Authentication (TOTP / Authenticator App)
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Enforce time-based one-time password verification on login
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: colors.accent.primary,
                  },
                }}
              />
            }
            label={mfaEnabled ? "Enabled" : "Disabled"}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: colors.border.muted, my: 3 }} />

      {/* Active Sessions */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text.primary, mb: 1.5 }}>
          Active SOC Sessions
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(11, 18, 32, 0.6)",
            border: `1px solid ${colors.border.subtle}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DevicesIcon sx={{ color: colors.status.safe }} />
            <Box>
              <Typography sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.85rem" }}>
                Current Browser Session (Active)
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.muted }}>
                IP: 127.0.0.1 • Validated via HMAC Bearer Token
              </Typography>
            </Box>
          </Box>
          <Chip label="Current" size="small" sx={{ bgcolor: colors.status.safeBg, color: colors.status.safe, fontWeight: 700 }} />
        </Box>
      </Box>
    </Paper>
  );
}
