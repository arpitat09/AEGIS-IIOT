import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

function DashboardLayout() {
  return (
    <Box
  sx={{
    display: "flex",
    minHeight: "100vh",
    bgcolor: "#030712",
  }}
>
  <Sidebar />

  <Box
    component="main"
    sx={{
      flexGrow: 1,
      minHeight: "100vh",
      bgcolor: "#030712",
      overflow: "auto",
    }}
  >
    <Navbar />

    <Box
      sx={{
        p: 4,
        pt: 12,
        width: "100%",
      }}
    >
      <Outlet />
    </Box>
  </Box>
</Box>
  );
}

export default DashboardLayout;
