import { Box, Typography } from "@mui/material";

const contributions = [
  "Hybrid Machine Learning Detection Framework",
  "Explainable AI using SHAP",
  "Dynamic Threat Risk Scoring",
  "Adaptive Prevention Engine",
  "Industrial IoT Focused Architecture",
];

function ResearchContribution() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#0B0C09",
        px: { xs: 3, md: 6, lg: 10 },
        py: { xs: 10, md: 15 },
      }}
    >
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: {
              xs: "2.4rem",
              md: "3.5rem",
            },
            fontWeight: 800,
            mb: 6,
          }}
        >
          Research Contributions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {contributions.map((item, index) => (
            <Box
              key={item}
              sx={{
                px: { xs: 3, md: 4 },
                py: 2.7,
                borderRadius: "999px",
                backgroundColor: "#141713",
                border: "1px solid rgba(245,241,232,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateX(8px)",
                  borderColor: "rgba(166,180,111,0.45)",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: {
                    xs: "0.9rem",
                    md: "1rem",
                  },
                  color: "#F5F1E8",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#A6B46F",
                    mr: 1,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}.
                </Box>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ResearchContribution;