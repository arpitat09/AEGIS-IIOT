import { Box, Paper, Typography } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const layers = [
  "Layer 1 - Data Ingestion",
  "Layer 2 - Data Preprocessing",
  "Layer 3 - Hybrid ML Detection",
  "Layer 4 - Explainability & Risk Analysis",
  "Layer 5 - Adaptive Prevention Engine",
  "Layer 6 - Monitoring & Reporting",
];

function ArchitectureDiagram() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={4}>
        AEGIS-IIOT Framework
      </Typography>

      {layers.map((layer, index) => (
        <Box key={layer}>
          <Paper
            sx={{
              p: 2.5,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#1F2937",
              border: "1px solid rgba(37,99,235,0.25)",
            }}
          >
            <Typography fontWeight={600}>
              {layer}
            </Typography>
          </Paper>

          {index !== layers.length - 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 1,
              }}
            >
              <KeyboardDoubleArrowDownIcon
                color="primary"
                fontSize="large"
              />
            </Box>
          )}
        </Box>
      ))}
    </Paper>
  );
}

export default ArchitectureDiagram;