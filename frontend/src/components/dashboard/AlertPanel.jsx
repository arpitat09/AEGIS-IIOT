import {
  Paper,
  Typography,
  List,
  ListItem,
  Chip,
} from "@mui/material";

const alerts = [
  {
    attack: "DDoS Attack",
    level: "Critical",
  },
  {
    attack: "Bot Activity",
    level: "High",
  },
  {
    attack: "Port Scan",
    level: "Medium",
  },
  {
    attack: "Suspicious Login",
    level: "Low",
  },
];

function AlertPanel() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 340,
      }}
    >
      <Typography
        variant="h6"
        mb={2}
      >
        Recent Alerts
      </Typography>

      <List>
        {alerts.map((item) => (
          <ListItem
            key={item.attack}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {item.attack}

            <Chip
              label={item.level}
              color={
                item.level === "Critical"
                  ? "error"
                  : item.level === "High"
                  ? "warning"
                  : item.level === "Medium"
                  ? "info"
                  : "success"
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default AlertPanel;