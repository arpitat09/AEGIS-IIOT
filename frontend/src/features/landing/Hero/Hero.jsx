import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <Box
  sx={{
    minHeight: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    px: 3,
    pt: 18,
    pb: 16,   // <-- Add this
    background:
      "radial-gradient(circle at top, #1E3A8A 0%, #030712 65%)",
  }}
>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            maxWidth: "1000px",
          }}
        >
          Adaptive Explainable
          <br />
          Intrusion Detection &
          <br />
          Prevention Framework
        </Typography>

        <Typography
          sx={{
            mt: 3,
            fontSize: "1.3rem",
            color: "#94A3B8",
            maxWidth: "850px",
            mx: "auto",
          }}
        >
          AI-powered Hybrid Intrusion Detection and Prevention System
          for Industrial IoT using Explainable Machine Learning,
          Dynamic Risk Scoring, and Adaptive Prevention.
        </Typography>

        <Box mt={5}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            size="large"
          >
            Launch Dashboard
          </Button>

          <Button
            size="large"
            sx={{ ml: 3 }}
          >
            Explore Architecture
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

export default Hero;