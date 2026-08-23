import { Grid, Paper, Typography } from "@mui/material";

const cards = [
  {
    title: "Packets / sec",
    value: "2,348",
    color: "#2563EB",
  },
  {
    title: "Active Connections",
    value: "185",
    color: "#22C55E",
  },
  {
    title: "Threats Today",
    value: "42",
    color: "#EF4444",
  },
  {
    title: "Bandwidth",
    value: "865 Mbps",
    color: "#F59E0B",
  },
];

function NetworkStatus() {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#111827",
            }}
          >
            <Typography color="gray">
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              mt={2}
              fontWeight={700}
              sx={{ color: card.color }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default NetworkStatus;