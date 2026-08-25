import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import HistoryIcon from "@mui/icons-material/History";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import PolicyIcon from "@mui/icons-material/Policy";

const pillars = [
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 26 }} />,
    title: "Role-Based Access (RBAC)",
    desc: "Strict authorization tiers for Administrators, Security Analysts, and Viewers with granular operation controls.",
  },
  {
    icon: <VpnKeyIcon sx={{ fontSize: 26 }} />,
    title: "Cryptographic Auth",
    desc: "PBKDF2/SHA256 password derivation and HMAC token authentication guarding all administrative sessions.",
  },
  {
    icon: <LockIcon sx={{ fontSize: 26 }} />,
    title: "Protected API Access",
    desc: "Bearer token authorization layer validating headers across all sensitive telemetry, incident, and prevention routes.",
  },
  {
    icon: <HistoryIcon sx={{ fontSize: 26 }} />,
    title: "Immutable Audit Logging",
    desc: "Persistent security event tracking recording login events, containment approvals, and triage mutations.",
  },
  {
    icon: <TrackChangesIcon sx={{ fontSize: 26 }} />,
    title: "Incident Traceability",
    desc: "Auditable incident state transitions from initial anomaly detection through investigation to containment.",
  },
  {
    icon: <PolicyIcon sx={{ fontSize: 26 }} />,
    title: "Controlled Response Policies",
    desc: "Configurable prevention policies ensuring automated defensive actions do not compromise industrial process safety.",
  },
];

export default function SecurityFeatures() {
  return (
    <Box
      id="security"
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        bgcolor: "#08110F",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: "1350px", mx: "auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", maxWidth: 780, mx: "auto", mb: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              color: "#00E5A8",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            TRUST & GOVERNANCE
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
              fontWeight: 900,
              color: "#F3F7F6",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Security-First by Design
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Built with enterprise-grade security standards to protect telemetry, user credentials,
            and operational commands from unauthorized tampering.
          </Typography>
        </Box>

        {/* 6 Pillars Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2,
                  p: 1,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(0, 229, 168, 0.45)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 168, 0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      bgcolor: "rgba(0, 229, 168, 0.1)",
                      border: "1px solid rgba(0, 229, 168, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00E5A8",
                      mb: 2,
                    }}
                  >
                    {pillar.icon}
                  </Box>

                  <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "1.02rem", mb: 0.8 }}>
                    {pillar.title}
                  </Typography>

                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.84rem", lineHeight: 1.6 }}>
                    {pillar.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
