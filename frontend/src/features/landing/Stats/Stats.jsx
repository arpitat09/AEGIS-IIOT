import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const stats = [
  ["99.4%", "Detection Accuracy"],
  ["4", "Hybrid ML Models"],
  ["6", "Security Layers"],
  ["10K+", "Traffic Records Analysed"],
];

function Stats() {
  return (
    <Box
      id="platform"
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#0B0C09",
        color: "#F5F1E8",
        px: { xs: 3, md: 8 },
        py: { xs: 10, md: 14 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(166,180,111,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(166,180,111,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,111,42,0.12), transparent 70%)",
          left: "-200px",
          bottom: "-250px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "#A6B46F",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            mb: 2,
          }}
        >
          PLATFORM PERFORMANCE
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: { xs: "2.5rem", md: "4rem" },
            fontWeight: 800,
            letterSpacing: "-0.05em",
            mb: { xs: 6, md: 9 },
          }}
        >
          Security by the{" "}
          <Box component="span" sx={{ color: "#E86F2A" }}>
            numbers.
          </Box>
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {stats.map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 180, md: 230 },
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: "1px solid rgba(245,241,232,0.1)",
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  transition: "0.35s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(166,180,111,0.45)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "2.8rem", md: "4rem" },
                    fontWeight: 800,
                    letterSpacing: "-0.06em",
                    color: "#E86F2A",
                  }}
                >
                  {value}
                </Typography>

                <Box>
                  <Box
                    sx={{
                      width: 42,
                      height: 2,
                      background: "#A6B46F",
                      mb: 2,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#B8B9B0",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Stats;