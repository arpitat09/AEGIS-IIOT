import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#0B0C09",
        borderTop: "1px solid rgba(245,241,232,0.08)",
        px: { xs: 3, md: 6 },
        py: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.15rem",
            fontWeight: 700,
          }}
        >
          AEGIS IIOT
        </Typography>

        <Typography
          sx={{
            mt: 0.8,
            color: "#B8B7AF",
            fontSize: "0.9rem",
          }}
        >
          Adaptive Explainable Intrusion Detection & Prevention Framework for
          Industrial IoT
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#777A71",
            fontSize: "0.85rem",
          }}
        >
          © 2026 AEGIS IIOT | Final Year Major Project
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;