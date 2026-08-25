import {
  Box,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function DashboardHeader({ lastUpdated }) {
  return (
    <Box
      sx={{
        mb: 3,
        p: {
          xs: 2,
          md: 3,
        },
        borderRadius: 3,
        background:
          "linear-gradient(135deg, #111C32 0%, #172554 100%)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          lg: "center",
        },
        gap: 2,
      }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 1,
            alignItems: "center",
          }}
        >
          <SecurityIcon
            sx={{
              color: "#3B82F6",
              fontSize: 28,
            }}
          />

          <Typography
            variant="overline"
            sx={{
              color: "#60A5FA",
              fontWeight: 700,
              letterSpacing: 1.5,
            }}
          >
            AEGIS-IIOT SECURITY OPERATIONS CENTER
          </Typography>
        </Stack>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#F8FAFC",
            mb: 0.5,
          }}
        >
          Real-Time Threat Intelligence
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: "0.95rem",
          }}
        >
          Adaptive Explainable Intrusion Detection & Prevention System
        </Typography>
      </Box>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1.5}
        sx={{
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
        }}
      >
        <Chip
          icon={
            <FiberManualRecordIcon
              sx={{
                fontSize: "14px !important",
                color: "#22C55E !important",
              }}
            />
          }
          label="LIVE SYSTEM"
          sx={{
            color: "#DCFCE7",
            backgroundColor:
              "rgba(34, 197, 94, 0.12)",
            border:
              "1px solid rgba(34, 197, 94, 0.35)",
            fontWeight: 700,
          }}
        />

        <Chip
          icon={
            <SecurityIcon
              sx={{
                fontSize: "17px !important",
                color: "#60A5FA !important",
              }}
            />
          }
          label="HYBRID ML ACTIVE"
          sx={{
            color: "#DBEAFE",
            backgroundColor:
              "rgba(59, 130, 246, 0.12)",
            border:
              "1px solid rgba(59, 130, 246, 0.3)",
            fontWeight: 700,
          }}
        />

        {lastUpdated && (
          <Chip
            icon={
              <AccessTimeIcon
                sx={{
                  fontSize: "16px !important",
                }}
              />
            }
            label={`Updated ${lastUpdated.toLocaleTimeString()}`}
            sx={{
              color: "#CBD5E1",
              backgroundColor:
                "rgba(148, 163, 184, 0.08)",
              fontWeight: 500,
            }}
          />
        )}
      </Stack>
    </Box>
  );
}

export default DashboardHeader;