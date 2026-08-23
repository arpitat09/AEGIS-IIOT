import {
  Avatar,
  Paper,
  Typography,
  Box,
} from "@mui/material";

function UserProfile() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: "#111827",
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          sx={{
            width: 70,
            height: 70,
            bgcolor: "#2563EB",
          }}
        >
          A
        </Avatar>

        <Box>
          <Typography variant="h5">
            Administrator
          </Typography>

          <Typography color="text.secondary">
            admin@aegisiiot.com
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default UserProfile;