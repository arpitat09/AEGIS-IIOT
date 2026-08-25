import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

import PublicIcon from "@mui/icons-material/Public";
import ShieldIcon from "@mui/icons-material/Shield";

import { apiService } from "../services/api";
import { colors } from "../theme/colors";
import SeverityBadge from "../components/common/SeverityBadge";
import EmptyState from "../components/common/EmptyState";

export default function ThreatIntelligence() {
  const [intelData, setIntelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIntel = async () => {
    try {
      setLoading(true);
      const data = await apiService.getThreatIntel();
      setIntelData(data);
    } catch (err) {
      console.warn("Failed to fetch threat intel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  const topSources = intelData?.top_threat_sources || [];
  const topTargets = intelData?.most_targeted_assets || [];
  const totalAnalyzed = intelData?.total_analyzed_events || 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, width: "100%" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <PublicIcon sx={{ color: colors.accent.primary, fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Threat Intelligence Feed
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
            Automated cyber threat telemetry, adversary profile aggregation & asset vulnerability ranking
          </Typography>
        </Box>

        <Chip
          icon={<ShieldIcon sx={{ fontSize: "14px !important", color: `${colors.status.safe} !important` }} />}
          label={`Analyzed ${totalAnalyzed.toLocaleString()} Global Events`}
          sx={{
            bgcolor: colors.status.safeBg,
            color: colors.status.safe,
            border: `1px solid ${colors.status.safeBorder}`,
            fontWeight: 800,
            fontSize: "0.75rem",
          }}
        />
      </Box>

      {/* Intelligence Metric Cards (4 cards full width) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          width: "100%",
        }}
      >
        <Card elevation={0} sx={{ bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 2.2 }}>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, letterSpacing: "0.05em" }}>
              IDENTIFIED ADVERSARY HOSTS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.status.critical, my: 0.5 }}>
              {topSources.length > 0 ? topSources.length : "--"}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Actively generating malicious flows
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 2.2 }}>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, letterSpacing: "0.05em" }}>
              HIGH-EXPOSURE TARGETS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.status.highRisk, my: 0.5 }}>
              {topTargets.length > 0 ? topTargets.length : "--"}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Industrial IIoT nodes under attack
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 2.2 }}>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, letterSpacing: "0.05em" }}>
              PRIMARY INTRUSION VECTOR
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.accent.primary, my: 0.5 }}>
              Probe / Recon
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Port scanning & credential probing
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 2.2 }}>
            <Typography variant="caption" sx={{ color: colors.text.muted, fontWeight: 700, letterSpacing: "0.05em" }}>
              THREAT MITIGATION RATE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.status.safe, my: 0.5 }}>
              98.8%
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Automated containment active
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tables Row: Top Threat Sources & Most Targeted Assets */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "7fr 5fr",
          },
          gap: 2.5,
          width: "100%",
        }}
      >
        {/* Top Threat Sources Table */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}` }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Top Adversary Threat Sources
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Most active malicious IP addresses ranked by incident volume
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: colors.accent.primary }} />
            </Box>
          ) : topSources.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Source IP</TableCell>
                    <TableCell>Total Incursions</TableCell>
                    <TableCell>Primary Vector</TableCell>
                    <TableCell>Avg Risk</TableCell>
                    <TableCell>Peak Severity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSources.map((src) => (
                    <TableRow key={src.source_ip} hover>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: colors.text.primary }}>
                        {src.source_ip}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: colors.status.critical }}>
                        {src.threat_count.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: colors.accent.primary, fontWeight: 600 }}>
                        {src.primary_attack}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", color: colors.status.warning, fontWeight: 700 }}>
                        {src.avg_risk}%
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={src.max_severity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState title="NO THREAT SOURCES RECORDED" description="Waiting for live telemetry ingestion." />
          )}
        </Paper>

        {/* Most Targeted Assets */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: colors.background.card, border: `1px solid ${colors.border.muted}` }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text.primary }}>
              Most Targeted Assets
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Industrial nodes experiencing repeated attack attempts
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={32} sx={{ color: colors.accent.primary }} />
            </Box>
          ) : topTargets.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Target Asset IP</TableCell>
                    <TableCell>Incursions</TableCell>
                    <TableCell>Exposure State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topTargets.map((tgt) => (
                    <TableRow key={tgt.destination_ip} hover>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, color: colors.text.primary }}>
                        {tgt.destination_ip}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: colors.text.primary }}>
                        {tgt.incident_count.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tgt.status}
                          size="small"
                          sx={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: tgt.status === "High Exposure" ? colors.status.highRisk : colors.status.safe,
                            bgcolor: tgt.status === "High Exposure" ? colors.status.highRiskBg : colors.status.safeBg,
                            border: `1px solid ${tgt.status === "High Exposure" ? colors.status.highRiskBorder : colors.status.safeBorder}`,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState title="NO TARGET DATA" description="Waiting for live telemetry ingestion." />
          )}
        </Paper>
      </Box>
    </Box>
  );
}
