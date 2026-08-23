import { Box } from "@mui/material";

import ReportSummary from "../components/reports/ReportSummary";
import AttackStatistics from "../components/reports/AttackStatistics";
import MonthlyTrend from "../components/reports/MonthlyTrend";
import ReportDownloads from "../components/reports/ReportDownloads";
import ReportHistory from "../components/reports/ReportHistory";

function Reports() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,      // creates equal spacing between every section
        pb: 6,
      }}
    >
      <ReportSummary />

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
        <AttackStatistics />
        <MonthlyTrend />
      </Box>

      <ReportDownloads />

      <ReportHistory />
    </Box>
  );
}

export default Reports;
