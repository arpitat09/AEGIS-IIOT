import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import {
  Security,
  Psychology,
  Insights,
  Shield,
  Timeline,
  Hub,
} from "@mui/icons-material";

const features = [
  {
    icon: Security,
    title: "Hybrid ML Detection",
    desc: "Isolation Forest, One-Class SVM, XGBoost and LightGBM working together.",
    number: "01",
  },
  {
    icon: Psychology,
    title: "Explainable AI",
    desc: "SHAP-based feature importance for transparent and interpretable predictions.",
    number: "02",
  },
  {
    icon: Insights,
    title: "Dynamic Risk Scoring",
    desc: "Assigns real-time threat scores based on detected attack severity.",
    number: "03",
  },
  {
    icon: Shield,
    title: "Adaptive Prevention",
    desc: "Automatically recommends intelligent prevention actions for threats.",
    number: "04",
  },
  {
    icon: Timeline,
    title: "Real-Time Analytics",
    desc: "Live monitoring dashboards with attack trends and security insights.",
    number: "05",
  },
  {
    icon: Hub,
    title: "IIoT Security",
    desc: "Designed specifically for Industrial IoT environments and networks.",
    number: "06",
  },
];

function Features() {
  return (
    <Box
      id="features"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        px: { xs: 2.5, sm: 4, md: 6 },
        background: "#0B0C09",
        color: "#F5F1E8",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(166,180,111,0.08), transparent 70%)",
          top: "-250px",
          right: "-180px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1250px",
          mx: "auto",
        }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            sx={{
              color: "#A6B46F",
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              mb: 2,
            }}
          >
            PLATFORM CAPABILITIES
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: {
                xs: "2.5rem",
                sm: "3.4rem",
                md: "4.2rem",
              },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              mb: 2,
            }}
          >
            Built for intelligent
            <br />
            <Box component="span" sx={{ color: "#E86F2A" }}>
              cyber defense.
            </Box>
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              maxWidth: "650px",
              mx: "auto",
              color: "#A9AAA0",
              fontSize: {
                xs: "0.95rem",
                md: "1.05rem",
              },
              lineHeight: 1.7,
              mb: { xs: 6, md: 8 },
            }}
          >
            AEGIS-IIOT combines intelligent detection, explainability,
            continuous monitoring, and adaptive prevention in one unified
            industrial security platform.
          </Typography>
        </motion.div>

        {/* Feature Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    minHeight: 290,
                    p: 3.5,
                    borderRadius: "22px",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(245,241,232,0.09)",
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))",
                    transition: "all 0.35s ease",

                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: "rgba(166,180,111,0.45)",
                      background:
                        "linear-gradient(145deg, rgba(166,180,111,0.09), rgba(255,255,255,0.025))",
                      boxShadow:
                        "0 25px 50px rgba(0,0,0,0.28)",
                    },

                    "&:hover .feature-number": {
                      color: "#E86F2A",
                    },
                  }}
                >
                  <Typography
                    className="feature-number"
                    sx={{
                      position: "absolute",
                      top: 22,
                      right: 25,
                      color: "rgba(245,241,232,0.18)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.number}
                  </Typography>

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(166,180,111,0.1)",
                      border: "1px solid rgba(166,180,111,0.18)",
                      mb: 4,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 28,
                        color: "#A6B46F",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      mb: 1.5,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9B9C94",
                      lineHeight: 1.75,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Features;