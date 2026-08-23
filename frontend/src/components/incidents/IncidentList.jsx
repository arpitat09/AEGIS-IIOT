import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import StatusChip from "../common/StatusChip";

const incidents = [
  {
    id: "INC-101",
    attack: "DDoS",
    severity: "Critical",
    confidence: "98%",
    action: "Blocked",
    status: "Mitigated",
  },
  {
    id: "INC-102",
    attack: "Botnet",
    severity: "High",
    confidence: "95%",
    action: "Rate Limited",
    status: "Investigating",
  },
  {
    id: "INC-103",
    attack: "Port Scan",
    severity: "Medium",
    confidence: "90%",
    action: "Alert",
    status: "Blocked",
  },
];

function IncidentList() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#111827",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Attack</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {incidents.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.attack}</TableCell>
              <TableCell>
                <StatusChip status={row.severity} />
              </TableCell>
              <TableCell>{row.confidence}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>
                <StatusChip status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default IncidentList;