import { Paper, Typography, Stack, Chip } from "@mui/material";

const flow = [
  "IIoT Devices",
  "Packet Capture",
  "Preprocessing",
  "Hybrid ML",
  "SHAP",
  "Risk Engine",
  "Prevention",
  "Dashboard",
];

function DataFlow() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h5" mb={3}>
        Data Flow
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {flow.map((item) => (
          <Chip
            key={item}
            label={item}
            color="primary"
            sx={{
              fontSize: 15,
              py: 2.5,
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

export default DataFlow;