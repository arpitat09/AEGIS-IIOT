import {
  Paper,
  Typography,
  Grid,
  Chip,
  Box,
} from "@mui/material";

const techStack = [
  {
    category: "Frontend",
    technologies: ["React", "Material UI", "Recharts"],
  },
  {
    category: "Backend",
    technologies: ["Flask", "Python", "Socket.IO"],
  },
  {
    category: "Machine Learning",
    technologies: [
      "Isolation Forest",
      "One-Class SVM",
      "XGBoost",
      "LightGBM",
      "SHAP",
      "Scikit-Learn",
    ],
  },
  {
    category: "Database",
    technologies: ["SQLite"],
  },
];

function TechnologyStack() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "#111827",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={4}
      >
        Technology Stack
      </Typography>

      <Grid container spacing={3}>
        {techStack.map((section) => (
          <Grid
            key={section.category}
            size={{ xs: 12, md: 6 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#1F2937",
                border: "1px solid rgba(255,255,255,0.08)",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                mb={2}
              >
                {section.category}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                {section.technologies.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default TechnologyStack;