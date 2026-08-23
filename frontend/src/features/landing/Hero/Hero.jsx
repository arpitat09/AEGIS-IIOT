import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import AnimatedCyberBackground from "../AnimatedCyberBackground/AnimatedCyberBackground";

function Hero() {
  const scrollToPlatform = () => {
    document.getElementById("platform")?.scrollIntoView({
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
        px: {
          xs: 3,
          md: 6,
          lg: 10,
        },
        pt: {
          xs: 12,
          md: 14,
        },
        pb: {
          xs: 8,
          md: 10,
        },
        background:
          "radial-gradient(circle at center, #10150F 0%, #090B09 55%, #050606 100%)",
        color: "#F5F1E8",
      }}
    >
      {/* Animated Cyber Network Background */}
      <AnimatedCyberBackground />

      {/* Subtle central glow */}
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: 450,
            md: 700,
          },
          height: {
            xs: 450,
            md: 700,
          },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(166,180,111,0.13) 0%, rgba(166,180,111,0.05) 35%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Circular cyber rings */}
      <Box
        sx={{
          position: "absolute",
          width: {
            xs: "520px",
            md: "760px",
          },
          height: {
            xs: "520px",
            md: "760px",
          },
          borderRadius: "50%",
          border: "1px solid rgba(166,180,111,0.14)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: {
            xs: "650px",
            md: "1050px",
          },
          height: {
            xs: "650px",
            md: "1050px",
          },
          borderRadius: "50%",
          border: "1px solid rgba(232,111,42,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main Hero Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          zIndex: 3,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              mb: {
                xs: 3,
                md: 4,
              },
              borderRadius: "999px",
              border:
                "1px solid rgba(166,180,111,0.35)",
              background:
                "rgba(166,180,111,0.07)",
              boxShadow:
                "0 0 30px rgba(166,180,111,0.08)",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#A6B46F",
                boxShadow:
                  "0 0 10px rgba(166,180,111,0.9)",
              }}
            />

            <Typography
              sx={{
                color: "#C7D08F",
                fontSize: {
                  xs: "0.6rem",
                  md: "0.72rem",
                },
                fontWeight: 700,
                letterSpacing: {
                  xs: "0.12em",
                  md: "0.18em",
                },
              }}
            >
              AEGIS-IIOT · INDUSTRIAL CYBER DEFENSE
            </Typography>
          </Box>

          {/* Main Heading */}
          <Typography
            sx={{
              fontSize: {
                xs: "3.5rem",
                sm: "4.8rem",
                md: "6.5rem",
                lg: "7.8rem",
              },
              lineHeight: {
                xs: 0.98,
                md: 0.9,
              },
              letterSpacing: {
                xs: "-0.05em",
                md: "-0.065em",
              },
              fontWeight: 800,
              maxWidth: "1050px",
              mx: "auto",
              color: "#F5F1E8",
              textShadow:
                "0 0 40px rgba(245,241,232,0.05)",
            }}
          >
            Real-Time
            <br />

            Intelligence
            <br />

            Defending{" "}

            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg, #F5F1E8 0%, #D8C48B 55%, #E86F2A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              IIoT.
            </Box>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              mt: {
                xs: 4,
                md: 5,
              },
              maxWidth: "720px",
              mx: "auto",
              color: "#B7B8B0",
              fontSize: {
                xs: "1rem",
                md: "1.18rem",
              },
              lineHeight: 1.65,
            }}
          >
            Detect anomalies, understand threats, and respond intelligently
            with hybrid machine learning and adaptive prevention built for
            industrial environments.
          </Typography>

          {/* Buttons */}
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="center"
            sx={{
              mt: {
                xs: 4,
                md: 5,
              },
            }}
          >
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              endIcon={<ShieldOutlinedIcon />}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                minWidth: {
                  sm: "230px",
                },
                px: 4,
                py: 1.6,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "0.98rem",
                fontWeight: 700,
                background: "#F47721",
                color: "#10110D",
                boxShadow:
                  "0 12px 30px rgba(244,119,33,0.22)",

                "&:hover": {
                  background: "#FF8A3D",
                  boxShadow:
                    "0 15px 35px rgba(244,119,33,0.32)",
                },
              }}
            >
              Enter Live Dashboard
            </Button>

            <Button
              onClick={scrollToPlatform}
              endIcon={<ArrowDownwardIcon />}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                minWidth: {
                  sm: "190px",
                },
                px: 4,
                py: 1.6,
                borderRadius: "12px",
                color: "#E8E8E1",
                border:
                  "1px solid rgba(245,241,232,0.18)",
                textTransform: "none",
                fontSize: "0.98rem",
                fontWeight: 600,
                background:
                  "rgba(255,255,255,0.02)",

                "&:hover": {
                  borderColor:
                    "rgba(166,180,111,0.6)",
                  background:
                    "rgba(166,180,111,0.08)",
                },
              }}
            >
              Explore Platform
            </Button>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Hero;