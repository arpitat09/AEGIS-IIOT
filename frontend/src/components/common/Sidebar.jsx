import {
  Dashboard,
  Radar,
  Warning,
  Analytics,
  Description,
  AccountTree,
  Settings,
} from "@mui/icons-material";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import Logo from "./Logo";

const drawerWidth = 260;

const menu = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    text: "Live Monitoring",
    icon: <Radar />,
    path: "/monitoring",
  },
  {
    text: "Incident Center",
    icon: <Warning />,
    path: "/incidents",
  },
  {
    text: "Analytics",
    icon: <Analytics />,
    path: "/analytics",
  },
  {
    text: "Reports",
    icon: <Description />,
    path: "/reports",
  },
  {
    text: "Architecture",
    icon: <AccountTree />,
    path: "/architecture",
  },
  {
    text: "Settings",
    icon: <Settings />,
    path: "/settings",
  },
];

function Sidebar() {

  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#020617",
        },
      }}
    >
      <Toolbar>

        <Logo />

      </Toolbar>

      <List>

        {menu.map((item) => (

          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
            }}
          >

            <ListItemIcon>

              {item.icon}

            </ListItemIcon>

            <ListItemText primary={item.text} />

          </ListItemButton>

        ))}

      </List>

    </Drawer>
  );
}

export default Sidebar;