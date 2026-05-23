import { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card, Btn } from "../components/common/PageLayout";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon, FiBell, FiShield, FiUser } from "react-icons/fi";
import api from "../services/api";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "var(--accent)" : "var(--surface-strong)",
        border: "1px solid var(--border)",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: checked ? "#070b14" : "var(--text-muted)",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

function SettingRow({ label, desc, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>
          {label}
        </div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const DEFAULT_SETTINGS = {
  notifs: { email: true, push: false, marketing: false, security: true },
  account: { twoFactor: false, publicProfile: true, dataSharing: false },
};

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, saveUser } = useAuth();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  useEffect(() => {
    api
      .get("/settings/")
      .then((res) => {
        setSettings({
          notifs: res.data.notifs || DEFAULT_SETTINGS.notifs,
          account: res.data.account || DEFAULT_SETTINGS.account,
        });
      })
      .catch((e) => {
        console.error("Settings load failed", e);
      });
  }, []);

  function updateSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);

    api.put("/settings/", next).catch((e) => {
      console.error("Settings save failed", e);
    });
  }

  async function handleSaveAccount() {
    if (!form.name.trim()) return;
    try {
      await saveUser({ name: form.name.trim(), email: form.email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Account save failed", e);
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your preferences and account configuration." />

      {saved && (
        <div
          style={{
            background: "rgba(110,231,183,0.12)",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            color: "var(--accent)",
            fontSize: 13,
          }}
        >
          ✓ Settings saved successfully.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Appearance" action={<FiSun style={{ color: "var(--text-muted)" }} />}>
          <div style={{ display: "flex", gap: 12 }}>
            {["dark", "light"].map((t) => (
              <button
                key={t}
                onClick={theme !== t ? toggleTheme : undefined}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: "var(--radius-sm)",
                  border: `2px solid ${theme === t ? "var(--accent)" : "var(--border)"}`,
                  background: theme === t ? "rgba(110,231,183,0.08)" : "var(--bg-surface-2)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {t === "dark" ? (
                  <FiMoon style={{ fontSize: 22, color: theme === "dark" ? "var(--accent)" : "var(--text-muted)" }} />
                ) : (
                  <FiSun style={{ fontSize: 22, color: theme === "light" ? "var(--accent)" : "var(--text-muted)" }} />
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t === "dark" ? "Dark Mode" : "Light Mode"}</span>
                {theme === t && <span style={{ fontSize: 11, color: "var(--accent)" }}>Active</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Notifications" action={<FiBell style={{ color: "var(--text-muted)" }} />}>
          <SettingRow
            label="Email Notifications"
            desc="Receive updates via email"
            checked={settings.notifs.email}
            onChange={(v) => updateSettings({ notifs: { ...settings.notifs, email: v } })}
          />
          <SettingRow
            label="Push Notifications"
            desc="Browser push notifications"
            checked={settings.notifs.push}
            onChange={(v) => updateSettings({ notifs: { ...settings.notifs, push: v } })}
          />
          <SettingRow
            label="Marketing Emails"
            desc="Product news and tips"
            checked={settings.notifs.marketing}
            onChange={(v) => updateSettings({ notifs: { ...settings.notifs, marketing: v } })}
          />
          <SettingRow
            label="Security Alerts"
            desc="Unusual activity alerts"
            checked={settings.notifs.security}
            onChange={(v) => updateSettings({ notifs: { ...settings.notifs, security: v } })}
          />
        </Card>

        <Card title="Account" action={<FiUser style={{ color: "var(--text-muted)" }} />}>
          <div style={{ marginBottom: 16 }}>
            <div className="form-field">
              <label className="form-label">Display Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>
          <Btn onClick={handleSaveAccount}>Save Changes</Btn>
        </Card>

        <Card title="Security" action={<FiShield style={{ color: "var(--text-muted)" }} />}>
          <SettingRow
            label="Two-Factor Authentication"
            desc="Add extra layer of security"
            checked={settings.account.twoFactor}
            onChange={(v) => updateSettings({ account: { ...settings.account, twoFactor: v } })}
          />
          <SettingRow
            label="Public Profile"
            desc="Make your profile visible to others"
            checked={settings.account.publicProfile}
            onChange={(v) => updateSettings({ account: { ...settings.account, publicProfile: v } })}
          />
          <SettingRow
            label="Usage Data Sharing"
            desc="Help improve Nexus"
            checked={settings.account.dataSharing}
            onChange={(v) => updateSettings({ account: { ...settings.account, dataSharing: v } })}
          />
        </Card>
      </div>
    </div>
  );
}

