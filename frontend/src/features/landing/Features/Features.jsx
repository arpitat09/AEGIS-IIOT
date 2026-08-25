import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import RadarIcon from "@mui/icons-material/Radar";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import SpeedIcon from "@mui/icons-material/Speed";
import ShieldIcon from "@mui/icons-material/Shield";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const capabilities = [
  {
    number: "01",
    icon: <RadarIcon sx={{ fontSize: 28 }} />,
    title: "REAL-TIME DETECTION",
    desc: "Continuously monitors IIoT network traffic via Scapy raw sockets, extracting 41 flow features and identifying suspicious wire anomalies in real time.",
    tag: "Sub-Second Ingestion",
  },
  {
    number: "02",
    icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
    title: "HYBRID ML ENGINE",
    desc: "Combines unsupervised anomaly detectors (Isolation Forest & One-Class SVM) with multi-class supervised classifiers (LightGBM & XGBoost).",
    tag: "Dual-Tier ML",
  },
  {
    number: "03",
    icon: <FindInPageIcon sx={{ fontSize: 28 }} />,
    title: "EXPLAINABLE AI",
    desc: "Uses SHAP tree explainability and feature contribution scores to reveal the exact network packet attributes driving every classification.",
    tag: "SHAP Explainability",
  },
  {
    number: "04",
    icon: <SpeedIcon sx={{ fontSize: 28 }} />,
    title: "RISK INTELLIGENCE",
    desc: "Calculates threat confidence, exponential moving average (EWMA) risk scores, and severity levels to prioritize immediate incident response.",
    tag: "Dynamic Scoring",
  },
  {
    number: "05",
    icon: <ShieldIcon sx={{ fontSize: 28 }} />,
    title: "ADAPTIVE PREVENTION",
    desc: "Automatically recommends or enforces deterministic containment actions including IP blocking, session termination, and device isolation.",
    tag: "Automated Policy",
  },
  {
    number: "06",
    icon: <BarChartIcon sx={{ fontSize: 28 }} />,
    title: "SECURITY ANALYTICS",
    desc: "Transforms live security streams into actionable SOC intelligence, attack vectors, adversary origins, and exportable forensics reports.",
    tag: "SOC Telemetry",
  },
];

export default function Features() {
  return (
    <Box
      id="capabilities"
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        bgcolor: "#08110F",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Anchor for platform */}
      <div id="platform" style={{ position: "absolute", top: -80 }} />

      <Box sx={{ maxWidth: "1350px", mx: "auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", mb: { xs: 6, md: 8 } }}>
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
            INTELLIGENCE PIPELINE
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
            Core Defense Capabilities
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            An integrated intelligence pipeline for detecting, analyzing, explaining,
            and responding to industrial cyber threats in critical IIoT infrastructure.
          </Typography>
        </Box>

        {/* 6 Capabilities Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2.5,
                  p: 1.5,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "rgba(0, 229, 168, 0.5)",
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 229, 168, 0.12)",
                    "& .arrow-icon": {
                      transform: "translateX(4px)",
                      color: "#00E5A8",
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Top Bar: Icon + Number */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 229, 168, 0.1)",
                        border: "1px solid rgba(0, 229, 168, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#00E5A8",
                      }}
                    >
                      {cap.icon}
                    </Box>

                    <Typography
                      sx={{
                        color: "rgba(156, 175, 169, 0.4)",
                        fontWeight: 900,
                        fontSize: "1.4rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {cap.number}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    sx={{
                      color: "#F3F7F6",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      letterSpacing: "-0.01em",
                      mb: 1.2,
                    }}
                  >
                    {cap.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: "#9CAFA9",
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      mb: 2.5,
                    }}
                  >
                    {cap.desc}
                  </Typography>
                </CardContent>

                {/* Footer Tag + Arrow */}
                <Box
                  sx={{
                    px: 2.5,
                    pb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    pt: 1.8,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#00E5A8",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {cap.tag}
                  </Typography>

                  <ArrowForwardIcon
                    className="arrow-icon"
                    sx={{
                      color: "#9CAFA9",
                      fontSize: 18,
                      transition: "all 0.25s ease",
                    }}
                  />
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
