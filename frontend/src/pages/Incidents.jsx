import { useEffect, useState } from "react";
import { Box, Alert, CircularProgress } from "@mui/material";

import IncidentSummary from "../components/incidents/IncidentSummary";
import SeverityChart from "../components/incidents/SeverityChart";
import PreventionActions from "../components/incidents/PreventionActions";
import ResponseTimeline from "../components/incidents/ResponseTimeline";
import IncidentList from "../components/incidents/IncidentList";

import { apiService } from "../services/api";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = async () => {
    try {
      const data = await apiService.getIncidents();
      setIncidents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Incident API error:", err);
      setError("Unable to connect to the AEGIS-IIOT incident backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchIncidents();
    }, 0);

    const interval = setInterval(() => {
      fetchIncidents();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pb: 6,
      }}
    >
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <IncidentSummary incidents={incidents} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 4,
        }}
      >
        <SeverityChart incidents={incidents} />
        <PreventionActions incidents={incidents} />
      </Box>

      <ResponseTimeline incidents={incidents} />

      <IncidentList incidents={incidents} onIncidentUpdated={fetchIncidents} />
    </Box>
  );
}

export default Incidents;