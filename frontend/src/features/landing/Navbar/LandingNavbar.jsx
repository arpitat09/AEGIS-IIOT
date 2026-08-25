import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const navLinks = [
    { label: "Platform", id: "capabilities" },
    { label: "Pipeline", id: "pipeline" },
    { label: "Threat Intel", id: "threat-preview" },
    { label: "Architecture", id: "architecture" },
    { label: "Technology", id: "technology" },
    { label: "IIoT Focus", id: "iiot" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(6, 11, 10, 0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0, 229, 168, 0.12)",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Brand Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              bgcolor: "rgba(0, 229, 168, 0.1)",
              border: "1px solid rgba(0, 229, 168, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 229, 168, 0.2)",
            }}
          >
            <ShieldIcon sx={{ color: "#00E5A8", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#F3F7F6",
                fontSize: "1.15rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              AEGIS<span style={{ color: "#00E5A8" }}>-</span>IIOT
            </Typography>
            <Typography
              sx={{
                color: "#9CAFA9",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Industrial Cyber Defense
            </Typography>
          </Box>
        </Box>

        {/* Center: Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              sx={{
                color: "#9CAFA9",
                textTransform: "none",
                fontSize: "0.88rem",
                fontWeight: 500,
                px: 1.8,
                py: 0.8,
                borderRadius: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#F3F7F6",
                  background: "rgba(0, 229, 168, 0.06)",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Right: Live Status & Launch Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Live Status Indicator */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "rgba(0, 229, 168, 0.08)",
              border: "1px solid rgba(0, 229, 168, 0.25)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#00E5A8",
                boxShadow: "0 0 8px #00E5A8",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <Typography
              sx={{
                color: "#00E5A8",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              SYSTEM SECURE
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/dashboard"
            endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 0.9,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "#060B0A",
              background: "linear-gradient(135deg, #00E5A8 0%, #00C896 100%)",
              boxShadow: "0 0 20px rgba(0, 229, 168, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #33ECC0 0%, #00E5A8 100%)",
                boxShadow: "0 0 25px rgba(0, 229, 168, 0.4)",
              },
            }}
          >
            Launch Platform
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#F3F7F6",
              border: "1px solid rgba(0, 229, 168, 0.2)",
              borderRadius: 1.5,
              p: 0.8,
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            top: "72px !important",
            bgcolor: "#060B0A",
            borderBottom: "1px solid rgba(0, 229, 168, 0.2)",
            px: 2,
            py: 2,
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.id} disablePadding>
              <ListItemButton
                onClick={() => scrollToSection(link.id)}
                sx={{
                  py: 1.2,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "rgba(0, 229, 168, 0.08)" },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    color: "#F3F7F6",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <Button
              component={Link}
              to="/dashboard"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#00E5A8",
                color: "#060B0A",
                fontWeight: 700,
                py: 1.2,
                borderRadius: 1.5,
              }}
            >
              Enter Live Dashboard
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}
