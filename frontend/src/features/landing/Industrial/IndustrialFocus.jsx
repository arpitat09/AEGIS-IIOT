import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";

import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SensorsIcon from "@mui/icons-material/Sensors";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";

const sectors = [
  {
    icon: <PrecisionManufacturingIcon sx={{ fontSize: 32 }} />,
    title: "Smart Manufacturing",
    sub: "Robotics & Assembly",
    desc: "Defends high-speed automated assembly lines, robotic arms, and CNC machines against malicious command injection and unauthorized override signals.",
  },
  {
    icon: <SettingsInputComponentIcon sx={{ fontSize: 32 }} />,
    title: "Industrial Automation",
    sub: "SCADA & PLCs",
    desc: "Protects supervisory control systems, programmable logic controllers (PLCs), and Modbus/TCP gateways from reconnaissance probes and firmware exploits.",
  },
  {
    icon: <ElectricBoltIcon sx={{ fontSize: 32 }} />,
    title: "Smart Energy",
    sub: "Grid & Substations",
    desc: "Monitors electrical grid substations, solar arrays, and power distribution nodes for unauthorized protocol traffic and Denial of Service spikes.",
  },
  {
    icon: <LocationCityIcon sx={{ fontSize: 32 }} />,
    title: "Connected Infrastructure",
    sub: "Transit & Facilities",
    desc: "Secures smart city traffic controls, water treatment facilities, and building management systems with low-latency anomaly detection.",
  },
  {
    icon: <SensorsIcon sx={{ fontSize: 32 }} />,
    title: "IoT Sensor Networks",
    sub: "Edge Telemetry",
    desc: "Analyzes telemetry from environmental sensor arrays, vibration monitors, and BACnet/OPC-UA field buses with deterministic policy enforcement.",
  },
];

export default function IndustrialFocus() {
  return (
    <Box
      id="iiot"
      sx={{
        py: { xs: 10, md: 15 },
        px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
        bgcolor: "#060B0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: "1350px", mx: "auto", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", maxWidth: 780, mx: "auto", mb: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              color: "#00E5A8",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            INDUSTRIAL DOMAIN SPECIALIZATION
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
              fontWeight: 900,
              color: "#F3F7F6",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Built for Industrial IoT Environments
          </Typography>

          <Typography
            sx={{
              color: "#9CAFA9",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.6,
            }}
          >
            Purpose-built to handle the unique timing constraints, operational reliability,
            and protocol dynamics of OT and IIoT network ecosystems.
          </Typography>
        </Box>

        {/* Sectors Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {sectors.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  bgcolor: "rgba(11, 20, 19, 0.6)",
                  border: "1px solid rgba(0, 229, 168, 0.15)",
                  borderRadius: 2.5,
                  p: 1.5,
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(0, 229, 168, 0.45)",
                    bgcolor: "rgba(11, 20, 19, 0.9)",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 168, 0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: "rgba(0, 229, 168, 0.08)",
                      border: "1px solid rgba(0, 229, 168, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00E5A8",
                      mb: 2.5,
                    }}
                  >
                    {sec.icon}
                  </Box>

                  <Typography sx={{ color: "#F3F7F6", fontWeight: 800, fontSize: "1.05rem", mb: 0.4 }}>
                    {sec.title}
                  </Typography>

                  <Typography sx={{ color: "#00E5A8", fontSize: "0.74rem", fontWeight: 700, mb: 1.5 }}>
                    {sec.sub}
                  </Typography>

                  <Typography sx={{ color: "#9CAFA9", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {sec.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
