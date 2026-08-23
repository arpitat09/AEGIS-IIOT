import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function ReportHistory() {
  const history = [
    {
      date: "04 Aug 2026",
      report: "Daily Report",
      user: "Admin",
      status: "Downloaded",
    },
    {
      date: "03 Aug 2026",
      report: "Threat Analysis",
      user: "Security Team",
      status: "Generated",
    },
    {
      date: "02 Aug 2026",
      report: "Monthly Report",
      user: "Administrator",
      status: "Downloaded",
    },
  ];

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
            <TableCell>Date</TableCell>
            <TableCell>Report</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.report}</TableCell>
              <TableCell>{item.user}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ReportHistory;