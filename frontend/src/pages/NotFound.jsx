import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h2">404</Typography>

      <Typography>Page Not Found</Typography>

      <Button variant="contained" component={Link} to="/">
        Go Home
      </Button>
    </Box>
  );
}

export default NotFound;
