import { Box, Typography, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BlockIcon from "@mui/icons-material/Block";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const sparkData = [
  { time: "00s", packets: 18, risk: 20 },
  { time: "04s", packets: 24, risk: 35 },
  { time: "08s", packets: 65, risk: 78 },
  { time: "12s", packets: 88, risk: 85 },
  { time: "16s", packets: 92, risk: 82 },
  { time: "20s", packets: 42, risk: 60 },
  { time: "24s", packets: 20, risk: 25 },
];

export default function ThreatPreview() {
  return (
    <Box
      id="threat-preview"
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
        <Box sx={{ textAlign: "center", maxWidth: 750, mx: "auto", mb: { xs: 6, md: 8 } }}>
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
            ADVERSARY FORENSICS
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
            Live Threat Intelligence
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Inspect real-time incident correlation, machine learning confidence scores,
            adversary origins, and automated containment actions.
          </Typography>
        </Box>

        {/* Live SOC Threat Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              maxWidth: 960,
              mx: "auto",
              bgcolor: "rgba(11, 20, 19, 0.8)",
              border: "1px solid rgba(0, 229, 168, 0.25)",
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 229, 168, 0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Top Incident Banner */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                pb: 3,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255, 107, 53, 0.15)",
                    border: "1px solid rgba(255, 107, 53, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF6B35",
                  }}
                >
                  <WarningAmberIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "1.15rem" }}>
                    DoS Incursion Detected
                  </Typography>
                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.75rem", fontFamily: "monospace" }}>
                    INCIDENT REF: INC-22044 · IIoT SCADA Gateway
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label="SEVERITY: HIGH"
                  sx={{
                    bgcolor: "rgba(255, 176, 32, 0.15)",
                    color: "#FFB020",
                    border: "1px solid rgba(255, 176, 32, 0.4)",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                  }}
                />
                <Chip
                  label="STATUS: CONTAINED"
                  sx={{
                    bgcolor: "rgba(0, 229, 168, 0.12)",
                    color: "#00E5A8",
                    border: "1px solid rgba(0, 229, 168, 0.35)",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>
            </Box>

            {/* Middle Grid: Metric telemetry */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                gap: 2,
                mb: 3.5,
              }}
            >
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(6, 11, 10, 0.6)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.7rem", fontWeight: 700 }}>
                  RISK SCORE
                </Typography>
                <Typography sx={{ color: "#FFB020", fontWeight: 900, fontSize: "1.4rem", my: 0.2 }}>
                  82 / 100
                </Typography>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem" }}>
                  EWMA Weighted Incursion
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(6, 11, 10, 0.6)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.7rem", fontWeight: 700 }}>
                  ML CONFIDENCE
                </Typography>
                <Typography sx={{ color: "#00E5A8", fontWeight: 900, fontSize: "1.4rem", my: 0.2 }}>
                  94.2%
                </Typography>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem" }}>
                  LightGBM + XGBoost Voting
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(6, 11, 10, 0.6)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.7rem", fontWeight: 700 }}>
                  SOURCE IP
                </Typography>
                <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "1.05rem", fontFamily: "monospace", my: 0.2 }}>
                  192.168.1.24
                </Typography>
                <Typography sx={{ color: "#FF6B35", fontSize: "0.68rem", fontWeight: 700 }}>
                  Adversary Attacker Node
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(6, 11, 10, 0.6)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.7rem", fontWeight: 700 }}>
                  TARGET ASSET
                </Typography>
                <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "1.05rem", fontFamily: "monospace", my: 0.2 }}>
                  10.0.0.15:502
                </Typography>
                <Typography sx={{ color: "#00E5A8", fontSize: "0.68rem", fontWeight: 700 }}>
                  Modbus PLC Controller
                </Typography>
              </Box>
            </Box>

            {/* Sparkline Burst Chart */}
            <Box sx={{ mb: 3.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ color: "#9CAFA9", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                  FLOW BURST ANOMALY (PACKETS / SEC)
                </Typography>
                <Typography sx={{ color: "#00E5A8", fontSize: "0.75rem", fontFamily: "monospace" }}>
                  Peak: 92 pkts/s
                </Typography>
              </Box>

              <Box sx={{ height: 100, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#9CAFA9" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CAFA9" fontSize={10} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <Box sx={{ bgcolor: "#060B0A", p: 1, borderRadius: 1, border: "1px solid #FF6B35" }}>
                              <Typography sx={{ color: "#FF6B35", fontSize: "0.75rem", fontWeight: 800 }}>
                                {payload[0].value} pkts/s
                              </Typography>
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="packets" stroke="#FF6B35" strokeWidth={2} fill="url(#threatGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Bottom Action Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                pt: 2.5,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BlockIcon sx={{ color: "#00E5A8", fontSize: 20 }} />
                <Typography sx={{ color: "#F3F7F6", fontSize: "0.85rem", fontWeight: 700 }}>
                  Enforced Action: <span style={{ color: "#00E5A8" }}>BLOCK SOURCE IP (192.168.1.24)</span>
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#00E5A8",
                  color: "#060B0A",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 0 20px rgba(0, 229, 168, 0.25)",
                  "&:hover": {
                    bgcolor: "#33ECC0",
                    boxShadow: "0 0 30px rgba(0, 229, 168, 0.4)",
                  },
                }}
              >
                OPEN SECURITY OPERATIONS CENTER
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
