import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const rows = [
  {
    ip: "192.168.1.12",
    attack: "DDoS",
    risk: "Critical",
    status: "Blocked",
  },
  {
    ip: "10.0.0.8",
    attack: "Bot",
    risk: "High",
    status: "Monitoring",
  },
  {
    ip: "172.16.0.3",
    attack: "Brute Force",
    risk: "Medium",
    status: "Investigating",
  },
];

function IncidentTable() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        mb={3}
      >
        Recent Incidents
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source IP</TableCell>
            <TableCell>Attack</TableCell>
            <TableCell>Risk</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.ip}>
              <TableCell>{row.ip}</TableCell>
              <TableCell>{row.attack}</TableCell>
              <TableCell>{row.risk}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default IncidentTable;