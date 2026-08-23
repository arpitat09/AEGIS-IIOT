import { Chip } from "@mui/material";

function StatusChip({ status }) {
  const colorMap = {
    Critical: "error",
    High: "warning",
    Medium: "secondary",
    Low: "success",
    Blocked: "error",
    Mitigated: "success",
    Investigating: "warning",
  };

  const color = colorMap[status] || "primary";

  return <Chip label={status} color={color} size="small" />;
}

export default StatusChip;