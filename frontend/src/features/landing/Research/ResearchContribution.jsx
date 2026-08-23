import {
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const contributions = [
  "Hybrid Machine Learning Detection Framework",
  "Explainable AI using SHAP",
  "Dynamic Threat Risk Scoring",
  "Adaptive Prevention Engine",
  "Industrial IoT Focused Architecture",
];

function ResearchContribution() {
  return (
    <Box sx={{ py: 12, px: 4 }}>
      <Typography
        variant="h2"
        align="center"
        mb={7}
        fontWeight={700}
      >
        Research Contributions
      </Typography>

      <Stack
  spacing={3}
  sx={{
    maxWidth: 900,
    mx: "auto",
  }}
>
        {contributions.map((item) => (
          <Paper
            key={item}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6">
              • {item}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default ResearchContribution;