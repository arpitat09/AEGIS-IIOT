import {
  FormControlLabel,
  Paper,
  Switch,
  Typography,
} from "@mui/material";

function NotificationSettings() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#111827" }}>
      <Typography variant="h6" mb={2}>
        Notifications
      </Typography>

      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Email Alerts"
      />

      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Critical Threat Alerts"
      />

      <FormControlLabel
        control={<Switch />}
        label="SMS Alerts"
      />
    </Paper>
  );
}

export default NotificationSettings;