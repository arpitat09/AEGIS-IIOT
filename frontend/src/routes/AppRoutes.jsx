import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Monitoring from "../pages/Monitoring";
import ThreatIntelligence from "../pages/ThreatIntelligence";
import Incidents from "../pages/Incidents";
import Prevention from "../pages/Prevention";
import Analytics from "../pages/Analytics";
import Reports from "../pages/Reports";
import Architecture from "../pages/Architecture";
import Settings from "../pages/Settings";
import AuditLogs from "../pages/AuditLogs";
import AiCopilot from "../pages/AiCopilot";
import AssetInventory from "../pages/AssetInventory";
import NotificationRules from "../pages/NotificationRules";
import Integrations from "../pages/Integrations";
import NotFound from "../pages/NotFound";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* SOC Platform Console */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/ai-copilot" element={<AiCopilot />} />
        <Route path="/assets" element={<AssetInventory />} />
        <Route path="/notification-rules" element={<NotificationRules />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/prevention" element={<Prevention />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
