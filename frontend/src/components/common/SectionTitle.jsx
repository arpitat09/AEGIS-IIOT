import { Box, Typography } from "@mui/material";

function SectionTitle({ title, subtitle }) {
  return (
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Typography
        color="gray"
        mt={1}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default SectionTitle;