import {
  Dashboard,
  Radar,
  Warning,
  Shield,
  Analytics,
  Description,
  AccountTree,
  Settings,
  Public,
  Policy,
  Logout,
  AutoAwesome,
  PrecisionManufacturing,
  NotificationsActive,
  Hub,
} from "@mui/icons-material";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen = false, handleDrawerToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const menu = [
    {
      text: "Command Center",
      icon: <Dashboard fontSize="small" />,
      path: "/dashboard",
    },
    {
      text: "Incident Response",
      icon: <Warning fontSize="small" />,
      path: "/incidents",
    },
    {
      text: "AI SOC Copilot",
      icon: <AutoAwesome fontSize="small" sx={{ color: "#00E5A8" }} />,
      path: "/ai-copilot",
    },
    {
      text: "Asset Inventory",
      icon: <PrecisionManufacturing fontSize="small" />,
      path: "/assets",
    },
    {
      text: "Notification Rules",
      icon: <NotificationsActive fontSize="small" />,
      path: "/notification-rules",
    },
    {
      text: "SIEM Integrations",
      icon: <Hub fontSize="small" />,
      path: "/integrations",
    },
    {
      text: "Live Monitoring",
      icon: <Radar fontSize="small" />,
      path: "/monitoring",
    },
    {
      text: "Threat Intelligence",
      icon: <Public fontSize="small" />,
      path: "/threat-intelligence",
    },
    {
      text: "Prevention",
      icon: <Shield fontSize="small" />,
      path: "/prevention",
    },
    {
      text: "Analytics & XAI",
      icon: <Analytics fontSize="small" />,
      path: "/analytics",
    },
    {
      text: "Reports & Forensics",
      icon: <Description fontSize="small" />,
      path: "/reports",
    },
    {
      text: "System Architecture",
      icon: <AccountTree fontSize="small" />,
      path: "/architecture",
    },
    {
      text: "Settings",
      icon: <Settings fontSize="small" />,
      path: "/settings",
    },
  ];

  if (isAdmin) {
    menu.push({
      text: "Security Audit Logs",
      icon: <Policy fontSize="small" />,
      path: "/audit-logs",
    });
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: colors.background.sidebar,
        borderRight: `1px solid ${colors.border.muted}`,
      }}
    >
      {/* Brand Header */}
      <Box>
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${colors.border.muted}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "rgba(0, 212, 255, 0.1)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              color: colors.accent.primary,
              boxShadow: `0 0 12px ${colors.accent.primaryGlow}`,
            }}
          >
            <Shield fontSize="medium" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
                color: colors.text.primary,
              }}
            >
              AEGIS-IIOT
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: colors.accent.primary,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              ADAPTIVE CYBER DEFENSE
            </Typography>
          </Box>
        </Box>

        {/* Navigation List */}
        <List sx={{ px: 1.2, py: 1.5 }}>
          {menu.map((item) => {
            const isSelected = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  mb: 0.5,
                  borderRadius: 1.5,
                  py: 1,
                  px: 1.5,
                  position: "relative",
                  bgcolor: isSelected ? "rgba(0, 212, 255, 0.08)" : "transparent",
                  color: isSelected ? colors.accent.primary : colors.text.secondary,
                  border: isSelected
                    ? `1px solid rgba(0, 212, 255, 0.25)`
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isSelected
                      ? "rgba(0, 212, 255, 0.12)"
                      : "rgba(255, 255, 255, 0.04)",
                    color: colors.text.primary,
                  },
                }}
              >
                {/* Left Active Glow Indicator */}
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 3,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: colors.accent.primary,
                      boxShadow: `0 0 8px ${colors.accent.primary}`,
                    }}
                  />
                )}

                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: isSelected ? colors.accent.primary : colors.text.muted,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.84rem",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Footer: System Status & User Card */}
      <Box sx={{ p: 1.5, borderTop: `1px solid ${colors.border.muted}` }}>
        {/* System Status Pill */}
        <Box
          sx={{
            p: 1.2,
            mb: 1.5,
            borderRadius: 1.5,
            bgcolor: "rgba(11, 18, 32, 0.8)",
            border: `1px solid ${colors.border.subtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: colors.status.safe,
                boxShadow: `0 0 6px ${colors.status.safe}`,
              }}
            />
            <Typography sx={{ color: colors.text.secondary, fontSize: "0.72rem", fontWeight: 700 }}>
              System Status
            </Typography>
          </Box>
          <Typography sx={{ color: colors.status.safe, fontSize: "0.72rem", fontWeight: 800 }}>
            Operational
          </Typography>
        </Box>

        {/* User Card */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 1.5,
            bgcolor: "rgba(15, 23, 42, 0.7)",
            border: `1px solid ${colors.border.subtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, overflow: "hidden" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: colors.accent.secondary,
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              {(user?.username || "A").charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography
                noWrap
                sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.82rem" }}
              >
                {user?.username || "SOC Analyst"}
              </Typography>
              <Typography
                noWrap
                sx={{ color: colors.accent.primary, fontSize: "0.68rem", fontWeight: 700 }}
              >
                {user?.role || "ANALYST"}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Sign Out" arrow>
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{ color: colors.text.muted, "&:hover": { color: colors.status.critical } }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Permanent Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Temporary Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
