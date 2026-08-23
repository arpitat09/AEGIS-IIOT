import {
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import ChartCard from "../common/ChartCard";

const reports = [
  "Daily Security Report",
  "Weekly Threat Analysis",
  "Monthly Incident Report",
  "Annual Security Audit",
];

function ReportDownloads() {
  return (
    <ChartCard title="Available Reports">
      <List>
        {reports.map((report) => (
          <ListItem
            key={report}
            secondaryAction={
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            }
          >
            <ListItemText primary={report} />
          </ListItem>
        ))}
      </List>
    </ChartCard>
  );
}

export default ReportDownloads;