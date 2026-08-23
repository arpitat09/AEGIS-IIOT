import { Box } from "@mui/material";

import NetworkStatus from "../components/monitoring/NetworkStatus";
import PacketRateChart from "../components/monitoring/PacketRateChart";
import TrafficTable from "../components/monitoring/TrafficTable";
import ActiveDevices from "../components/monitoring/ActiveDevices";

function Monitoring() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        pb: 6,
      }}
    >
      <NetworkStatus />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 4,
        }}
      >
        <PacketRateChart />
        <ActiveDevices />
      </Box>

      <TrafficTable />
    </Box>
  );
}

export default Monitoring;
