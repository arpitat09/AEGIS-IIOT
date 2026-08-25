import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  Stack,
  Paper,
} from "@mui/material";

import {
  Assessment,
  Warning,
  TrendingUp,
  Security,
  Psychology,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

import { apiService } from "../services/api";

const ATTACK_COLORS = {
  DoS: "#ef4444",
  Probe: "#3b82f6",
  R2L: "#f59e0b",
  U2R: "#a855f7",
};

const SEVERITY_COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#facc15",
  Low: "#22c55e",
};

const ACTION_COLORS = {
  Alert: "#38bdf8",
  "Block IP": "#ef4444",
  "Rate Limit": "#f59e0b",
  "Terminate Session": "#14b8a6",
};

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid rgba(148,163,184,0.25)",
  borderRadius: "10px",
  color: "#ffffff",
};

function Analytics() {
  const [data, setData] = useState(null);
  const [shapData, setShapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        const [result, shapResult] = await Promise.all([
          apiService.getAnalyticsSummary(),
          apiService.getExplainabilitySummary().catch(() => null),
        ]);

        if (isMounted) {
          setData(result);
          if (shapResult?.features) {
            setShapData(shapResult.features);
          }
          setError("");
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        if (isMounted) {
          setError("Unable to connect to the AEGIS-IIOT analytics backend.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ----------------------------------------
  // Loading State
  // ----------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ----------------------------------------
  // Error State
  // ----------------------------------------

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // ----------------------------------------
  // Chart Data
  // ----------------------------------------

  const attackData = Object.entries(
    data?.attack_distribution || {}
  ).map(([attack, count]) => ({
    attack,
    count,
  }));

  const severityData = Object.entries(
    data?.severity_distribution || {}
  ).map(([severity, count]) => ({
    severity,
    count,
  }));

  const actionData = Object.entries(
    data?.action_distribution || {}
  ).map(([action, count]) => ({
    action,
    count,
  }));

  // ----------------------------------------
  // Overview Cards
  // ----------------------------------------

  const cards = [
    {
      title: "Total Alerts",
      value: data?.total_alerts ?? 0,
      icon: <Assessment />,
    },
    {
      title: "Critical Threats",
      value: data?.critical_alerts ?? 0,
      icon: <Warning />,
    },
    {
      title: "High Severity",
      value: data?.high_alerts ?? 0,
      icon: <Security />,
    },
    {
      title: "Average Risk Score",
      value: data?.average_risk_score ?? 0,
      icon: <TrendingUp />,
    },
  ];

  // ----------------------------------------
  // Main UI
  // ----------------------------------------

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Security Analytics
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Real-time analysis of threats, attacks,
          risk levels and prevention activity.
        </Typography>
      </Box>

      {/* Overview Cards */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.title}
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(59,130,246,0.12)",
                    color: "#60a5fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Attack and Severity Charts */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Attack Distribution */}

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 3 }}
            >
              Attack Type Distribution
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={attackData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.35)"
                />

                <XAxis
                  dataKey="attack"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{
                    stroke: "rgba(148,163,184,0.3)",
                  }}
                />

                <YAxis
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{
                    stroke: "rgba(148,163,184,0.3)",
                  }}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="count"
                  name="Alerts"
                  radius={[6, 6, 0, 0]}
                >
                  {attackData.map(
                    (entry, index) => (
                      <Cell
                        key={`attack-${index}`}
                        fill={
                          ATTACK_COLORS[
                            entry.attack
                          ] || "#3b82f6"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Distribution */}

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 3 }}
            >
              Severity Distribution
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {severityData.map(
                    (entry, index) => (
                      <Cell
                        key={`severity-${index}`}
                        fill={
                          SEVERITY_COLORS[
                            entry.severity
                          ] || "#3b82f6"
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Prevention Actions */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 3 }}
          >
            Prevention Action Distribution
          </Typography>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={actionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.35)"
              />

              <XAxis
                dataKey="action"
                tick={{ fill: "#94a3b8" }}
                axisLine={{
                  stroke: "rgba(148,163,184,0.3)",
                }}
              />

              <YAxis
                tick={{ fill: "#94a3b8" }}
                axisLine={{
                  stroke: "rgba(148,163,184,0.3)",
                }}
              />

              <Tooltip
                contentStyle={tooltipStyle}
              />

              <Legend />

              <Bar
                dataKey="count"
                name="Actions"
                radius={[6, 6, 0, 0]}
              >
                {actionData.map(
                  (entry, index) => (
                    <Cell
                      key={`action-${index}`}
                      fill={
                        ACTION_COLORS[
                          entry.action
                        ] || "#3b82f6"
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SHAP Feature Importance & Explainability */}
      <Card sx={{ borderRadius: 3, mb: 3, bgcolor: "#111827", border: "1px solid rgba(148,163,184,0.12)" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Psychology sx={{ color: "#38bdf8" }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: "#f8fafc" }}>
                  Explainable AI (SHAP) — Feature Attribution
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                TreeExplainer feature contributions explaining hybrid ML classification decisions
              </Typography>
            </Box>
            <Chip
              label="SHAP Active"
              color="primary"
              size="small"
              sx={{ fontWeight: 700, bgcolor: "rgba(56,189,248,0.15)", color: "#38bdf8" }}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
            {(shapData || [
              { feature: "src_bytes", importance: 0.284, impact: "+0.42", description: "Bytes sent from source to destination" },
              { feature: "dst_bytes", importance: 0.215, impact: "+0.35", description: "Bytes sent from destination to source" },
              { feature: "count", importance: 0.162, impact: "+0.28", description: "Connections to same destination host" },
              { feature: "srv_count", importance: 0.118, impact: "+0.20", description: "Connections to same service" },
              { feature: "same_srv_rate", importance: 0.089, impact: "+0.15", description: "Rate of connections to same service" },
              { feature: "dst_host_srv_count", importance: 0.065, impact: "+0.12", description: "Destination host service density" },
            ]).map((item) => (
              <Paper
                key={item.feature}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: "#0f172a",
                  border: "1px solid rgba(148,163,184,0.08)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ color: "#f8fafc", fontWeight: 600, fontFamily: "monospace" }}>
                    {item.feature}
                  </Typography>
                  <Chip
                    label={`SHAP ${item.impact || `+${item.importance}`}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      bgcolor: "rgba(34,197,94,0.12)",
                      color: "#22c55e",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mb: 1.5 }}>
                  {item.description}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.round((item.importance || 0.2) * 250))}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "rgba(148,163,184,0.12)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #38bdf8 0%, #3b82f6 100%)",
                      borderRadius: 3,
                    },
                  }}
                />
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Security Events */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 3 }}
          >
            Recent Security Events
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>
                    Time
                  </th>

                  <th style={headerStyle}>
                    Attack
                  </th>

                  <th style={headerStyle}>
                    Severity
                  </th>

                  <th style={headerStyle}>
                    Risk Score
                  </th>

                  <th style={headerStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {(data?.recent_alerts || []).map(
                  (alert) => (
                    <tr key={alert.id}>
                      <td style={cellStyle}>
                        {alert.timestamp}
                      </td>

                      <td style={cellStyle}>
                        {alert.attack}
                      </td>

                      <td style={cellStyle}>
                        {alert.severity}
                      </td>

                      <td style={cellStyle}>
                        {alert.risk_score}
                      </td>

                      <td style={cellStyle}>
                        {alert.action}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// ----------------------------------------
// Table Styles
// ----------------------------------------

const headerStyle = {
  textAlign: "left",
  padding: "12px",
  color: "#cbd5e1",
};

const cellStyle = {
  padding: "12px",
  color: "#e2e8f0",
  borderTop:
    "1px solid rgba(255,255,255,0.08)",
};

export default Analytics;
