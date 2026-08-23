import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
} from "@mui/material";

import {
  Notifications,
  AccountCircle,
} from "@mui/icons-material";

const drawerWidth = 260;

function Navbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "#111827",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit">
          <Badge badgeContent={5} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            bgcolor: "#2563EB",
            ml: 2,
          }}
        >
          <AccountCircle />
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;