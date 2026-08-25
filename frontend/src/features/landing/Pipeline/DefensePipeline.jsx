import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MemoryIcon from "@mui/icons-material/Memory";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const stages = [
  {
    num: "01",
    title: "NETWORK TRAFFIC",
    sub: "Scapy Wire Sniffing",
    desc: "Ingests raw packet frames from industrial IoT switch mirrors and Modbus/TCP endpoints.",
    icon: <SettingsEthernetIcon />,
  },
  {
    num: "02",
    title: "DATA INGESTION",
    sub: "Flow Management",
    desc: "Aggregates bidirectional packet streams into stateful connection flows and duration metrics.",
    icon: <AltRouteIcon />,
  },
  {
    num: "03",
    title: "FEATURE ENGINEERING",
    sub: "41-Feature Scaling",
    desc: "Encodes protocol features, applies RobustScaler normalization, and reduces dimensions via PCA.",
    icon: <FilterAltIcon />,
  },
  {
    num: "04",
    title: "HYBRID ML DETECTION",
    sub: "Dual-Tier Pipeline",
    desc: "Evaluates anomaly outliers (Isolation Forest, SVM) and classifies attacks (LightGBM, XGBoost).",
    icon: <MemoryIcon />,
  },
  {
    num: "05",
    title: "XAI & RISK ANALYSIS",
    sub: "SHAP + EWMA Scoring",
    desc: "Computes local feature explanations and assigns dynamic risk scores between 0 and 100.",
    icon: <QueryStatsIcon />,
  },
  {
    num: "06",
    title: "PREVENTION RESPONSE",
    sub: "Adaptive Policies",
    desc: "Triggers deterministic containment actions: IP blocks, rate limits, or device isolations.",
    icon: <SecurityIcon />,
  },
  {
    num: "07",
    title: "LIVE MONITORING",
    sub: "SOC Command Center",
    desc: "Streams telemetry, threat vectors, and incident triage status to SOC analysts in real time.",
    icon: <VisibilityIcon />,
  },
];

export default function DefensePipeline() {
  return (
    <Box
      id="pipeline"
      sx={{
        py: { xs: 10, md: 15 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        bgcolor: "#060B0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: "1350px", mx: "auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", maxWidth: 750, mx: "auto", mb: { xs: 6, md: 9 } }}>
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
            END-TO-END SECURITY PIPELINE
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
            From Packet to Protection
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Trace raw industrial network packets from raw socket capture through machine learning
            classification to automated threat containment.
          </Typography>
        </Box>

        {/* Timeline Pipeline Flow */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(7, 1fr)",
            },
            gap: 2,
            position: "relative",
            mb: 6,
          }}
        >
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2,
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(0, 229, 168, 0.5)",
                    bgcolor: "rgba(11, 20, 19, 0.9)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 168, 0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: "rgba(0, 229, 168, 0.1)",
                      border: "1px solid rgba(0, 229, 168, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00E5A8",
                    }}
                  >
                    {stage.icon}
                  </Box>
                  <Typography
                    sx={{
                      color: "rgba(0, 229, 168, 0.5)",
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                    }}
                  >
                    {stage.num}
                  </Typography>
                </Box>

                {/* Body */}
                <Box sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      color: "#F3F7F6",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      letterSpacing: "0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {stage.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#00E5A8",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      my: 0.4,
                    }}
                  >
                    {stage.sub}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9CAFA9",
                      fontSize: "0.74rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {stage.desc}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            component={Link}
            to="/architecture"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: "#00E5A8",
              border: "1px solid rgba(0, 229, 168, 0.3)",
              bgcolor: "rgba(0, 229, 168, 0.05)",
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                bgcolor: "rgba(0, 229, 168, 0.15)",
                borderColor: "#00E5A8",
              },
            }}
          >
            Explore Complete 6-Layer Architecture
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
