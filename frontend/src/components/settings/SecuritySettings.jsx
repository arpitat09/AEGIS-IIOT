import {
  Button,
  Paper,
  Typography,
} from "@mui/material";

function SecuritySettings() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#111827" }}>
      <Typography variant="h6" mb={2}>
        Security Actions
      </Typography>

      <Button
        variant="contained"
        color="error"
      >
        Reset Threat Database
      </Button>
    </Paper>
  );
}

export default SecuritySettings;