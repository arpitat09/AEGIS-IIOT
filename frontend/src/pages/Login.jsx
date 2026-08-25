import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldIcon from "@mui/icons-material/Shield";
import HubIcon from "@mui/icons-material/Hub";

import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please provide username/email and password.");
      return;
    }

    try {
      setError(null);
      await login(identifier, password);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid credentials. Please try again.";
      setError(msg);
    }
  };

  const handleQuickFill = (userEmail, userPass) => {
    setIdentifier(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: colors.background.main,
        backgroundImage: `radial-gradient(ellipse 80% 80% at 50% -20%, rgba(0, 212, 255, 0.15), rgba(7, 11, 20, 0))`,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: 4,
          bgcolor: colors.background.card,
          border: `1px solid ${colors.border.muted}`,
          borderRadius: 3,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* SOC Platform Header */}
        <Box sx={{ textAlign: "center", mb: 3.5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              borderRadius: 2.5,
              bgcolor: "rgba(0, 212, 255, 0.08)",
              border: `1px solid rgba(0, 212, 255, 0.3)`,
              color: colors.accent.primary,
              mb: 2,
              boxShadow: `0 0 20px ${colors.accent.primaryGlow}`,
            }}
          >
            <ShieldIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text.primary, letterSpacing: -0.5 }}>
            AEGIS-IIOT
          </Typography>
          <Typography variant="body2" sx={{ color: colors.accent.primary, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", mt: 0.3 }}>
            ADAPTIVE CYBER DEFENSE PLATFORM
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.muted, display: "block", mt: 0.5 }}>
            Security Operations Center (SOC) Console
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              bgcolor: colors.status.criticalBg,
              color: "#FCA5A5",
              border: `1px solid ${colors.status.criticalBorder}`,
              fontSize: "0.82rem",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.2}>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 700, display: "block", mb: 0.5 }}>
                USERNAME OR EMAIL
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="admin@aegis-iiot.sec"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: colors.text.muted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: colors.background.secondary,
                    color: colors.text.primary,
                    fontSize: "0.88rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.border.muted,
                  },
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 700 }}>
                  PASSWORD
                </Typography>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="caption"
                  sx={{
                    color: colors.accent.primary,
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: colors.text.muted, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ color: colors.text.muted }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: colors.background.secondary,
                    color: colors.text.primary,
                    fontSize: "0.88rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.border.muted,
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.2,
                mt: 1,
                fontWeight: 700,
                fontSize: "0.9rem",
                bgcolor: colors.accent.primary,
                color: colors.background.main,
                "&:hover": {
                  bgcolor: "#38BDF8",
                  boxShadow: `0 0 20px ${colors.accent.primaryGlow}`,
                },
              }}
            >
              {isLoading ? "Authenticating Session..." : "Sign In to SOC Console"}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: colors.border.muted, my: 3 }}>
          <Typography variant="caption" sx={{ color: colors.text.muted, px: 1 }}>
            DEMO SOC CREDENTIALS
          </Typography>
        </Divider>

        {/* Quick Demo Fills */}
        <Stack spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickFill("admin@aegis-iiot.sec", "Admin@Aegis2026!SOC")}
            sx={{
              justifyContent: "space-between",
              borderColor: colors.border.muted,
              color: colors.text.secondary,
              fontSize: "0.75rem",
              py: 0.6,
              "&:hover": { borderColor: colors.accent.primary, color: colors.text.primary },
            }}
          >
            <span>Admin (Full Control): <strong>admin@aegis-iiot.sec</strong></span>
            <Chip label="ADMIN" size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: colors.accent.primaryGlow, color: colors.accent.primary }} />
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickFill("analyst@aegis-iiot.sec", "Analyst@Aegis2026!SOC")}
            sx={{
              justifyContent: "space-between",
              borderColor: colors.border.muted,
              color: colors.text.secondary,
              fontSize: "0.75rem",
              py: 0.6,
              "&:hover": { borderColor: colors.accent.primary, color: colors.text.primary },
            }}
          >
            <span>Analyst (SOC Operator): <strong>analyst@aegis-iiot.sec</strong></span>
            <Chip label="ANALYST" size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: colors.status.infoBg, color: colors.status.info }} />
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickFill("viewer@aegis-iiot.sec", "Viewer@Aegis2026!SOC")}
            sx={{
              justifyContent: "space-between",
              borderColor: colors.border.muted,
              color: colors.text.secondary,
              fontSize: "0.75rem",
              py: 0.6,
              "&:hover": { borderColor: colors.accent.primary, color: colors.text.primary },
            }}
          >
            <span>Auditor (Read-Only): <strong>viewer@aegis-iiot.sec</strong></span>
            <Chip label="VIEWER" size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: "rgba(148, 163, 184, 0.1)", color: colors.text.secondary }} />
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
