import { Paper, Typography } from "@mui/material";

function ChartCard({ title, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  );
}

export default ChartCard;