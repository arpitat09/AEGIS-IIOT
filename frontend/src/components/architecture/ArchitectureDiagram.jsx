import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowDownward,
  DataObject,
  DeviceHub,
  Hub,
  Insights,
  Memory,
  MonitorHeart,
  Psychology,
  Security,
  Shield,
  Storage,
} from "@mui/icons-material";

const layers = [
  {
    number: "01",
    title: "Data Ingestion",
    subtitle: "Industrial Traffic Collection",
    icon: <Storage />,
    color: "#38BDF8",
    description:
      "Collects continuous telemetry and network activity from the industrial environment.",
    technologies: [
      "Packet Capture",
      "Network Traffic",
      "Device Logs",
      "IIoT Sensors",
    ],
  },
  {
    number: "02",
    title: "Data Preprocessing",
    subtitle: "Traffic Intelligence Preparation",
    icon: <DataObject />,
    color: "#A78BFA",
    description:
      "Converts raw industrial traffic into structured and machine-learning-ready features.",
    technologies: [
      "Data Cleaning",
      "Normalization",
      "Feature Extraction",
      "Feature Selection",
    ],
  },
  {
    number: "03",
    title: "Hybrid ML Detection",
    subtitle: "Multi-Stage Threat Detection",
    icon: <Psychology />,
    color: "#60A5FA",
    description:
      "Combines anomaly detection with supervised classification for stronger threat intelligence.",
    technologies: [
      "Isolation Forest",
      "One-Class SVM",
      "XGBoost",
      "LightGBM",
    ],
    special: true,
  },
  {
    number: "04",
    title: "Explainability & Risk",
    subtitle: "Threat Understanding",
    icon: <Insights />,
    color: "#FBBF24",
    description:
      "Explains model decisions and converts detection results into actionable risk intelligence.",
    technologies: [
      "SHAP",
      "Confidence Score",
      "Risk Score",
      "Severity Engine",
    ],
  },
  {
    number: "05",
    title: "Adaptive Prevention",
    subtitle: "Automated Cyber Response",
    icon: <Shield />,
    color: "#34D399",
    description:
      "Maps detected threats to severity-aware prevention actions in real time.",
    technologies: [
      "Alert",
      "Rate Limit",
      "IP Block",
      "Firewall",
      "Device Isolation",
    ],
  },
  {
    number: "06",
    title: "Monitoring & Reporting",
    subtitle: "Security Operations Visibility",
    icon: <MonitorHeart />,
    color: "#F472B6",
    description:
      "Provides centralized visibility into threats, incidents, responses and system activity.",
    technologies: [
      "Live Dashboard",
      "Incident Center",
      "Analytics",
      "Reports",
    ],
  },
];

function FlowArrow() {
  return (
    <Box
      sx={{
        height: 54,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "1px",
          height: 28,
          background:
            "linear-gradient(180deg, #334155, #64748B)",
        }}
      />

      <ArrowDownward
        sx={{
          color: "#64748B",
          fontSize: 24,
          animation: "flowPulse 1.8s infinite",
        }}
      />
    </Box>
  );
}

function ArchitectureDiagram() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 5,
        },
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #0F172A 0%, #111827 45%, #0B1220 100%)",
        border:
          "1px solid rgba(148,163,184,0.14)",

        "@keyframes flowPulse": {
          "0%": {
            opacity: 0.35,
            transform: "translateY(-3px)",
          },

          "50%": {
            opacity: 1,
            transform: "translateY(3px)",
          },

          "100%": {
            opacity: 0.35,
            transform: "translateY(-3px)",
          },
        },
      }}
    >
      {/* Background Grid */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {/* Header */}

      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          mb: {
            xs: 4,
            md: 6,
          },
        }}
      >
        <Chip
          label="SYSTEM ARCHITECTURE"
          size="small"
          sx={{
            mb: 2,
            color: "#93C5FD",
            background:
              "rgba(59,130,246,0.1)",
            border:
              "1px solid rgba(59,130,246,0.25)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.65rem",
          }}
        />

        <Typography
          sx={{
            color: "#F8FAFC",
            fontWeight: 800,
            fontSize: {
              xs: "1.8rem",
              md: "2.5rem",
            },
          }}
        >
          AEGIS-IIOT Security Pipeline
        </Typography>

        <Typography
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 1.5,
            color: "#94A3B8",
            lineHeight: 1.7,
          }}
        >
          A six-layer hybrid machine learning architecture for detecting,
          understanding and automatically responding to industrial cyber threats.
        </Typography>
      </Box>

      {/* Input Environment */}

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            minWidth: {
              sm: 420,
            },
            px: 3,
            py: 2.5,
            borderRadius: 4,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(15,23,42,0.7))",
            border:
              "1px solid rgba(96,165,250,0.3)",
          }}
        >
          <DeviceHub
            sx={{
              color: "#60A5FA",
              fontSize: 34,
            }}
          />

          <Typography
            sx={{
              mt: 1,
              color: "#60A5FA",
              fontWeight: 800,
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
            }}
          >
            INDUSTRIAL ENVIRONMENT
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#F8FAFC",
              fontWeight: 700,
              fontSize: "1.15rem",
            }}
          >
            IIoT Devices & Network Traffic
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#64748B",
              fontSize: "0.82rem",
            }}
          >
            Sensors · PLCs · Industrial Controllers · Network Streams
          </Typography>
        </Paper>
      </Box>

      <FlowArrow />

      {/* Main Architecture Pipeline */}

      <Box
        sx={{
          position: "relative",
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {layers.map((layer, index) => (
          <Box key={layer.number}>
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                p: {
                  xs: 2,
                  md: 3,
                },
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
                border:
                  `1px solid ${layer.color}30`,
                transition:
                  "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",

                "&:hover": {
                  transform:
                    "translateY(-4px)",
                  borderColor:
                    `${layer.color}90`,
                  boxShadow:
                    `0 18px 45px ${layer.color}12`,
                },
              }}
            >
              {/* Colored Side Rail */}

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: 5,
                  background: layer.color,
                }}
              />

              <Grid
                container
                spacing={3}
                alignItems="center"
              >
                {/* Layer Identity */}

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 58,
                        height: 58,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: layer.color,
                        background:
                          `${layer.color}16`,
                        border:
                          `1px solid ${layer.color}35`,
                      }}
                    >
                      {layer.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: layer.color,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                        }}
                      >
                        LAYER {layer.number}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#F8FAFC",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                        }}
                      >
                        {layer.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#64748B",
                          fontSize: "0.78rem",
                          mt: 0.2,
                        }}
                      >
                        {layer.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Description */}

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#94A3B8",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {layer.description}
                  </Typography>
                </Grid>

                {/* Technology Chips */}

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {layer.technologies.map(
                      (technology) => (
                        <Chip
                          key={technology}
                          label={technology}
                          size="small"
                          sx={{
                            color: "#CBD5E1",
                            background:
                              `${layer.color}0E`,
                            border:
                              `1px solid ${layer.color}28`,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        />
                      )
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Hybrid ML Details */}

              {layer.special && (
                <Box
                  sx={{
                    mt: 3,
                    pt: 3,
                    borderTop:
                      "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background:
                            "rgba(56,189,248,0.06)",
                          border:
                            "1px solid rgba(56,189,248,0.16)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#38BDF8",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                          }}
                        >
                          STAGE A — ANOMALY DETECTION
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.8,
                            color: "#94A3B8",
                            fontSize: "0.85rem",
                          }}
                        >
                          Isolation Forest + One-Class SVM identify
                          unknown or abnormal industrial behavior.
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background:
                            "rgba(96,165,250,0.06)",
                          border:
                            "1px solid rgba(96,165,250,0.16)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#60A5FA",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                          }}
                        >
                          STAGE B — ATTACK CLASSIFICATION
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.8,
                            color: "#94A3B8",
                            fontSize: "0.85rem",
                          }}
                        >
                          XGBoost + LightGBM classify detected
                          malicious traffic into specific attack categories.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {index !== layers.length - 1 && (
              <FlowArrow />
            )}
          </Box>
        ))}
      </Box>

      <FlowArrow />

      {/* Final Outcome */}

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
            minWidth: {
              md: 560,
            },
            px: 4,
            py: 3,
            borderRadius: 4,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(15,23,42,0.9))",
            border:
              "1px solid rgba(74,222,128,0.3)",
          }}
        >
          <Security
            sx={{
              color: "#4ADE80",
              fontSize: 36,
            }}
          />

          <Typography
            sx={{
              mt: 1,
              color: "#4ADE80",
              fontWeight: 800,
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
            }}
          >
            SECURITY OUTCOME
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#F8FAFC",
              fontWeight: 800,
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
            }}
          >
            Detect → Explain → Assess Risk → Prevent → Monitor
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "#94A3B8",
              fontSize: "0.85rem",
            }}
          >
            Continuous adaptive protection for industrial IIoT environments
          </Typography>
        </Paper>
      </Box>

      {/* Architecture Legend */}

      <Box
        sx={{
          position: "relative",
          mt: 5,
          pt: 3,
          borderTop:
            "1px solid rgba(148,163,184,0.1)",
          display: "flex",
          justifyContent: "center",
          gap: {
            xs: 1.5,
            md: 3,
          },
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.75rem",
          }}
        >
          <Hub
            sx={{
              fontSize: 14,
              verticalAlign: "middle",
              mr: 0.5,
            }}
          />
          Continuous Data Flow
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.75rem",
          }}
        >
          <Memory
            sx={{
              fontSize: 14,
              verticalAlign: "middle",
              mr: 0.5,
            }}
          />
          Hybrid Machine Intelligence
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.75rem",
          }}
        >
          <Shield
            sx={{
              fontSize: 14,
              verticalAlign: "middle",
              mr: 0.5,
            }}
          />
          Adaptive Prevention
        </Typography>
      </Box>
    </Paper>
  );
}

export default ArchitectureDiagram;