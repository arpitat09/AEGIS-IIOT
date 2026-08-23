import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const rows = [
  {
    source: "192.168.1.25",
    destination: "10.0.0.2",
    protocol: "TCP",
    packets: 452,
    status: "Normal",
  },
  {
    source: "172.16.0.11",
    destination: "10.0.0.8",
    protocol: "UDP",
    packets: 1205,
    status: "DDoS",
  },
  {
    source: "192.168.1.17",
    destination: "10.0.0.5",
    protocol: "ICMP",
    packets: 254,
    status: "Suspicious",
  },
];

function TrafficTable() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h6" mb={3}>
        Live Network Traffic
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source IP</TableCell>
            <TableCell>Destination IP</TableCell>
            <TableCell>Protocol</TableCell>
            <TableCell>Packets</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.source}</TableCell>
              <TableCell>{row.destination}</TableCell>
              <TableCell>{row.protocol}</TableCell>
              <TableCell>{row.packets}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TrafficTable;