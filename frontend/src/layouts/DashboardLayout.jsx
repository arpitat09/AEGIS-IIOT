import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { colors } from "../theme/colors";

const drawerWidth = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: colors.background.main,
        width: "100%",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: colors.background.main,
          overflowX: "hidden",
        }}
      >
        <Navbar handleDrawerToggle={handleDrawerToggle} />

        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3.5 },
            pt: { xs: 9, md: 10 },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
