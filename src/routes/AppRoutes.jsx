import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import Revenue from "../pages/Revenue";
import Content from "../pages/Content";
import Performance from "../pages/Performance";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Login from "../pages/Login";

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={<Guard><Dashboard /></Guard>} />
      <Route path="/analytics" element={<Guard><Analytics /></Guard>} />
      <Route path="/users" element={<Guard><Users /></Guard>} />
      <Route path="/reports" element={<Guard><Reports /></Guard>} />
      <Route path="/revenue" element={<Guard><Revenue /></Guard>} />
      <Route path="/content" element={<Guard><Content /></Guard>} />
      <Route path="/performance" element={<Guard><Performance /></Guard>} />
      <Route path="/settings" element={<Guard><Settings /></Guard>} />
      <Route path="/profile" element={<Guard><Profile /></Guard>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

