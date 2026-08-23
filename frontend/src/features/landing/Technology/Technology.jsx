import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

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
    <Box sx={{ py: 12, px: 4 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight={700}
        mb={6}
      >
        Technology Stack
      </Typography>

      <Card
        sx={{
          maxWidth: 1000,
          mx: "auto",
          borderRadius: 4,
          p: 3,
        }}
      >
        <CardContent>
          <Stack
  direction="row"
  spacing={2}
  useFlexGap
  sx={{
    flexWrap: "wrap",
    justifyContent: "center",
  }}
>
            {technologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                color="primary"
                sx={{
                  fontSize: "1rem",
                  py: 2.5,
                  px: 1,
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Technology;