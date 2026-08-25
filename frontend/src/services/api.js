import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

export const API_URL =
  import.meta.env.VITE_API_URL || "";


// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aegis_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


// ==========================================
// API SERVICE
// ==========================================

export const apiService = {

  // ========================================
  // ========================================
  // DASHBOARD (UNIFIED PHASE 1 CONTRACT)
  // ========================================

  getDashboardLive: async () => {
    try {
      const response = await api.get("/api/dashboard/live");
      return response.data;
    } catch {
      // Graceful fallback to reports summary if needed
      const response = await api.get("/api/reports/summary");
      const data = response.data;
      return {
        summary: {
          total_alerts: Number(data.total_alerts || 0),
          critical_alerts: Number(data.critical_alerts || 0),
          high_alerts: Number(data.high_alerts || 0),
          average_risk_score: Number(data.average_risk_score || 0),
          live_alert_count: Number(data.live_alert_count || 0),
          last_updated: data.last_updated || null,
        },
        threat_level: data.threat_level || null,
        recent_alerts: Array.isArray(data.recent_alerts) ? data.recent_alerts : [],
        attack_distribution: data.attack_distribution || {},
        severity_distribution: data.severity_distribution || {},
        traffic_chart: data.traffic_chart || [],
        incidents: Array.isArray(data.recent_alerts) ? data.recent_alerts : [],
      };
    }
  },

  getDashboard: async () => {
    return apiService.getDashboardLive();
  },

  // ========================================
  // SYSTEM & THREAT INTELLIGENCE
  // ========================================

  getSystemStatus: async () => {
    const response = await api.get("/api/system/status");
    return response.data;
  },

  getThreatScore: async () => {
    const response = await api.get("/api/system/threat-score");
    return response.data;
  },


  // ========================================
  // LIVE MONITORING
  // ========================================

  getMonitoringLive: async () => {
    const response = await api.get("/api/monitoring/live");
    return response.data;
  },

  getMonitoringAlerts: async () => {
    const response = await api.get("/api/monitoring/alerts");
    return response.data;
  },


  // ========================================
  // INCIDENTS
  // ========================================

  getIncidents: async (params = {}) => {
    const response = await api.get("/api/incidents/", { params });
    return response.data;
  },

  getIncidentById: async (id) => {
    const response = await api.get(`/api/incidents/${id}`);
    return response.data;
  },

  updateIncident: async (id, data) => {
    const response = await api.patch(`/api/incidents/${id}`, data);
    return response.data;
  },

  getIncidentSummary: async () => {
    const response = await api.get("/api/incidents/summary");
    return response.data;
  },


  // ========================================
  // PREVENTION
  // ========================================

  getPrevention: async () => {
    const response = await api.get("/api/prevention/");
    return response.data;
  },

  blockIp: async (ip, reason = "Manual Policy Block") => {
    const response = await api.post("/api/prevention/rules/block", { ip, reason });
    return response.data;
  },

  unblockRule: async (ruleId) => {
    const response = await api.post(`/api/prevention/rules/unblock/${ruleId}`);
    return response.data;
  },


  // ========================================
  // ANALYTICS
  // ========================================

  getAnalyticsSummary: async () => {
    const response = await api.get("/api/analytics/summary");
    return response.data;
  },

  getAnalyticsSeverity: async () => {
    const response = await api.get("/api/analytics/severity");
    return response.data;
  },

  getAnalyticsAttacks: async () => {
    const response = await api.get("/api/analytics/attacks");
    return response.data;
  },

  getAnalyticsRisk: async () => {
    const response = await api.get("/api/analytics/risk");
    return response.data;
  },


  // ========================================
  // EXPLAINABILITY (SHAP)
  // ========================================

  getExplainabilitySummary: async () => {
    const response = await api.get("/api/explainability/summary");
    return response.data;
  },

  explainPrediction: async (formData) => {
    const response = await api.post("/api/explainability/explain", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },


  // ========================================
  // DETECTION UPLOAD
  // ========================================

  uploadDetectFile: async (formData) => {
    const response = await api.post("/api/detection/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },


  // ========================================
  // REPORTS & DOWNLOADS
  // ========================================

  getReportsSummary: async () => {
    const response = await api.get("/api/reports/summary");
    return response.data;
  },

  getReportDownloadUrl: () => `${API_URL}/api/reports/download`,

  getArchitectureDownloadUrl: () => `${API_URL}/api/architecture/download`,


  // ========================================
  // THREAT INTELLIGENCE
  // ========================================

  getThreatIntel: async () => {
    const response = await api.get("/api/reports/threat-intel");
    return response.data;
  },


  // ========================================
  // AUTHENTICATION & SECURITY
  // ========================================

  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("aegis_token");
      localStorage.removeItem("aegis_user");
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, new_password) => {
    const response = await api.post("/api/auth/reset-password", { token, new_password });
    return response.data;
  },

  changePassword: async (old_password, new_password) => {
    const response = await api.post("/api/auth/change-password", { old_password, new_password });
    return response.data;
  },

  getAuditLogs: async (params = {}) => {
    const response = await api.get("/api/auth/audit-logs", { params });
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/api/auth/users");
    return response.data;
  },


  // ========================================
  // HEALTH CHECK
  // ========================================

  getHealth: async () => {
    const response = await api.get("/api/health");
    return response.data;
  },
};

export default api;