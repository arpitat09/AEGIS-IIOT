import { Button, Paper, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

function DownloadArchitecture() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "#111827",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={3}>
        Architecture Documentation
      </Typography>

      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        size="large"
      >
        Download Architecture PDF
      </Button>
    </Paper>
  );
}

export default DownloadArchitecture;