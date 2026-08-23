import { Box, Paper, Typography, Stack } from "@mui/material";

const stats = [
  {
    value: "99.4%",
    title: "Detection Accuracy",
  },
  {
    value: "4",
    title: "Hybrid ML Models",
  },
  {
    value: "6",
    title: "Security Layers",
  },
  {
    value: "10,000+",
    title: "Traffic Records Analysed",
  },
];

function Stats() {
  return (
    <Box
  sx={{
    pt: 4,
    pb: 12,
    px: 6,
  }}
>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{
    justifyContent: "center",
  }}
      >
        {stats.map((item) => (
          <Paper
            key={item.title}
            sx={{
              flex: 1,
              p: 4,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
            >
              {item.value}
            </Typography>

            <Typography sx={{ mt: 2 }}>
              {item.title}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default Stats;