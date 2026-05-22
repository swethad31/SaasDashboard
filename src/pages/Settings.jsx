import { useState, useContext } from "react";
import { PageHeader, Card, Btn } from "../components/common/PageLayout";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon, FiBell, FiShield, FiUser } from "react-icons/fi";
import "../styles/settings.css";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? "var(--accent)" : "var(--surface-strong)",
        border: "1px solid var(--border)",
        position: "relative", transition: "background 0.2s", flexShrink: 0
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 22 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: checked ? "#070b14" : "var(--text-muted)",
        transition: "left 0.2s"
      }} />
    </button>
  );
}

function SettingRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [notifs, setNotifs] = useState({ email: true, push: false, marketing: false, security: true });
  const [account, setAccount] = useState({ twoFactor: false, publicProfile: true, dataSharing: false });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your preferences and account configuration." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Theme */}
        <Card title="Appearance" action={<FiSun style={{ color: "var(--text-muted)" }} />}>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={theme === "dark" ? undefined : toggleTheme}
              style={{ flex: 1, padding: "16px", borderRadius: "var(--radius-sm)", border: `2px solid ${theme === "dark" ? "var(--accent)" : "var(--border)"}`, background: theme === "dark" ? "rgba(110,231,183,0.08)" : "var(--bg-surface-2)", cursor: "pointer", transition: "all 0.2s" }}
            >
              <FiMoon style={{ fontSize: 24, color: theme === "dark" ? "var(--accent)" : "var(--text-muted)", marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Dark Mode</div>
            </button>
            <button
              onClick={theme === "light" ? undefined : toggleTheme}
              style={{ flex: 1, padding: "16px", borderRadius: "var(--radius-sm)", border: `2px solid ${theme === "light" ? "var(--accent)" : "var(--border)"}`, background: theme === "light" ? "rgba(5,150,105,0.08)" : "var(--bg-surface-2)", cursor: "pointer", transition: "all 0.2s" }}
            >
              <FiSun style={{ fontSize: 24, color: theme === "light" ? "var(--accent)" : "var(--text-muted)", marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Light Mode</div>
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications" action={<FiBell style={{ color: "var(--text-muted)" }} />}>
          <SettingRow label="Email Notifications" desc="Receive updates via email" checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
          <SettingRow label="Push Notifications" desc="Browser push notifications" checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
          <SettingRow label="Marketing Emails" desc="Product news and tips" checked={notifs.marketing} onChange={v => setNotifs(n => ({ ...n, marketing: v }))} />
          <SettingRow label="Security Alerts" desc="Unusual activity alerts" checked={notifs.security} onChange={v => setNotifs(n => ({ ...n, security: v }))} />
        </Card>

        {/* Account */}
        <Card title="Account" action={<FiUser style={{ color: "var(--text-muted)" }} />}>
          <div style={{ marginBottom: 16 }}>
            <div className="form-field"><label className="form-label">Display Name</label><input className="form-input" defaultValue="Admin User" /></div>
            <div className="form-field"><label className="form-label">Email</label><input className="form-input" defaultValue="admin@nexus.app" /></div>
            <div className="form-field"><label className="form-label">Language</label>
              <select className="form-select"><option>English (US)</option><option>French</option><option>Spanish</option></select>
            </div>
          </div>
          <Btn>Save Changes</Btn>
        </Card>

        {/* Security */}
        <Card title="Security" action={<FiShield style={{ color: "var(--text-muted)" }} />}>
          <SettingRow label="Two-Factor Authentication" desc="Add extra layer of security" checked={account.twoFactor} onChange={v => setAccount(a => ({ ...a, twoFactor: v }))} />
          <SettingRow label="Public Profile" desc="Make your profile visible to others" checked={account.publicProfile} onChange={v => setAccount(a => ({ ...a, publicProfile: v }))} />
          <SettingRow label="Usage Data Sharing" desc="Help improve Nexus" checked={account.dataSharing} onChange={v => setAccount(a => ({ ...a, dataSharing: v }))} />
          <div style={{ marginTop: 16 }}>
            <Btn variant="danger">Change Password</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
