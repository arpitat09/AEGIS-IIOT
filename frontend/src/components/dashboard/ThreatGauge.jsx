import {
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

function ThreatGauge() {
  const value = 82;

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" mb={3}>
        Threat Level
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={value}
          size={140}
          thickness={5}
          color="warning"
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">
            {value}%
          </Typography>
        </Box>
      </Box>

      <Typography
        mt={3}
        color="warning.main"
      >
        HIGH RISK
      </Typography>
    </Paper>
  );
}

export default ThreatGauge;