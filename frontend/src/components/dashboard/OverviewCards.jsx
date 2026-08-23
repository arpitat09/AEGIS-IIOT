import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const cards = [
  {
    title: "Packets Analysed",
    value: "12,458",
    color: "#2563EB",
  },
  {
    title: "Threats Detected",
    value: "327",
    color: "#DC2626",
  },
  {
    title: "Current Risk",
    value: "High",
    color: "#F59E0B",
  },
  {
    title: "Protected Devices",
    value: "48",
    color: "#16A34A",
  },
];

function OverviewCards() {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary">
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 2,
                color: card.color,
                fontWeight: 700,
              }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default OverviewCards;