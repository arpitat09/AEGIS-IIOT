import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(3,7,18,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1400px",
          width: "100%",
          margin: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#3B82F6",
          }}
        >
          AEGIS IIOT
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit">Features</Button>
        <Button color="inherit">Architecture</Button>
        <Button color="inherit">Technology</Button>
        <Button color="inherit">About</Button>

        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          sx={{ ml: 3 }}
        >
          Launch Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default LandingNavbar;