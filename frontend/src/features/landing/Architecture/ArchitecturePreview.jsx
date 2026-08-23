import { Box, Typography, Paper, Stack } from "@mui/material";

const layers = [
  "Layer 1 - Data Ingestion",
  "Layer 2 - Preprocessing & Feature Engineering",
  "Layer 3 - Hybrid ML Detection",
  "Layer 4 - Explainability & Risk Analysis",
  "Layer 5 - Prevention Engine",
  "Layer 6 - Monitoring & Reporting",
];

function ArchitecturePreview() {
  return (
    <Box
      sx={{
        py: 12,
        px: 4,
      }}
    >
      <Typography
        variant="h2"
        align="center"
        fontWeight={700}
        mb={8}
      >
        Six Layer Architecture
      </Typography>

      <Stack
  spacing={3}
  sx={{
    maxWidth: 900,
    mx: "auto",
  }}
>
        {layers.map((layer) => (
          <Paper
            key={layer}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              border: "1px solid rgba(37,99,235,0.2)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: "#2563EB",
              },
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {layer}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default ArchitecturePreview;