import { Paper, Typography, Box } from "@mui/material";

function MetricCard({ title, value, color, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
        },
      }}
    >
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
        <Typography color="gray">{title}</Typography>

        {icon}
      </Box>

      <Typography
        variant="h4"
        mt={2}
        fontWeight={700}
        sx={{
          color,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default MetricCard;