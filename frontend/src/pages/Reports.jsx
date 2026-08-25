import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";

import {
  Assessment,
  Warning,
  Security,
  TrendingUp,
  PictureAsPdf,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


import { apiService } from "../services/api";

// ----------------------------------------
// Chart Colors
// ----------------------------------------

const SEVERITY_COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#facc15",
  Low: "#22c55e",
};


const ATTACK_COLORS = {
  DoS: "#ef4444",
  Probe: "#3b82f6",
  R2L: "#f59e0b",
  U2R: "#a855f7",
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


function Reports() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [downloading, setDownloading] =
    useState(false);


  // ----------------------------------------
  // Fetch Reports
  // ----------------------------------------

  useEffect(() => {

    const fetchReports = async () => {

      try {

        const result =
          await apiService.getReportsSummary();

        setData(result);

        setError("");

      } catch (err) {

        console.error(
          "Reports fetch error:",
          err
        );

        setError(
          "Unable to connect to the AEGIS-IIOT reports backend."
        );

      } finally {

        setLoading(false);

      }

    };


    // Initial Fetch

    fetchReports();


    // Refresh every 5 seconds

    const interval =
      setInterval(
        fetchReports,
        5000
      );


    // Cleanup

    return () =>
      clearInterval(interval);

  }, []);


  // ----------------------------------------
  // Download PDF
  // ----------------------------------------

  const handleDownloadPDF = async () => {

    try {

      setDownloading(true);

      const downloadUrl = apiService.getReportDownloadUrl();

      const response =
        await fetch(downloadUrl);

      if (!response.ok) {

        throw new Error(
          "Failed to generate PDF report"
        );

      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "AEGIS-IIOT-Security-Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(
        "PDF download error:",
        err
      );

      alert(
        "Unable to download the PDF report."
      );

    } finally {

      setDownloading(false);

    }

  };


  // ----------------------------------------
  // Loading
  // ----------------------------------------

  if (loading && !data) {

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
  // Error
  // ----------------------------------------

  if (error && !data) {

    return (

      <Box sx={{ p: 3 }}>

        <Alert severity="error">

          {error}

        </Alert>

      </Box>

    );

  }


  // ----------------------------------------
  // Transform API Data
  // ----------------------------------------

  const attackData =
    Object.entries(
      data?.attack_distribution || {}
    ).map(
      ([attack, count]) => ({
        attack,
        count,
      })
    );


  const severityData =
    Object.entries(
      data?.severity_distribution || {}
    ).map(
      ([severity, count]) => ({
        severity,
        count,
      })
    );


  const actionData =
    Object.entries(
      data?.action_distribution || {}
    ).map(
      ([action, count]) => ({
        action,
        count,
      })
    );


  const recentAlerts =
    data?.recent_alerts || [];


  // ----------------------------------------
  // Summary Cards
  // ----------------------------------------

  const cards = [

    {
      title: "Total Alerts",

      value:
        data?.total_alerts ?? 0,

      icon:
        <Assessment />,

      color:
        "#3b82f6",
    },

    {
      title: "Critical Alerts",

      value:
        data?.critical_alerts ?? 0,

      icon:
        <Warning />,

      color:
        "#ef4444",
    },

    {
      title: "High Severity",

      value:
        data?.high_alerts ?? 0,

      icon:
        <Security />,

      color:
        "#f97316",
    },

    {
      title:
        "Average Risk Score",

      value:
        data?.average_risk_score ?? 0,

      icon:
        <TrendingUp />,

      color:
        "#14b8a6",
    },

  ];


  return (

    <Box sx={{ pb: 6 }}>


      {/* Header */}

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >

            Security Reports

          </Typography>


          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >

            Comprehensive security summary
            generated from real-time IIoT
            intrusion detection data.

          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            <PictureAsPdf />
          }
          onClick={
            handleDownloadPDF
          }
          disabled={
            downloading
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >

          {
            downloading
              ? "Generating PDF..."
              : "Download PDF Report"
          }

        </Button>

      </Box>


      {/* Summary Cards */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {

            xs:
              "1fr",

            sm:
              "1fr 1fr",

            lg:
              "repeat(4, 1fr)",

          },

          gap: 3,

          mb: 4,
        }}
      >

        {cards.map(
          (card) => (

            <Card
              key={
                card.title
              }

              sx={{
                borderRadius: 3,
                height: "100%",
              }}
            >

              <CardContent>

                <Box
                  sx={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
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
                      sx={{
                        mt: 1,
                      }}
                    >

                      {card.value}

                    </Typography>

                  </Box>


                  <Box
                    sx={{
                      p: 1.5,

                      borderRadius: 2,

                      backgroundColor:
                        `${card.color}20`,

                      color:
                        card.color,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",
                    }}
                  >

                    {card.icon}

                  </Box>

                </Box>

              </CardContent>

            </Card>

          )
        )}

      </Box>


      {/* Charts */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {

            xs:
              "1fr",

            lg:
              "1fr 1fr",

          },

          gap: 3,

          mb: 3,
        }}
      >


        {/* Attack Distribution */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mb: 3,
              }}
            >

              Attack Distribution

            </Typography>


            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={attackData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.35)"
                />


                <XAxis
                  dataKey="attack"

                  tick={{
                    fill:
                      "#94a3b8",
                  }}
                />


                <YAxis

                  tick={{
                    fill:
                      "#94a3b8",
                  }}
                />


                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />


                <Bar
                  dataKey="count"

                  name="Alerts"

                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                >

                  {
                    attackData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={
                            `attack-${index}`
                          }

                          fill={
                            ATTACK_COLORS[
                              entry.attack
                            ]
                            || "#3b82f6"
                          }
                        />

                      )
                    )
                  }

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>


        {/* Severity Distribution */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mb: 3,
              }}
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

                  {
                    severityData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={
                            `severity-${index}`
                          }

                          fill={
                            SEVERITY_COLORS[
                              entry.severity
                            ]
                            || "#64748b"
                          }
                        />

                      )
                    )
                  }

                </Pie>


                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />


                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </Box>


      {/* Prevention Action Distribution */}

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
            sx={{
              mb: 3,
            }}
          >

            Prevention Action Distribution

          </Typography>


          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={actionData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.35)"
              />


              <XAxis
                dataKey="action"

                tick={{
                  fill:
                    "#94a3b8",
                }}
              />


              <YAxis

                tick={{
                  fill:
                    "#94a3b8",
                }}
              />


              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />


              <Bar
                dataKey="count"

                name="Actions"

                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              >

                {
                  actionData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={
                          `action-${index}`
                        }

                        fill={
                          ACTION_COLORS[
                            entry.action
                          ]
                          || "#3b82f6"
                        }
                      />

                    )
                  )
                }

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>


      {/* Recent Alerts */}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              mb: 3,
            }}
          >

            Recent Security Alerts

          </Typography>


          <Box
            sx={{
              overflowX:
                "auto",
            }}
          >

            <table
              style={{
                width:
                  "100%",

                borderCollapse:
                  "collapse",

                minWidth:
                  "850px",
              }}
            >

              <thead>

                <tr>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Time
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Attack
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Severity
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Risk Score
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Action
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Source IP
                  </th>

                  <th
                    style={
                      headerStyle
                    }
                  >
                    Destination IP
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  recentAlerts.map(
                    (alert) => (

                      <tr
                        key={
                          alert.id
                        }
                      >

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.timestamp
                          }
                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.attack
                          }
                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >

                          <span
                            style={{
                              color:

                                SEVERITY_COLORS[
                                  alert.severity
                                ]

                                ||

                                "#ffffff",

                              fontWeight:
                                600,
                            }}
                          >

                            {
                              alert.severity
                            }

                          </span>

                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.risk_score
                          }
                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.action
                          }
                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.source_ip
                          }
                        </td>


                        <td
                          style={
                            cellStyle
                          }
                        >
                          {
                            alert.destination_ip
                          }
                        </td>

                      </tr>

                    )
                  )
                }

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

  textAlign:
    "left",

  padding:
    "12px",

  color:
    "#cbd5e1",
};


const cellStyle = {

  padding:
    "12px",

  color:
    "#e2e8f0",

  borderTop:
    "1px solid rgba(255,255,255,0.08)",
};


export default Reports;
