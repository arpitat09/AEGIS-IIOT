import { Box } from "@mui/material";

import RiskScoreCard from "../components/analytics/RiskScoreCard";
import ThreatTimeline from "../components/analytics/ThreatTimeline";
import FeatureImportanceChart from "../components/analytics/FeatureImportanceChart";
import AttackConfidenceChart from "../components/analytics/AttackConfidenceChart";
import ShapSummary from "../components/analytics/ShapSummary";

function Analytics() {
  return (
    <Box>

      <RiskScoreCard />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
          mt: 3,
        }}
      >
        <ThreatTimeline />
        <AttackConfidenceChart />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          mt: 3,
        }}
      >
        <FeatureImportanceChart />
        <ShapSummary />
      </Box>

    </Box>
  );
}

export default Analytics;
