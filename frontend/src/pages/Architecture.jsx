import { Box } from "@mui/material";

import ArchitectureHeader from "../components/architecture/ArchitectureHeader";
import ArchitectureDiagram from "../components/architecture/ArchitectureDiagram";
import LayerCards from "../components/architecture/LayerCards";
import DataFlow from "../components/architecture/DataFlow";
import TechnologyStack from "../components/architecture/TechnologyStack";
import DownloadArchitecture from "../components/architecture/DownloadArchitecture";

function Architecture() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,          // equal spacing between every section
        pb: 6,
      }}
    >
      <ArchitectureHeader />

      <ArchitectureDiagram />

      <LayerCards />

      <DataFlow />

      <TechnologyStack />

      <DownloadArchitecture />
    </Box>
  );
}

export default Architecture;
