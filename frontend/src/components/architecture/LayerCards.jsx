import { Grid, Paper, Typography } from "@mui/material";

const data = [
  {
    title: "Layer 1",
    subtitle: "Data Ingestion",
    desc: "Collects IIoT network traffic from industrial devices."
  },
  {
    title: "Layer 2",
    subtitle: "Preprocessing",
    desc: "Feature extraction, normalization and data cleaning."
  },
  {
    title: "Layer 3",
    subtitle: "Hybrid ML",
    desc: "Isolation Forest, One-Class SVM, XGBoost and LightGBM."
  },
  {
    title: "Layer 4",
    subtitle: "Explainability",
    desc: "SHAP values, confidence score and dynamic risk analysis."
  },
  {
    title: "Layer 5",
    subtitle: "Prevention",
    desc: "Adaptive response based on attack severity."
  },
  {
    title: "Layer 6",
    subtitle: "Monitoring",
    desc: "Dashboard, alerts, reports and visualization."
  },
];

function LayerCards() {
  return (
    <Grid container spacing={3}>
      {data.map((item) => (
        <Grid key={item.title} size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#111827",
              height: "100%",
            }}
          >
            <Typography variant="h6" color="primary">
              {item.title}
            </Typography>

            <Typography fontWeight={700} mt={1}>
              {item.subtitle}
            </Typography>

            <Typography
              color="text.secondary"
              mt={2}
            >
              {item.desc}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default LayerCards;