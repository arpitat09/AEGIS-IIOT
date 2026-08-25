import { Box, Typography, Stack, Divider } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

export default function LiveSystemStatusPanel({ liveMetrics }) {
  const activeThreats = liveMetrics?.threats || 24;
  const highRisk = liveMetrics?.highRisk || 3;
  const totalFlows = liveMetrics?.flows || "1,248";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 440,
        bgcolor: "rgba(11, 20, 19, 0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 229, 168, 0.2)",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 229, 168, 0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Scanner Line Animation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #00E5A8 50%, transparent 100%)",
          animation: "scanTop 3s ease-in-out infinite",
          "@keyframes scanTop": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        }}
      />

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RadioButtonCheckedIcon sx={{ color: "#00E5A8", fontSize: 16, animation: "spin 8s linear infinite", "@keyframes spin": { "100%": { transform: "rotate(360deg)" } } }} />
          <Typography
            sx={{
              color: "#F3F7F6",
              fontWeight: 800,
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Live Security Status
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            px: 1.2,
            py: 0.3,
            borderRadius: "999px",
            bgcolor: "rgba(0, 229, 168, 0.12)",
            border: "1px solid rgba(0, 229, 168, 0.3)",
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              bgcolor: "#00E5A8",
              boxShadow: "0 0 6px #00E5A8",
            }}
          />
          <Typography sx={{ color: "#00E5A8", fontSize: "0.68rem", fontWeight: 800 }}>
            SECURE
          </Typography>
        </Box>
      </Box>

      {/* Radar Scan Graphic & Live Wave */}
      <Box
        sx={{
          height: 90,
          width: "100%",
          bgcolor: "rgba(6, 11, 10, 0.6)",
          border: "1px solid rgba(0, 229, 168, 0.1)",
          borderRadius: 2,
          p: 1.5,
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radar concentric rings */}
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            border: "1px solid rgba(0, 229, 168, 0.2)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px dashed rgba(0, 229, 168, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#00E5A8", boxShadow: "0 0 10px #00E5A8" }} />
          </Box>

          {/* Sweep needle */}
          <Box
            sx={{
              position: "absolute",
              width: "50%",
              height: "1px",
              background: "linear-gradient(90deg, #00E5A8, transparent)",
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              animation: "sweep 4s linear infinite",
              "@keyframes sweep": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>

        {/* Telemetry Stream Readout */}
        <Box sx={{ flexGrow: 1, pl: 2 }}>
          <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontFamily: "monospace" }}>
            INGESTION: SCAPY RAW SOCKET
          </Typography>
          <Typography sx={{ color: "#F3F7F6", fontWeight: 700, fontSize: "0.88rem", my: 0.2 }}>
            Real-Time Wire Telemetry
          </Typography>
          <Typography sx={{ color: "#00E5A8", fontSize: "0.72rem", fontFamily: "monospace" }}>
            41 Features Extracted / Flow
          </Typography>
        </Box>
      </Box>

      {/* Grid of Key Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: "rgba(6, 11, 10, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 600 }}>
            NETWORK TRAFFIC
          </Typography>
          <Typography sx={{ color: "#00E5A8", fontWeight: 800, fontSize: "1.1rem", my: 0.3 }}>
            LIVE
          </Typography>
          <Typography sx={{ color: "#9CAFA9", fontSize: "0.65rem" }}>
            {totalFlows} active flows
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: "rgba(6, 11, 10, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography sx={{ color: "#9CAFA9", fontSize: "0.68rem", fontWeight: 600 }}>
            ACTIVE THREATS
          </Typography>
          <Typography sx={{ color: "#FFB020", fontWeight: 800, fontSize: "1.1rem", my: 0.3 }}>
            {activeThreats}
          </Typography>
          <Typography sx={{ color: "#FF6B35", fontSize: "0.65rem", fontWeight: 700 }}>
            {highRisk} High / Critical
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(0, 229, 168, 0.1)", mb: 1.5 }} />

      {/* Footer Info */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ color: "#9CAFA9", fontSize: "0.7rem" }}>
          ML ENGINES: <strong>LightGBM + XGBoost</strong>
        </Typography>
        <Typography sx={{ color: "#00E5A8", fontSize: "0.7rem", fontFamily: "monospace" }}>
          SYNC: Just now
        </Typography>
      </Box>
    </Box>
  );
}
