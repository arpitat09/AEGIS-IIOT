import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Button,
} from "@mui/material";

import {
  Security,
  Shield,
  Block,
  Speed,
  NotificationsActive,
  GppGood,
  LockOpen,
} from "@mui/icons-material";

import { apiService } from "../services/api";

function Prevention() {
  const [preventionData, setPreventionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================
  // Fetch Prevention Data
  // =====================================

  useEffect(() => {
    let isMounted = true;

    const fetchPreventionData = async () => {
      try {
        const data = await apiService.getPrevention();

        if (!isMounted) return;

        setPreventionData(data);
        setError(null);
      } catch (err) {
        console.error("Prevention API error:", err);

        if (!isMounted) return;

        setError(
          "Unable to connect to the prevention system."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPreventionData();

    const interval = setInterval(
      fetchPreventionData,
      5000
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================
  // Loading State
  // =====================================

  if (loading && !preventionData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background:
            "linear-gradient(180deg, #0B1220 0%, #0F172A 100%)",
        }}
      >
        <CircularProgress />

        <Typography
          sx={{
            color: "#94A3B8",
          }}
        >
          Loading adaptive prevention engine...
        </Typography>
      </Box>
    );
  }

  // =====================================
  // Data Extraction
  // =====================================

  const summary =
    preventionData?.summary || {};

  const recentActions =
    preventionData?.recent_actions || [];

  const firewallRules =
    preventionData?.firewall_rules || [];

  const preventionStats = [
    {
      title: "Threats Blocked",
      value:
        summary.threats_blocked ||
        summary.blocked ||
        0,
      icon: <Block />,
      color: "#ef4444",
    },
    {
      title: "Active Firewall Rules",
      value:
        firewallRules.length ||
        summary.active_rules ||
        0,
      icon: <Security />,
      color: "#3b82f6",
    },
    {
      title: "Rate Limited",
      value:
        summary.rate_limited ||
        0,
      icon: <Speed />,
      color: "#f59e0b",
    },
    {
      title: "Sessions Terminated",
      value:
        summary.sessions_terminated ||
        summary.terminated ||
        0,
      icon: <NotificationsActive />,
      color: "#a855f7",
    },
  ];

  // =====================================
  // Prevention Action Color
  // =====================================

  const getActionColor = (action) => {
    if (action === "Block IP") {
      return "#ef4444";
    }

    if (action === "Rate Limit") {
      return "#f59e0b";
    }

    if (action === "Terminate Session") {
      return "#a855f7";
    }

    return "#22c55e";
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: {
          xs: 2,
          md: 3,
        },
        background:
          "linear-gradient(180deg, #0B1220 0%, #0F172A 100%)",
      }}
    >
      {/* =====================================
          Header
      ===================================== */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgba(34,197,94,0.12)",
              color: "#22c55e",
            }}
          >
            <Shield fontSize="large" />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              Adaptive Prevention Engine
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mt: 0.5,
              }}
            >
              Automated threat response and
              severity-based prevention controls
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* =====================================
          Error
      ===================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================
          Prevention Statistics
      ===================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
        }}
      >
        {preventionStats.map((stat) => (
          <Grid
            key={stat.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "#161f2e",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.9rem",
                    }}
                  >
                    {stat.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      mt: 1,
                      fontWeight: 800,
                      color: "#f8fafc",
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      `${stat.color}18`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* =====================================
          Prevention Status
      ===================================== */}

      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
        }}
      >
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 280,
              p: 4,
              borderRadius: 4,
              background: "#161f2e",
              border:
                "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "rgba(34,197,94,0.1)",
                border:
                  "1px solid rgba(34,197,94,0.3)",
                color: "#22c55e",
              }}
            >
              <GppGood
                sx={{
                  fontSize: 52,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              Prevention Engine Active
            </Typography>

            <Chip
              label="SYSTEM PROTECTED"
              size="small"
              sx={{
                mt: 2,
                fontWeight: 700,
                color: "#22c55e",
                background:
                  "rgba(34,197,94,0.1)",
                border:
                  "1px solid rgba(34,197,94,0.25)",
              }}
            />
          </Paper>
        </Grid>

        {/* =====================================
            Recent Prevention Actions
        ===================================== */}

        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: "#161f2e",
              border:
                "1px solid rgba(255,255,255,0.06)",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f8fafc",
                mb: 3,
              }}
            >
              Recent Prevention Actions
            </Typography>

            {recentActions.length === 0 ? (
              <Typography
                sx={{
                  color: "#94a3b8",
                }}
              >
                No recent prevention actions detected.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {recentActions
                  .slice(0, 6)
                  .map((item, index) => {
                    const action =
                      item.action || "Alert";

                    return (
                      <Box
                        key={
                          item.id ||
                          index
                        }
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background:
                            "#0f172a",
                          border:
                            "1px solid rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700,
                            }}
                          >
                            {item.attack ||
                              "Unknown Threat"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              color: "#94a3b8",
                            }}
                          >
                            {item.source_ip ||
                              "Unknown Source"}
                          </Typography>
                        </Box>

                        <Chip
                          label={action}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            color:
                              getActionColor(
                                action
                              ),
                            background:
                              `${getActionColor(
                                action
                              )}18`,
                            border:
                              `1px solid ${getActionColor(
                                action
                              )}40`,
                          }}
                        />
                      </Box>
                    );
                  })}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* =====================================
          Firewall Rules
      ===================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#161f2e",
          border:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#f8fafc",
            mb: 3,
          }}
        >
          Active Firewall Rules
        </Typography>

        {firewallRules.length === 0 ? (
          <Typography
            sx={{
              color: "#94a3b8",
            }}
          >
            No active firewall rules available.
          </Typography>
        ) : (
          <Grid
            container
            spacing={2}
          >
            {firewallRules.map(
              (rule, index) => (
                <Grid
                  key={
                    rule.id ||
                    index
                  }
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "#0f172a",
                      border:
                        "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography
                        sx={{
                          color: "#f8fafc",
                          fontWeight: 700,
                        }}
                      >
                        {rule.name ||
                          rule.rule ||
                          "Firewall Rule"}
                      </Typography>
                      {rule.id && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<LockOpen sx={{ fontSize: 14 }} />}
                          onClick={async () => {
                            try {
                              await apiService.unblockRule(rule.id);
                              const data = await apiService.getPrevention();
                              setPreventionData(data);
                            } catch (e) {
                              console.error("Unblock error:", e);
                            }
                          }}
                          sx={{
                            fontSize: "0.7rem",
                            py: 0.2,
                            px: 1,
                            minWidth: "auto",
                            textTransform: "none",
                          }}
                        >
                          Unblock
                        </Button>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#94a3b8",
                      }}
                    >
                      Source:{" "}
                      {rule.source_ip ||
                        "Any"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#94a3b8",
                      }}
                    >
                      Action:{" "}
                      {rule.action ||
                        "Monitor"}
                    </Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default Prevention;