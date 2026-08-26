import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  Stack,
  Divider,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
import PersonIcon from "@mui/icons-material/Person";

import { colors } from "../theme/colors";
import { apiService } from "../services/api";

const QUICK_PROMPTS = [
  "What happened in the last hour?",
  "Which device is under the highest risk?",
  "Why is this incident critical?",
  "What action should the SOC analyst take?",
  "Summarize active industrial incidents",
  "Show repeated attacks against PLC-02",
];

export default function AiCopilot() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "### 🛡️ AEGIS-IIOT AI SOC Copilot Initialized\n\nI am connected to your live industrial network telemetry, ML classification engine, and incident database.\n\nAsk me any question regarding active incursions, asset risks, root causes, or recommended mitigation playbooks.",
      timestamp: "System Online",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchInsights = async () => {
    try {
      const data = await apiService.getAiInsights();
      setInsights(data);
    } catch (err) {
      console.warn("Fetch insights error:", err);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const response = await apiService.queryAiCopilot(textToSend, "SECURITY_ANALYST");
      const aiMsg = {
        sender: "ai",
        text: response.answer || "No telemetry found matching your query.",
        timestamp: new Date().toLocaleTimeString(),
        actions: response.suggested_actions || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Unable to query AI telemetry engine. Please check backend connection.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
        <AutoAwesomeIcon sx={{ color: colors.accent.primary, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
            AI SOC Security Copilot & Threat Insights
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Real-time assistant grounded in live SQLite database events, ML feature attributions, and industrial asset topology.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Left: Chat Window */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "72vh",
              bgcolor: colors.background.paper,
              border: `1px solid ${colors.border.subtle}`,
              borderRadius: 2.5,
              overflow: "hidden",
            }}
          >
            {/* Messages Area */}
            <Box sx={{ flex: 1, p: 2.5, overflowY: "auto" }}>
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: 2.5,
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: msg.sender === "user" ? colors.accent.secondary : "rgba(0, 229, 168, 0.15)",
                      border: `1px solid ${msg.sender === "user" ? colors.accent.secondary : colors.accent.primary}`,
                    }}
                  >
                    {msg.sender === "user" ? (
                      <PersonIcon sx={{ fontSize: 18, color: "#000" }} />
                    ) : (
                      <AutoAwesomeIcon sx={{ fontSize: 18, color: colors.accent.primary }} />
                    )}
                  </Avatar>

                  <Box sx={{ maxWidth: "80%" }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: msg.sender === "user" ? "rgba(30, 41, 59, 0.8)" : "rgba(15, 23, 42, 0.8)",
                        border: `1px solid ${msg.sender === "user" ? colors.border.subtle : "rgba(0, 229, 168, 0.2)"}`,
                      }}
                    >
                      <Typography
                        sx={{
                          color: colors.text.primary,
                          fontSize: "0.85rem",
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "0.68rem", color: colors.text.muted, mt: 0.5, px: 0.5 }}>
                      {msg.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 2 }}>
                  <CircularProgress size={20} sx={{ color: colors.accent.primary }} />
                  <Typography sx={{ color: colors.text.muted, fontSize: "0.8rem" }}>
                    Analyzing live database telemetry & ML attributions...
                  </Typography>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Prompt Chips */}
            <Box sx={{ p: 1.5, bgcolor: "rgba(15, 23, 42, 0.9)", borderTop: `1px solid ${colors.border.muted}` }}>
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                {QUICK_PROMPTS.map((prompt, i) => (
                  <Chip
                    key={i}
                    label={prompt}
                    size="small"
                    onClick={() => handleSend(prompt)}
                    sx={{
                      fontSize: "0.72rem",
                      bgcolor: "rgba(30, 41, 59, 0.6)",
                      color: colors.text.secondary,
                      border: `1px solid ${colors.border.muted}`,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(0, 229, 168, 0.15)",
                        color: colors.accent.primary,
                        borderColor: colors.accent.primary,
                      },
                    }}
                  />
                ))}
              </Stack>

              {/* Input Field */}
              <Stack direction="row" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask SOC Copilot a security question..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(15, 23, 42, 0.8)",
                      color: colors.text.primary,
                      fontSize: "0.85rem",
                      "& fieldset": { borderColor: colors.border.muted },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  disabled={!inputQuery.trim() || loading}
                  onClick={() => handleSend()}
                  sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800 }}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Right: AI Trend Insights */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              p: 2.5,
              bgcolor: colors.background.paper,
              border: `1px solid ${colors.border.subtle}`,
              borderRadius: 2.5,
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <TrendingUpIcon sx={{ color: colors.accent.primary }} />
              <Typography sx={{ color: colors.text.primary, fontWeight: 800, fontSize: "1rem" }}>
                AI Telemetry Insights
              </Typography>
            </Stack>

            <Typography sx={{ color: colors.text.secondary, fontSize: "0.8rem", mb: 2.5, lineHeight: 1.5 }}>
              {insights?.trend_summary || "Computing historical incursion patterns across industrial subnets..."}
            </Typography>

            <Divider sx={{ borderColor: colors.border.muted, mb: 2 }} />

            <Stack spacing={2}>
              {(insights?.key_insights || []).map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(15, 23, 42, 0.6)",
                    borderRadius: 2,
                    border: `1px solid ${colors.border.muted}`,
                  }}
                >
                  <Typography sx={{ color: colors.accent.primary, fontWeight: 700, fontSize: "0.85rem", mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: colors.text.secondary, fontSize: "0.78rem", mb: 1, lineHeight: 1.4 }}>
                    {item.description}
                  </Typography>
                  <Typography sx={{ color: colors.text.muted, fontSize: "0.72rem" }}>
                    <b>Action:</b> <font color="#8AFF80">{item.recommendation}</font>
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
