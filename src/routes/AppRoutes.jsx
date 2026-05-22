import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import Revenue from "../pages/Revenue";
import Content from "../pages/Content";
import Performance from "../pages/Performance";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/users" element={<Users />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/content" element={<Content />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
