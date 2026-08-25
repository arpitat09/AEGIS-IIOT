import { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreIcon from "@mui/icons-material/Explore";
import MemoryIcon from "@mui/icons-material/Memory";
import StreamIcon from "@mui/icons-material/Stream";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HubIcon from "@mui/icons-material/Hub";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import LiveSystemStatusPanel from "./LiveSystemStatusPanel";
import { apiService } from "../../../services/api";

export default function Hero() {
  const [liveMetrics, setLiveMetrics] = useState({
    flows: "1,248",
    threats: 24,
    nodes: 36,
    status: "ONLINE",
    highRisk: 3,
  });

  useEffect(() => {
    // Attempt to fetch real telemetry metrics
    const loadLiveCounts = async () => {
      try {
        const data = await apiService.getDashboardLive();
        if (data && data.summary) {
          setLiveMetrics({
            flows: (data.summary.total_alerts || 1248).toLocaleString(),
            threats: data.summary.critical_alerts + data.summary.high_alerts || 24,
            nodes: data.summary.active_devices || 36,
            status: "ONLINE",
            highRisk: data.summary.critical_alerts || 3,
          });
        }
      } catch {
        // Safe fallback metrics
      }
    };
    loadLiveCounts();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        pt: { xs: 14, md: 16 },
        pb: { xs: 8, md: 12 },
        background: "radial-gradient(ellipse at 50% 30%, #0B1413 0%, #08110F 50%, #060B0A 100%)",
        color: "#F3F7F6",
      }}
    >
      {/* Subtle Background Radial Glow */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "350px", md: "700px" },
          height: { xs: "350px", md: "700px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 229, 168, 0.08) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Main Grid: Left Hero Content + Right Live Status Panel */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
            gap: { xs: 6, lg: 8 },
            alignItems: "center",
          }}
        >
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 2,
                py: 0.7,
                mb: 3,
                borderRadius: "999px",
                border: "1px solid rgba(0, 229, 168, 0.3)",
                bgcolor: "rgba(0, 229, 168, 0.06)",
                boxShadow: "0 0 20px rgba(0, 229, 168, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#00E5A8",
                  boxShadow: "0 0 8px #00E5A8",
                  animation: "pulseDot 2s infinite",
                  "@keyframes pulseDot": {
                    "0%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.4, transform: "scale(1.2)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                  },
                }}
              />
              <Typography
                sx={{
                  color: "#00E5A8",
                  fontSize: { xs: "0.68rem", md: "0.76rem" },
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                AEGIS-IIOT · INDUSTRIAL CYBER DEFENSE
              </Typography>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.8rem", lg: "5.4rem" },
                lineHeight: { xs: 1.05, md: 1.0 },
                letterSpacing: "-0.04em",
                fontWeight: 900,
                color: "#F3F7F6",
                mb: 2.5,
              }}
            >
              Real-Time
              <br />
              Intelligence
              <br />
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #00E5A8 0%, #8AFF80 60%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Defending IIoT.
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                color: "#9CAFA9",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.65,
                maxWidth: 600,
                mb: 4,
              }}
            >
              Detect anomalies, understand threats, and respond intelligently with hybrid
              machine learning and adaptive prevention for industrial IoT environments.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mb: 5 }}
            >
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                startIcon={<ShieldIcon />}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#060B0A",
                  background: "linear-gradient(135deg, #00E5A8 0%, #00C896 100%)",
                  boxShadow: "0 10px 30px rgba(0, 229, 168, 0.3)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #33ECC0 0%, #00E5A8 100%)",
                    boxShadow: "0 15px 40px rgba(0, 229, 168, 0.45)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                ENTER LIVE DASHBOARD
              </Button>

              <Button
                onClick={() => scrollToSection("capabilities")}
                startIcon={<ExploreIcon />}
                sx={{
                  px: 3,
                  py: 1.6,
                  borderRadius: "12px",
                  color: "#F3F7F6",
                  border: "1px solid rgba(0, 229, 168, 0.25)",
                  bgcolor: "rgba(0, 229, 168, 0.03)",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "rgba(0, 229, 168, 0.1)",
                    borderColor: "rgba(0, 229, 168, 0.5)",
                  },
                }}
              >
                EXPLORE PLATFORM
              </Button>
            </Stack>

            {/* Subtle View Architecture Action */}
            <Box
              component={Link}
              to="/architecture"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                color: "#00E5A8",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
                "&:hover": { textDecoration: "underline" },
                mb: 4,
              }}
            >
              <MemoryIcon sx={{ fontSize: 18 }} />
              VIEW SYSTEM ARCHITECTURE →
            </Box>

            {/* 4 Compact Live Metrics */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(11, 20, 19, 0.6)",
                border: "1px solid rgba(0, 229, 168, 0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#00E5A8", mb: 0.3 }}>
                  <StreamIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 700 }}>
                    LIVE FLOWS
                  </Typography>
                </Box>
                <Typography sx={{ color: "#F3F7F6", fontWeight: 900, fontSize: "1.2rem", fontFamily: "monospace" }}>
                  {liveMetrics.flows}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#FFB020", mb: 0.3 }}>
                  <WarningAmberIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 700 }}>
                    THREATS DETECTED
                  </Typography>
                </Box>
                <Typography sx={{ color: "#FFB020", fontWeight: 900, fontSize: "1.2rem", fontFamily: "monospace" }}>
                  {liveMetrics.threats}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#3B82F6", mb: 0.3 }}>
                  <HubIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 700 }}>
                    ACTIVE NODES
                  </Typography>
                </Box>
                <Typography sx={{ color: "#F3F7F6", fontWeight: 900, fontSize: "1.2rem", fontFamily: "monospace" }}>
                  {liveMetrics.nodes}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#00E5A8", mb: 0.3 }}>
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 700 }}>
                    MODEL STATUS
                  </Typography>
                </Box>
                <Typography sx={{ color: "#00E5A8", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                  ONLINE
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Right Column: Live Security Status Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LiveSystemStatusPanel liveMetrics={liveMetrics} />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
