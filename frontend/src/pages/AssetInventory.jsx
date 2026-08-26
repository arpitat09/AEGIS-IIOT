import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";

import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShieldIcon from "@mui/icons-material/Shield";
import BlockIcon from "@mui/icons-material/Block";

import { colors } from "../theme/colors";
import { apiService } from "../services/api";

export default function AssetInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    asset_type: "PLC",
    location: "Plant Floor Bay 1",
    criticality: "CRITICAL",
    owner_team: "OT Operations & Robotics",
    operational_status: "ONLINE",
    network_zone: "Zone 2 - SCADA Control",
  });

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAssets();
      setAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreate = async () => {
    try {
      const newAsset = await apiService.createAsset(formData);
      setAssets((prev) => [...prev, newAsset]);
      setOpenCreate(false);
      setFormData({
        name: "",
        ip_address: "",
        asset_type: "PLC",
        location: "Plant Floor Bay 1",
        criticality: "CRITICAL",
        owner_team: "OT Operations & Robotics",
        operational_status: "ONLINE",
        network_zone: "Zone 2 - SCADA Control",
      });
    } catch (err) {
      console.warn("Create asset error:", err);
    }
  };

  const handleStatusUpdate = async (asset, newStatus) => {
    try {
      const updated = await apiService.updateAsset(asset.id, {
        operational_status: newStatus,
      });
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? updated : a)));
    } catch (err) {
      console.warn("Update asset status error:", err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text.primary }}>
            Industrial IoT Asset Inventory & Zone Registry
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Manage critical PLCs, RTUs, SCADA gateways, sensor arrays, and track asset-aware threat exposure.
          </Typography>
        </Box>

        <Stack direction="row" gap={1.5}>
          <Button
            variant="outlined"
            onClick={fetchAssets}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: colors.border.subtle,
              color: colors.text.primary,
              fontSize: "0.8rem",
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800, fontSize: "0.8rem" }}
          >
            Register Asset
          </Button>
        </Stack>
      </Stack>

      {/* Top Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Monitored Assets", val: assets.length, color: colors.text.primary },
          { label: "Critical PLCs & SCADA", val: assets.filter((a) => a.criticality === "CRITICAL").length, color: colors.accent.error },
          { label: "Online & Protected", val: assets.filter((a) => a.operational_status === "ONLINE").length, color: colors.accent.primary },
          { label: "Isolated Nodes", val: assets.filter((a) => a.operational_status === "ISOLATED").length, color: colors.accent.warning },
        ].map((m, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card sx={{ p: 2, bgcolor: colors.background.paper, border: `1px solid ${colors.border.subtle}`, borderRadius: 2 }}>
              <Typography sx={{ color: colors.text.muted, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>
                {m.label}
              </Typography>
              <Typography sx={{ color: m.color, fontSize: "1.8rem", fontWeight: 900, mt: 0.5 }}>
                {m.val}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assets Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: colors.accent.primary }} />
        </Box>
      ) : (
        <Card sx={{ bgcolor: colors.background.paper, border: `1px solid ${colors.border.subtle}`, borderRadius: 2, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "rgba(15, 23, 42, 0.8)" }}>
                <TableRow>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>ASSET NAME</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>IP ADDRESS</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>TYPE</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>NETWORK ZONE</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>CRITICALITY</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>STATUS</TableCell>
                  <TableCell sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>THREATS</TableCell>
                  <TableCell align="right" sx={{ color: colors.text.muted, fontWeight: 700, fontSize: "0.75rem" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => {
                  const isCrit = asset.criticality === "CRITICAL";
                  const isHigh = asset.criticality === "HIGH";

                  return (
                    <TableRow
                      key={asset.id}
                      sx={{
                        "&:hover": { bgcolor: "rgba(30, 41, 59, 0.4)" },
                        borderBottom: `1px solid ${colors.border.muted}`,
                      }}
                    >
                      <TableCell sx={{ color: colors.text.primary, fontWeight: 700, fontSize: "0.85rem" }}>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <PrecisionManufacturingIcon sx={{ fontSize: 18, color: colors.accent.primary }} />
                          {asset.name}
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ color: colors.text.secondary, fontSize: "0.82rem", fontFamily: "monospace" }}>
                        {asset.ip_address}
                      </TableCell>

                      <TableCell sx={{ color: colors.text.secondary, fontSize: "0.82rem" }}>
                        {asset.asset_type}
                      </TableCell>

                      <TableCell sx={{ color: colors.text.secondary, fontSize: "0.82rem" }}>
                        {asset.network_zone}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={asset.criticality}
                          size="small"
                          sx={{
                            bgcolor: isCrit
                              ? "rgba(220, 38, 38, 0.2)"
                              : isHigh
                              ? "rgba(245, 158, 11, 0.15)"
                              : "rgba(59, 130, 246, 0.15)",
                            color: isCrit
                              ? colors.accent.error
                              : isHigh
                              ? colors.accent.warning
                              : colors.accent.info,
                            fontWeight: 800,
                            fontSize: "0.68rem",
                            height: 20,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={asset.operational_status}
                          size="small"
                          sx={{
                            bgcolor:
                              asset.operational_status === "ONLINE"
                                ? "rgba(0, 229, 168, 0.15)"
                                : "rgba(220, 38, 38, 0.15)",
                            color:
                              asset.operational_status === "ONLINE"
                                ? colors.accent.primary
                                : colors.accent.error,
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            height: 20,
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: asset.threat_count > 0 ? colors.accent.warning : colors.text.muted, fontWeight: 700, fontSize: "0.82rem" }}>
                        {asset.threat_count || 0}
                      </TableCell>

                      <TableCell align="right">
                        {asset.operational_status === "ONLINE" ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleStatusUpdate(asset, "ISOLATED")}
                            startIcon={<BlockIcon sx={{ fontSize: 13 }} />}
                            sx={{ fontSize: "0.7rem", py: 0.2 }}
                          >
                            Isolate
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleStatusUpdate(asset, "ONLINE")}
                            startIcon={<CheckCircleIcon sx={{ fontSize: 13 }} />}
                            sx={{ fontSize: "0.7rem", py: 0.2 }}
                          >
                            Restore
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Register Asset Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: colors.background.paper,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: colors.text.primary }}>
          Register Industrial IoT Asset
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Asset Name"
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Turbine PLC Gateway 01"
            />
            <TextField
              label="IP Address"
              fullWidth
              size="small"
              value={formData.ip_address}
              onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              placeholder="e.g. 192.168.1.50"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Asset Type"
                  fullWidth
                  size="small"
                  value={formData.asset_type}
                  onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                >
                  {["PLC", "RTU", "HMI", "SCADA Server", "Industrial Gateway", "Sensor", "Edge Device"].map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Criticality"
                  fullWidth
                  size="small"
                  value={formData.criticality}
                  onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                >
                  {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              label="Location"
              fullWidth
              size="small"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              label="Network Zone"
              fullWidth
              size="small"
              value={formData.network_zone}
              onChange={(e) => setFormData({ ...formData, network_zone: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: colors.text.muted }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.name || !formData.ip_address}
            sx={{ bgcolor: colors.accent.primary, color: "#000", fontWeight: 800 }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
