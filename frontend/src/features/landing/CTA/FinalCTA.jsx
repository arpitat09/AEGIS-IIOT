import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MemoryIcon from "@mui/icons-material/Memory";

export default function FinalCTA() {
  return (
    <Box
      sx={{
        py: { xs: 12, md: 16 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        bgcolor: "#060B0A",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(0, 229, 168, 0.12)",
      }}
    >
      {/* Background Central Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 229, 168, 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ maxWidth: 900, mx: "auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: "999px",
              bgcolor: "rgba(0, 229, 168, 0.08)",
              border: "1px solid rgba(0, 229, 168, 0.25)",
              mb: 3,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#00E5A8" }} />
            <Typography sx={{ color: "#00E5A8", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em" }}>
              ENTER COMMAND CENTER
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" },
              fontWeight: 900,
              color: "#F3F7F6",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              mb: 2.5,
            }}
          >
            Ready to Monitor Your{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #00E5A8 0%, #8AFF80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              IIoT Network?
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "1rem", md: "1.18rem" },
              lineHeight: 1.6,
              maxWidth: 650,
              mx: "auto",
              mb: 5,
            }}
          >
            Enter the AEGIS-IIOT security operations platform and monitor real-time industrial threats,
            model classifications, and containment actions.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              startIcon={<ShieldIcon />}
              endIcon={<ArrowForwardIcon />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: 240,
                px: 4,
                py: 1.6,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#060B0A",
                background: "linear-gradient(135deg, #00E5A8 0%, #00C896 100%)",
                boxShadow: "0 10px 30px rgba(0, 229, 168, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #33ECC0 0%, #00E5A8 100%)",
                  boxShadow: "0 15px 40px rgba(0, 229, 168, 0.45)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              LAUNCH LIVE DASHBOARD
            </Button>

            <Button
              component={Link}
              to="/architecture"
              startIcon={<MemoryIcon />}
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: 220,
                px: 3.5,
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
              VIEW PLATFORM ARCHITECTURE
            </Button>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  );
}
