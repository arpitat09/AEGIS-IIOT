import { Box, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";

import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";

const techCategories = [
  {
    icon: <CodeIcon sx={{ fontSize: 24 }} />,
    category: "FRONTEND STACK",
    items: [
      { name: "React 19", role: "Component Architecture" },
      { name: "Vite 8", role: "Ultra-Fast Bundler" },
      { name: "Material UI 9", role: "SOC Design System" },
      { name: "Recharts", role: "Real-Time Telemetry Waves" },
      { name: "Framer Motion", role: "Micro-Interactions" },
    ],
  },
  {
    icon: <StorageIcon sx={{ fontSize: 24 }} />,
    category: "BACKEND & DATA API",
    items: [
      { name: "Python 3.10", role: "Core Execution Runtime" },
      { name: "Flask REST API", role: "Unified Data Gateway" },
      { name: "Flask-SQLAlchemy", role: "ORM Database Layer" },
      { name: "SQLite", role: "High-Throughput Alerts DB" },
      { name: "Server-Sent Events", role: "Zero-Latency Push Stream" },
    ],
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 24 }} />,
    category: "HYBRID ML & EXPLAINABILITY",
    items: [
      { name: "LightGBM", role: "Gradient Boosting Classifier" },
      { name: "XGBoost", role: "Ensemble Multi-Class Model" },
      { name: "Isolation Forest", role: "Unsupervised Anomaly Detector" },
      { name: "One-Class SVM", role: "Kernel Boundary Outlier Model" },
      { name: "SHAP Kernel", role: "Feature Attribution Explainability" },
    ],
  },
  {
    icon: <SettingsEthernetIcon sx={{ fontSize: 24 }} />,
    category: "TELEMETRY & INGESTION",
    items: [
      { name: "Scapy Raw Sockets", role: "Wire Packet Ingestion" },
      { name: "Flow Manager", role: "Bidirectional Session Tracker" },
      { name: "RobustScaler", role: "Outlier-Resistant Normalization" },
      { name: "PCA Reduction", role: "Feature Dimensionality" },
      { name: "EWMA Risk Engine", role: "Dynamic Threat Scoring" },
    ],
  },
];

export default function Technology() {
  return (
    <Box
      id="technology"
      sx={{
        py: { xs: 10, md: 15 },
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
            ARCHITECTURE FOUNDATION
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
            Powered by Intelligent Defense Technology
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Engineered with a modern production stack combining high-performance Python
            telemetry processing and cutting-edge machine learning libraries.
          </Typography>
        </Box>

        {/* 4 Stack Columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 3,
          }}
        >
          {techCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2.5,
                  p: 3,
                  height: "100%",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(0, 229, 168, 0.45)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 168, 0.08)",
                  },
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 2.5 }}>
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
                      mb: 1.5,
                    }}
                  >
                    {cat.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#00E5A8",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {cat.category}
                  </Typography>
                </Box>

                {/* Items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {cat.items.map((item) => (
                    <Box
                      key={item.name}
                      sx={{
                        p: 1.2,
                        borderRadius: 1.5,
                        bgcolor: "rgba(6, 11, 10, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      <Typography sx={{ color: "#F3F7F6", fontWeight: 700, fontSize: "0.85rem" }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: "#9CAFA9", fontSize: "0.72rem" }}>
                        {item.role}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
