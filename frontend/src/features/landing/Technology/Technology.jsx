import { Box, Typography } from "@mui/material";

const technologies = [
  "React",
  "Flask",
  "Python",
  "XGBoost",
  "LightGBM",
  "SHAP",
  "SQLite",
  "Socket.IO",
  "Scikit-Learn",
  "Material UI",
];

function Technology() {
  return (
    <Box
      id="technology"
      sx={{
        width: "100%",
        backgroundColor: "#0B0C09",
        px: { xs: 3, md: 6, lg: 10 },
        py: { xs: 10, md: 15 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1050px",
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "2.4rem",
              md: "3.5rem",
            },
            fontWeight: 800,
            mb: 5,
          }}
        >
          Technology Stack
        </Typography>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            backgroundColor: "#141713",
            border: "1px solid rgba(245,241,232,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {technologies.map((tech) => (
            <Box
              key={tech}
              sx={{
                px: 2.4,
                py: 1.1,
                borderRadius: "999px",
                backgroundColor: "#E86F2A",
                color: "#000000",
                fontSize: "0.9rem",
                fontWeight: 600,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  backgroundColor: "#E86F2A",
                },
              }}
            >
              {tech}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Technology;