import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiGrid, FiBarChart2, FiUsers, FiFileText, FiDollarSign,
  FiFilm, FiActivity, FiSettings, FiUser, FiLogOut,
  FiChevronLeft, FiChevronRight, FiX, FiZap
} from "react-icons/fi";
import "./SideBar.css";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", icon: <FiGrid />, label: "Dashboard" },
  { to: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
  { to: "/users", icon: <FiUsers />, label: "Users" },
  { to: "/reports", icon: <FiFileText />, label: "Reports" },
  { to: "/revenue", icon: <FiDollarSign />, label: "Revenue" },
  { to: "/content", icon: <FiFilm />, label: "Movies / Content" },
  { to: "/performance", icon: <FiActivity />, label: "Performance" },
];

const bottomItems = [
  { to: "/settings", icon: <FiSettings />, label: "Settings" },
  { to: "/profile", icon: <FiUser />, label: "Profile" },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);


  const cls = `sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`;

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}

      <aside className={cls}>
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">FF</div>
          <span className="sidebar__logo-text">ForceFabric</span>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Main</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `sidebar__link${isActive ? " sidebar__link--active" : ""}`}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar__divider" />
          <p className="sidebar__section-label">Account</p>

          {bottomItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link${isActive ? " sidebar__link--active" : ""}`}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </NavLink>
          ))}

          <button
            className="sidebar__link"
            style={{ width: "100%", textAlign: "left" }}
            onClick={() => setShowLogout(true)}
            title={collapsed ? "Logout" : undefined}
          >
            <span className="sidebar__icon"><FiLogOut /></span>
            <span className="sidebar__label">Logout</span>
          </button>
        </nav>

        {/* Collapse toggle */}
        <div className="sidebar__footer">
          <button className="sidebar__collapse-btn" onClick={onToggle} title={collapsed ? "Expand" : "Collapse"}>
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} onConfirm={() => { setShowLogout(false); logout(); }} />
      )}
    </>
  );
}

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-lg)", padding: "32px", maxWidth: 400, width: "90%",
        boxShadow: "var(--shadow-lg)", textAlign: "center"
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Sign out?</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 14 }}>
          You'll need to sign in again to access your dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: "var(--radius-sm)", background: "var(--surface-strong)",
            color: "var(--text)", fontSize: 14, fontWeight: 500, border: "1px solid var(--border)"
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "10px 24px", borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff", fontSize: 14, fontWeight: 600, border: "none"
          }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}
