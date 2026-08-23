import {
  Box,
  Typography,
} from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        py: 5,
        mt: 10,
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        AEGIS IIOT
      </Typography>

      <Typography
        color="text.secondary"
        mt={2}
      >
        Adaptive Explainable Intrusion Detection &
        Prevention Framework for Industrial IoT
      </Typography>

      <Typography
        mt={3}
        color="text.secondary"
      >
        © 2026 AEGIS IIOT | Final Year Major Project
      </Typography>
    </Box>
  );
}

export default Footer;