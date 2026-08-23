import { Box } from "@mui/material";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import OverviewCards from "../components/dashboard/OverviewCards";
import ThreatGauge from "../components/dashboard/ThreatGauge";
import TrafficChart from "../components/dashboard/TrafficChart";
import AttackDistribution from "../components/dashboard/AttackDistribution";
import AlertPanel from "../components/dashboard/AlertPanel";
import IncidentTable from "../components/dashboard/IncidentTable";

function Dashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        pb: 6,
      }}
    >
      <DashboardHeader />

      <OverviewCards />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 2fr",
          },
          gap: 4,
        }}
      >
        <ThreatGauge />
        <TrafficChart />
      </Box>

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
        <AlertPanel />
        <AttackDistribution />
      </Box>

      <IncidentTable />
    </Box>
  );
}

export default Dashboard;