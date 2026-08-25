import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

import { apiService } from "../../services/api";

function TrafficTable({ data = null }) {
  const [internalTraffic, setInternalTraffic] = useState([]);

  useEffect(() => {
    if (data) return;

    let isMounted = true;
    const fetchTraffic = async () => {
      try {
        const res = await apiService.getMonitoringLive();
        if (isMounted && res?.traffic) {
          setInternalTraffic(res.traffic);
        }
      } catch (error) {
        console.error("Traffic table API error:", error);
      }
    };

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [data]);

  const traffic = data || internalTraffic;

  const getStatusColor = (status) => {
    if (status === "Normal") return "success";
    if (status === "Threat") return "error";
    if (status === "Suspicious") return "warning";

    return "default";
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return "error";
    if (severity === "High") return "warning";
    if (severity === "Medium") return "info";
    if (severity === "Low") return "success";

    return "default";
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#111827",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Live Network Traffic
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
            }}
          >
            Real-time network flows detected by AEGIS-IIOT
          </Typography>
        </Box>

        <Chip
          label="LIVE"
          color="success"
          size="small"
          sx={{
            fontWeight: 700,
          }}
        />
      </Box>

      <Box
        sx={{
          overflowX: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Destination IP</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Packets</TableCell>
                <TableCell>Bytes</TableCell>
                <TableCell>Attack</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {traffic.length > 0 ? (
                traffic.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(59, 130, 246, 0.08)",
                      },
                    }}
                  >
                    <TableCell>{row.timestamp}</TableCell>

                    <TableCell>
                      {row.source_ip || "-"}
                    </TableCell>

                    <TableCell>
                      {row.destination_ip || "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={(row.protocol || "-").toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {row.packets ?? 0}
                    </TableCell>

                    <TableCell>
                      {row.bytes ?? 0}
                    </TableCell>

                    <TableCell>
                      {row.attack || "Normal"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.severity || "Low"}
                        color={getSeverityColor(row.severity)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.status || "Unknown"}
                        color={getStatusColor(row.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{
                      py: 5,
                      color: "#94A3B8",
                    }}
                  >
                    No live network traffic detected yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    );
  }

export default TrafficTable;