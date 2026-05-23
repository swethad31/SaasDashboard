import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon, FiX, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const routeNames = {
  "/": "Dashboard", "/analytics": "Analytics", "/users": "Users",
  "/reports": "Reports", "/revenue": "Revenue", "/content": "Movies / Content",
  "/performance": "Performance", "/settings": "Settings", "/profile": "Profile",
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Analytics updated", desc: "Netflix dataset refreshed with latest data.", time: "2 min ago", read: false },
  { id: 2, title: "New user registered", desc: "A new admin account was created.", time: "1 hr ago", read: false },
  { id: 3, title: "Report generated", desc: "Monthly content report is ready.", time: "3 hrs ago", read: true },
  { id: 4, title: "Settings saved", desc: "Your preferences were updated.", time: "Yesterday", read: true },
];

const SETTINGS_NOTIFICATION_KEYS = ["emailNotifs", "pushNotifs", "securityAlerts"];

function isEnabled(key) {
  return localStorage.getItem(key) === "true";
}

function buildNotifications() {
  const settingsNotifications = [];

  if (isEnabled("emailNotifs")) {
    settingsNotifications.push({
      id: "settings-email",
      title: "Email Notifications",
      desc: "You are subscribed to email updates.",
      time: "Active",
      read: false,
    });
  }

  if (isEnabled("securityAlerts")) {
    settingsNotifications.push({
      id: "settings-security",
      title: "Security Alerts Active",
      desc: "You'll be alerted on new IP logins.",
      time: "Active",
      read: false,
    });
  }

  if (isEnabled("pushNotifs")) {
    settingsNotifications.push({
      id: "settings-push",
      title: "Push Notifications",
      desc: "Browser push is enabled.",
      time: "Active",
      read: false,
    });
  }

  return [...MOCK_NOTIFICATIONS, ...settingsNotifications];
}

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = routeNames[location.pathname] || "Dashboard";

  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => buildNotifications());
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function syncSettingsNotifications(e) {
      if (e.key && !SETTINGS_NOTIFICATION_KEYS.includes(e.key)) return;
      setNotifications(buildNotifications());
    }

    window.addEventListener("storage", syncSettingsNotifications);
    return () => window.removeEventListener("storage", syncSettingsNotifications);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function markRead(id) {
    setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
  }

  const pages = [
    { label: "Dashboard", path: "/" },
    { label: "Analytics", path: "/analytics" },
    { label: "Users", path: "/users" },
    { label: "Reports", path: "/reports" },
    { label: "Revenue", path: "/revenue" },
    { label: "Movies / Content", path: "/content" },
    { label: "Performance", path: "/performance" },
    { label: "Settings", path: "/settings" },
    { label: "Profile", path: "/profile" },
  ];

  const searchResults =
    searchQuery.trim().length > 0
      ? pages.filter((p) => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className="navbar__breadcrumb">
          Nexus <span>&gt;</span> <strong>{pageName}</strong>
        </div>
      </div>

      <div className="navbar__right">
        {/* Search */}
        <div ref={searchRef} style={{ position: "relative" }}>
          <button
            className="navbar__icon-btn"
            onClick={() => {
              setSearchOpen((o) => !o);
              setAvatarOpen(false);
              setNotifOpen(false);
            }}
          >
            <FiSearch />
          </button>
          {searchOpen && (
            <div className="navbar__dropdown" style={{ width: 280, right: 0 }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages..."
                  style={{
                    width: "100%",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "7px 10px",
                    fontSize: 13,
                    color: "var(--text)",
                    outline: "none",
                  }}
                />
              </div>

              {searchResults.length > 0 ? (
                searchResults.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => {
                      navigate(r.path);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-strong)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {r.label}
                  </button>
                ))
              ) : searchQuery ? (
                <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-muted)" }}>No pages found.</div>
              ) : (
                pages.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => {
                      navigate(r.path);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 14px",
                      fontSize: 13,
                      color: "var(--text)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-strong)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {r.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className="navbar__icon-btn"
            onClick={() => {
              setNotifOpen((o) => !o);
              setAvatarOpen(false);
              setSearchOpen(false);
            }}
          >
            <FiBell />
            {unreadCount > 0 && <span className="navbar__badge" />}
          </button>

          {notifOpen && (
            <div className="navbar__dropdown" style={{ width: 320, right: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: 11, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      style={{ fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                  >
                    <FiX size={15} />
                  </button>
                </div>
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background: n.read ? "transparent" : "rgba(110,231,183,0.05)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-strong)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(110,231,183,0.05)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{n.title}</span>
                    {!n.read && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{n.desc}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{n.time}</div>
                </div>
              ))}

              {notifications.length === 0 ? (
                <div style={{ padding: "16px", fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>No notifications.</div>
              ) : notifications.every((n) => n.read) && (
                <div style={{ padding: "16px", fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>All caught up!</div>
              )}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button className="navbar__theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        {/* Avatar dropdown */}
        <div ref={avatarRef} style={{ position: "relative" }}>
          <div
            className="navbar__avatar"
            onClick={() => {
              setAvatarOpen((o) => !o);
              setNotifOpen(false);
              setSearchOpen(false);
            }}
          >
            {user?.avatar || user?.name?.[0]?.toUpperCase() || "A"}
          </div>

          {avatarOpen && (
            <div className="navbar__dropdown" style={{ width: 200, right: 0 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
              </div>

              {[
                { icon: <FiUser size={14} />, label: "Profile", path: "/profile" },
                { icon: <FiSettings size={14} />, label: "Settings", path: "/settings" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setAvatarOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "var(--text)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-strong)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  {item.icon} {item.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid var(--border)", marginTop: 4 }}>
                <button
                  onClick={() => {
                    setAvatarOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    fontSize: 13,
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-strong)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <FiLogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
