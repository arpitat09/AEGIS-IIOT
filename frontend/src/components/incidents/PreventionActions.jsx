import {
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import ChartCard from "../common/ChartCard";
import StatusChip from "../common/StatusChip";

const actions = [
  {
    action: "Firewall Rule Applied",
    status: "Blocked",
  },
  {
    action: "Rate Limiting Enabled",
    status: "Mitigated",
  },
  {
    action: "Device Isolated",
    status: "Blocked",
  },
  {
    action: "Security Alert Generated",
    status: "Investigating",
  },
];

function PreventionActions() {
  return (
    <ChartCard title="Prevention Actions">
      <List>
        {actions.map((item) => (
          <ListItem
            key={item.action}
            secondaryAction={
              <StatusChip status={item.status} />
            }
          >
            <ListItemText primary={item.action} />
          </ListItem>
        ))}
      </List>
    </ChartCard>
  );
}

export default PreventionActions;