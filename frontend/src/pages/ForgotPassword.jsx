import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Stack,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyIcon from "@mui/icons-material/Key";

import { apiService } from "../services/api";
import { colors } from "../theme/colors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await apiService.forgotPassword(email);
      setStatus({
        type: "success",
        message: res.message || "Reset instructions have been dispatched.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to process request. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: colors.background.main,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          bgcolor: colors.background.card,
          border: `1px solid ${colors.border.muted}`,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "rgba(0, 212, 255, 0.08)",
              border: `1px solid rgba(0, 212, 255, 0.3)`,
              color: colors.accent.primary,
              mb: 1.5,
            }}
          >
            <KeyIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
            Reset SOC Password
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.muted, display: "block", mt: 0.5 }}>
            Enter your enterprise email to receive password reset authorization
          </Typography>
        </Box>

        {status && (
          <Alert
            severity={status.type}
            sx={{
              mb: 2.5,
              fontSize: "0.82rem",
            }}
          >
            {status.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="analyst@aegis-iiot.sec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: colors.text.muted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: colors.background.secondary,
                  color: colors.text.primary,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.border.muted,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.1,
                fontWeight: 700,
                bgcolor: colors.accent.primary,
                color: colors.background.main,
                "&:hover": { bgcolor: "#38BDF8" },
              }}
            >
              {loading ? "Dispatching..." : "Send Reset Link"}
            </Button>

            <Button
              component={Link}
              to="/login"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ color: colors.text.secondary, textTransform: "none", fontSize: "0.82rem" }}
            >
              Back to Sign In
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
