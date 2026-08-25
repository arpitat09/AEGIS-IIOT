import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const layers = [
  {
    number: "01",
    title: "Data Ingestion Layer",
    description: "Raw socket wire capture via Scapy, syslog forwarding, and asynchronous packet queue buffering.",
  },
  {
    number: "02",
    title: "Feature Engineering Layer",
    description: "Flow aggregation, categorical one-hot encoding, RobustScaler normalization, and PCA dimensionality reduction.",
  },
  {
    number: "03",
    title: "Hybrid ML Detection Layer",
    description: "Dual-tier pipeline: Isolation Forest & One-Class SVM anomaly models + LightGBM & XGBoost multi-class classifiers.",
  },
  {
    number: "04",
    title: "Explainability & Risk Layer",
    description: "SHAP tree explainability attribution and dynamic EWMA threat score calculation (0–100 normalized).",
  },
  {
    number: "05",
    title: "Adaptive Prevention Layer",
    description: "Configurable policy engine mapping detected attacks to automated IP blocking, rate limiting, and device isolation.",
  },
  {
    number: "06",
    title: "SOC Monitoring & API Layer",
    description: "Flask REST API, Server-Sent Events gateway, real-time command center, and exportable forensic reports.",
  },
];

export default function ArchitecturePreview() {
  return (
    <Box
      id="architecture"
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
            MODULAR SYSTEM TOPOLOGY
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
            AEGIS-IIOT Defense Architecture
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            A six-layer decoupled cyber defense architecture structured for industrial reliability,
            fault tolerance, and sub-second anomaly mitigation.
          </Typography>
        </Box>

        {/* 6 Layers Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 3,
            mb: 6,
          }}
        >
          {layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2.5,
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(0, 229, 168, 0.5)",
                    bgcolor: "rgba(11, 20, 19, 0.9)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 168, 0.1)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#00E5A8",
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      mb: 1,
                    }}
                  >
                    LAYER {layer.number}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#F3F7F6",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      mb: 1.2,
                    }}
                  >
                    {layer.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9CAFA9",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {layer.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Action Button */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            component={Link}
            to="/architecture"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "linear-gradient(135deg, #00E5A8 0%, #00C896 100%)",
              color: "#060B0A",
              fontWeight: 800,
              fontSize: "0.95rem",
              px: 4,
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 0 25px rgba(0, 229, 168, 0.25)",
              "&:hover": {
                bgcolor: "#33ECC0",
                boxShadow: "0 0 35px rgba(0, 229, 168, 0.4)",
              },
            }}
          >
            VIEW FULL ARCHITECTURE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
