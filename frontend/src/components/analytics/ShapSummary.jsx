import {
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import ChartCard from "../common/ChartCard";

const features = [
  {
    feature: "Packet Size",
    impact: "+0.42",
  },
  {
    feature: "Flow Duration",
    impact: "+0.28",
  },
  {
    feature: "TCP Flags",
    impact: "+0.20",
  },
  {
    feature: "Protocol",
    impact: "+0.14",
  },
  {
    feature: "Destination Port",
    impact: "+0.10",
  },
];

function ShapSummary() {
  return (
    <ChartCard title="SHAP Summary">
      <List>
        {features.map((item) => (
          <ListItem key={item.feature}>
            <ListItemText
              primary={item.feature}
              secondary={`Impact Score: ${item.impact}`}
            />
          </ListItem>
        ))}
      </List>
    </ChartCard>
  );
}

export default ShapSummary;