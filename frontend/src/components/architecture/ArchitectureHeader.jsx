import { Paper, Typography } from "@mui/material";

function ArchitectureHeader() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        System Architecture
      </Typography>

      <Typography mt={2} color="text.secondary">
        Six-layer Adaptive Explainable Intrusion Detection and Prevention
        System (AEGIS-IIOT) architecture showing data flow from packet
        ingestion to monitoring and reporting.
      </Typography>
    </Paper>
  );
}

export default ArchitectureHeader;