import {
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from "@mui/material";

function GeneralSettings() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#111827" }}>
      <Typography variant="h6" mb={2}>
        General Settings
      </Typography>

      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Dark Theme"
      />

      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Auto Refresh Dashboard"
      />
    </Paper>
  );
}

export default GeneralSettings;