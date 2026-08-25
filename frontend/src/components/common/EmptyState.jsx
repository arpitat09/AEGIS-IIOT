import { Box, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { colors } from "../../theme/colors";

export default function EmptyState({
  title = "NO ACTIVE SECURITY ALERTS",
  description = "Network activity is currently within normal parameters.",
  icon: IconComponent = ShieldOutlinedIcon,
  height = 200,
}) {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
        borderRadius: 2,
        bgcolor: "rgba(11, 18, 32, 0.4)",
        border: `1px dashed ${colors.border.muted}`,
      }}
    >
      <IconComponent
        sx={{
          fontSize: 36,
          color: colors.text.muted,
          mb: 1.5,
          opacity: 0.6,
        }}
      />
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: colors.text.secondary,
          letterSpacing: "0.05em",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: colors.text.muted,
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
