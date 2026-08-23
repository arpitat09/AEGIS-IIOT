import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Monitoring from "../pages/Monitoring";
import Analytics from "../pages/Analytics";
import Incidents from "../pages/Incidents";
import Reports from "../pages/Reports";
import Architecture from "../pages/Architecture";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      {/* Landing Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Dashboard */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;