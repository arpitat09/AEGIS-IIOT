import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

import { Typography } from "@mui/material";
import ChartCard from "../common/ChartCard";

const events = [
  "DDoS Attack Detected",
  "Risk Score Calculated",
  "Firewall Rule Applied",
  "IP Address Blocked",
  "Incident Logged",
];

function ResponseTimeline() {
  return (
    <ChartCard title="Response Timeline">
      <Timeline position="right">
        {events.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index !== events.length - 1 && (
                <TimelineConnector />
              )}
            </TimelineSeparator>

            <TimelineContent>
              <Typography>{event}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </ChartCard>
  );
}

export default ResponseTimeline;