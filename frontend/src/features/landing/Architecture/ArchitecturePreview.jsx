import { Box, Typography } from "@mui/material";

const layers = [
  {
    number: "01",
    title: "Data Ingestion",
    description:
      "Collect and ingest Industrial IoT network traffic from connected devices and communication sources.",
  },
  {
    number: "02",
    title: "Preprocessing & Feature Engineering",
    description:
      "Clean, transform, normalize, and prepare network features for intelligent analysis.",
  },
  {
    number: "03",
    title: "Hybrid ML Detection",
    description:
      "Combine anomaly detection and supervised classification to identify known and unknown threats.",
  },
  {
    number: "04",
    title: "Explainability & Risk Analysis",
    description:
      "Use SHAP-based insights and dynamic scoring to understand attack behaviour and severity.",
  },
  {
    number: "05",
    title: "Prevention Engine",
    description:
      "Map detected threats to severity-based adaptive prevention recommendations.",
  },
  {
    number: "06",
    title: "Monitoring & Reporting",
    description:
      "Visualize alerts, attack trends, model results, and security activity in real time.",
  },
];

function ArchitecturePreview() {
  return (
    <Box
      id="architecture"
      sx={{
        width: "100%",
        backgroundColor: "#0B0C09",
        px: { xs: 3, md: 6, lg: 10 },
        py: { xs: 10, md: 15 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "760px",
            mx: "auto",
            mb: 8,
          }}
        >
          <Typography
            sx={{
              color: "#A6B46F",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              mb: 2,
            }}
          >
            SECURITY PIPELINE
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "2.4rem",
                md: "3.8rem",
              },
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            Six Layer{" "}
            <Box component="span" sx={{ color: "#E86F2A" }}>
              Architecture.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3,
              color: "#B8B7AF",
              fontSize: {
                xs: "1rem",
                md: "1.1rem",
              },
              lineHeight: 1.7,
            }}
          >
            A unified end-to-end security architecture that transforms raw
            Industrial IoT network data into explainable threat detection,
            intelligent risk analysis, and adaptive prevention.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {layers.map((layer) => (
            <Box
              key={layer.number}
              sx={{
                position: "relative",
                minHeight: 250,
                p: 3.5,
                overflow: "hidden",
                backgroundColor: "#141713",
                border: "1px solid rgba(245,241,232,0.1)",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "rgba(166,180,111,0.45)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#777A71",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                }}
              >
                LAYER {layer.number}
              </Typography>

              <Box
                sx={{
                  width: 42,
                  height: 2,
                  backgroundColor: "#A6B46F",
                  mt: 4,
                  mb: 3,
                }}
              />

              <Typography
                sx={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  maxWidth: "85%",
                }}
              >
                {layer.title}
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: "#A9AAA0",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                }}
              >
                {layer.description}
              </Typography>

              <Typography
                sx={{
                  position: "absolute",
                  right: 20,
                  bottom: 5,
                  fontSize: "3.3rem",
                  fontWeight: 800,
                  color: "rgba(245,241,232,0.06)",
                }}
              >
                {layer.number}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ArchitecturePreview;