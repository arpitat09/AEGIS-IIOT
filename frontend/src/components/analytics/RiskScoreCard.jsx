import { Grid, Paper, Typography } from "@mui/material";

const cards = [
  {
    title: "Overall Risk Score",
    value: "82%",
    color: "#EF4444",
  },
  {
    title: "Attack Confidence",
    value: "96%",
    color: "#2563EB",
  },
  {
    title: "False Positive Rate",
    value: "2.3%",
    color: "#22C55E",
  },
  {
    title: "Model Accuracy",
    value: "99.4%",
    color: "#F59E0B",
  },
];

function RiskScoreCard() {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#111827" }}>
            <Typography color="gray">{card.title}</Typography>

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

export default RiskScoreCard;