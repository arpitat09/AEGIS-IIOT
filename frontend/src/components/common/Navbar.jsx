import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import SystemStatusBar from "./SystemStatusBar";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

const drawerWidth = 240;

export default function Navbar({ streamStatus = "Connected", handleDrawerToggle }) {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: colors.background.main,
        borderBottom: `1px solid ${colors.border.muted}`,
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
        {/* Left: Mobile Toggle & System Health Pills */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: colors.text.secondary }}
          >
            <MenuIcon />
          </IconButton>

          <SystemStatusBar streamStatus={streamStatus} />
        </Box>

        {/* Right: Notification Center & User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <NotificationCenter />

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              pl: 1.5,
              borderLeft: `1px solid ${colors.border.muted}`,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: colors.accent.secondary,
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {(user?.username || "A").charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ color: colors.text.primary, fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.2 }}>
                {user?.username || "Analyst"}
              </Typography>
              <Typography sx={{ color: colors.accent.primary, fontSize: "0.68rem", fontWeight: 700, lineHeight: 1 }}>
                {user?.role || "ANALYST"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
