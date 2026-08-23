import { Shield } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function Logo() {
  return (
    <Box
  sx={{
    display: "flex",
    alignItems: "center",
  }}
>
      <Shield
        sx={{
          color: "#2563EB",
          fontSize: 38,
        }}
      />

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          AEGIS IIOT
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: 12,
          }}
        >
          Adaptive Cyber Defense
        </Typography>
      </Box>
    </Box>
  );
}

export default Logo;