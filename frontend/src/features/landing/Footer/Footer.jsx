import { Box, Typography, Divider, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ShieldIcon from "@mui/icons-material/Shield";

export default function Footer() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#060B0A",
        borderTop: "1px solid rgba(0, 229, 168, 0.12)",
        pt: { xs: 8, md: 10 },
        pb: 6,
        px: { xs: 3, md: 6, lg: 8 },
        color: "#9CAFA9",
      }}
    >
      <Box sx={{ maxWidth: "1350px", mx: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
            gap: { xs: 5, md: 4 },
            mb: 6,
          }}
        >
          {/* Column 1: Brand Info */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: "rgba(0, 229, 168, 0.1)",
                  border: "1px solid rgba(0, 229, 168, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldIcon sx={{ color: "#00E5A8", fontSize: 20 }} />
              </Box>
              <Typography
                sx={{
                  color: "#F3F7F6",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                AEGIS<span style={{ color: "#00E5A8" }}>-</span>IIOT
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#9CAFA9",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                maxWidth: 380,
                mb: 3,
              }}
            >
              Adaptive Cyber Defense System for Industrial IoT Networks.
              Engineered for sub-second anomaly detection, explainable AI,
              and automated threat containment.
            </Typography>

            {/* System Status Pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                bgcolor: "rgba(0, 229, 168, 0.08)",
                border: "1px solid rgba(0, 229, 168, 0.25)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#00E5A8",
                  boxShadow: "0 0 8px #00E5A8",
                }}
              />
              <Typography sx={{ color: "#00E5A8", fontSize: "0.72rem", fontWeight: 800 }}>
                ALL SYSTEMS OPERATIONAL
              </Typography>
            </Box>
          </Box>

          {/* Column 2: Platform Links */}
          <Box>
            <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "0.88rem", mb: 2, letterSpacing: "0.05em" }}>
              PLATFORM CONSOLE
            </Typography>
            <Stack spacing={1.2}>
              <Link to="/dashboard" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Command Center
              </Link>
              <Link to="/monitoring" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Live Monitoring
              </Link>
              <Link to="/threat-intelligence" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Threat Intelligence
              </Link>
              <Link to="/incidents" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Incident Response
              </Link>
              <Link to="/prevention" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Adaptive Prevention
              </Link>
            </Stack>
          </Box>

          {/* Column 3: Architecture & Tech */}
          <Box>
            <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "0.88rem", mb: 2, letterSpacing: "0.05em" }}>
              ARCHITECTURE
            </Typography>
            <Stack spacing={1.2}>
              <Link to="/architecture" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                6-Layer Topology
              </Link>
              <Link to="/analytics" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Hybrid ML Analytics
              </Link>
              <Link to="/reports" style={{ color: "#9CAFA9", textDecoration: "none", fontSize: "0.85rem" }}>
                Forensics Reports
              </Link>
              <span onClick={() => scrollToSection("technology")} style={{ color: "#9CAFA9", cursor: "pointer", fontSize: "0.85rem" }}>
                Technology Stack
              </span>
              <span onClick={() => scrollToSection("iiot")} style={{ color: "#9CAFA9", cursor: "pointer", fontSize: "0.85rem" }}>
                IIoT Environments
              </span>
            </Stack>
          </Box>

          {/* Column 4: System Specs */}
          <Box>
            <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "0.88rem", mb: 2, letterSpacing: "0.05em" }}>
              SYSTEM RUNTIME
            </Typography>
            <Stack spacing={1.2}>
              <Typography sx={{ fontSize: "0.82rem", color: "#9CAFA9" }}>
                Pipeline: <strong>Dual-Tier Hybrid</strong>
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "#9CAFA9" }}>
                Wire Ingest: <strong>Scapy Sockets</strong>
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "#9CAFA9" }}>
                Explainability: <strong>SHAP Kernel</strong>
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "#9CAFA9" }}>
                Telemetry: <strong>SSE Gateway</strong>
              </Typography>
              <Link to="/login" style={{ color: "#00E5A8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>
                Analyst Portal Login →
              </Link>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(0, 229, 168, 0.12)", my: 3 }} />

        {/* Bottom copyright */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "#9CAFA9" }}>
            © 2026 AEGIS-IIOT. Adaptive Industrial Cyber Defense Platform. All rights reserved.
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(156, 175, 169, 0.6)", fontFamily: "monospace" }}>
            SOC RELEASE v2.4.0 · BUILD SEC-2026
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
