import { Box, Typography, Chip } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

function DashboardHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Security Operations Center
        </Typography>

        <Typography color="text.secondary">
          Adaptive Explainable Intrusion Detection & Prevention Framework
        </Typography>
      </Box>

      <Chip
        icon={<SecurityIcon />}
        label="System Secure"
        color="success"
      />
    </Box>
  );
}

export default DashboardHeader;