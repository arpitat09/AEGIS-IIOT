import { Grid } from "@mui/material";
import GppBadIcon from "@mui/icons-material/GppBad";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import MetricCard from "../common/MetricCard";

function IncidentSummary() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Open Incidents"
          value="18"
          color="#EF4444"
          icon={<GppBadIcon color="error" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Critical Threats"
          value="5"
          color="#F59E0B"
          icon={<WarningAmberIcon color="warning" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Blocked Attacks"
          value="94"
          color="#22C55E"
          icon={<ShieldIcon color="success" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Resolved"
          value="81"
          color="#2563EB"
          icon={<CheckCircleIcon color="primary" />}
        />
      </Grid>
    </Grid>
  );
}

export default IncidentSummary;