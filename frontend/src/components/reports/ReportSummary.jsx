import { Grid } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShieldIcon from "@mui/icons-material/Shield";

import MetricCard from "../common/MetricCard";

function ReportSummary() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Reports Generated"
          value="156"
          color="#2563EB"
          icon={<DescriptionIcon color="primary" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Downloads"
          value="87"
          color="#22C55E"
          icon={<DownloadIcon color="success" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Weekly Reports"
          value="12"
          color="#F59E0B"
          icon={<AssessmentIcon color="warning" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <MetricCard
          title="Security Score"
          value="99.4%"
          color="#EF4444"
          icon={<ShieldIcon color="error" />}
        />
      </Grid>
    </Grid>
  );
}

export default ReportSummary;