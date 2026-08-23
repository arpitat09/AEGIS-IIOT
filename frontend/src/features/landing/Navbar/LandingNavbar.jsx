import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

function LandingNavbar() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(11,12,9,0.82)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(245,241,232,0.08)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "78px !important",
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "#F5F1E8",
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          AEGIS<span style={{ color: "#A6B46F" }}>-</span>IIOT
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            mr: 3,
          }}
        >
          <Button
            onClick={() => scrollToSection("platform")}
            sx={{ color: "#B8B9B0", textTransform: "none" }}
          >
            Platform
          </Button>

          <Button
            onClick={() => scrollToSection("architecture")}
            sx={{ color: "#B8B9B0", textTransform: "none" }}
          >
            Architecture
          </Button>

          <Button
            onClick={() => scrollToSection("technology")}
            sx={{ color: "#B8B9B0", textTransform: "none" }}
          >
            Technology
          </Button>
        </Box>

        <Button
          component={Link}
          to="/dashboard"
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.1,
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 700,
            color: "#0B0C09",
            background: "#A6B46F",
            "&:hover": {
              background: "#B8C985",
            },
          }}
        >
          Launch Platform
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default LandingNavbar;