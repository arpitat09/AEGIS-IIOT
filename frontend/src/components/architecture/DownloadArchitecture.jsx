import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import { apiService } from "../../services/api";

function DownloadArchitecture() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");

      const downloadUrl = apiService.getArchitectureDownloadUrl();
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("Failed to download architecture PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "AEGIS-IIOT-System-Architecture.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Architecture download error:",
        error
      );

      setError(
        "Unable to download the Architecture PDF. Please ensure the backend is running."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 3,
          md: 5,
        },
        borderRadius: 4,
        background:
          "linear-gradient(135deg, #111827, #0F172A)",
        border:
          "1px solid rgba(148,163,184,0.12)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mx: "auto",
          mb: 2.5,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "rgba(96,165,250,0.1)",
          border:
            "1px solid rgba(96,165,250,0.25)",
        }}
      >
        <DownloadIcon
          sx={{
            color: "#60A5FA",
            fontSize: 30,
          }}
        />
      </Box>

      <Typography
        variant="h5"
        sx={{
          color: "#F8FAFC",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Architecture Documentation
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          maxWidth: 650,
          mx: "auto",
          mb: 3,
          lineHeight: 1.7,
        }}
      >
        Download the complete AEGIS-IIOT architecture documentation,
        including the six-layer security framework, hybrid machine
        learning pipeline, data flow, technology stack and adaptive
        prevention workflow.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 3,
            textAlign: "left",
          }}
        >
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={
          downloading ? (
            <CircularProgress
              size={20}
              color="inherit"
            />
          ) : (
            <DownloadIcon />
          )
        }
        size="large"
        onClick={handleDownload}
        disabled={downloading}
        sx={{
          px: 4,
          py: 1.4,
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          background:
            "linear-gradient(135deg, #2563EB, #1D4ED8)",

          "&:hover": {
            background:
              "linear-gradient(135deg, #3B82F6, #2563EB)",
          },

          "&.Mui-disabled": {
            color: "#CBD5E1",
            background: "#334155",
          },
        }}
      >
        {downloading
          ? "Generating PDF..."
          : "Download Architecture PDF"}
      </Button>
    </Paper>
  );
}

export default DownloadArchitecture;