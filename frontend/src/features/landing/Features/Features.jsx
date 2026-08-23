import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  Security,
  Psychology,
  Insights,
  Shield,
  Timeline,
  Hub,
} from "@mui/icons-material";

const features = [
  {
    icon: <Security sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "Hybrid ML Detection",
    desc: "Isolation Forest, One-Class SVM, XGBoost and LightGBM working together.",
  },
  {
    icon: <Psychology sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "Explainable AI",
    desc: "SHAP-based feature importance for transparent predictions.",
  },
  {
    icon: <Insights sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "Dynamic Risk Scoring",
    desc: "Assigns real-time threat scores for every detected attack.",
  },
  {
    icon: <Shield sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "Adaptive Prevention",
    desc: "Automatically recommends simulated prevention actions.",
  },
  {
    icon: <Timeline sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "Real-Time Analytics",
    desc: "Live dashboards with attack trends and monitoring.",
  },
  {
    icon: <Hub sx={{ fontSize: 50, color: "#2563EB" }} />,
    title: "IIoT Security",
    desc: "Designed specifically for Industrial IoT environments.",
  },
];

function Features() {
  return (
    <Box sx={{ py: 10, px: 6 }}>
      <Typography
  variant="h2"
  sx={{
    textAlign: "center",
    fontWeight: 700,
    mb: 8,
  }}
>
  Platform Features
</Typography>

    <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
  }}
>
        {features.map((item) => (
          <Card
            key={item.title}
            sx={{
              width: 340,
              borderRadius: 4,
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {item.icon}

              <Typography variant="h5" mt={3}>
                {item.title}
              </Typography>

              <Typography mt={2} color="text.secondary">
                {item.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Features;