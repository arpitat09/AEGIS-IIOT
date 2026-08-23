import { Box } from "@mui/material";

import IncidentSummary from "../components/incidents/IncidentSummary";
import SeverityChart from "../components/incidents/SeverityChart";
import PreventionActions from "../components/incidents/PreventionActions";
import ResponseTimeline from "../components/incidents/ResponseTimeline";
import IncidentList from "../components/incidents/IncidentList";

function Incidents() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        pb: 6,
      }}
    >
      <IncidentSummary />

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
        <SeverityChart />
        <PreventionActions />
      </Box>

      <ResponseTimeline />

      <IncidentList />
    </Box>
  );
}

export default Incidents;