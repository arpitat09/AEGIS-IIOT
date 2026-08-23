import {
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const devices = [
  {
    name: "PLC-01",
    status: "Online",
  },
  {
    name: "SCADA Server",
    status: "Online",
  },
  {
    name: "Sensor Hub",
    status: "Warning",
  },
  {
    name: "Gateway",
    status: "Offline",
  },
];

function ActiveDevices() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 360,
        bgcolor: "#111827",
      }}
    >
      <Typography variant="h6" mb={2}>
        Active Devices
      </Typography>

      <List>
        {devices.map((device) => (
          <ListItem
            key={device.name}
            secondaryAction={
              <Chip
                label={device.status}
                color={
                  device.status === "Online"
                    ? "success"
                    : device.status === "Warning"
                    ? "warning"
                    : "error"
                }
              />
            }
          >
            <ListItemText primary={device.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ActiveDevices;