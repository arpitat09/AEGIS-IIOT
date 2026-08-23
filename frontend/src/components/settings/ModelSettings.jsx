import {
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

function ModelSettings() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#111827" }}>
      <Typography variant="h6" mb={2}>
        ML Model Configuration
      </Typography>

      <Select
        fullWidth
        defaultValue="Hybrid"
      >
        <MenuItem value="Hybrid">Hybrid Model</MenuItem>
        <MenuItem value="Isolation Forest">
          Isolation Forest
        </MenuItem>
        <MenuItem value="One Class SVM">
          One-Class SVM
        </MenuItem>
      </Select>
    </Paper>
  );
}

export default ModelSettings;