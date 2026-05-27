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
        width: 44, height: 24, borderRadius: 12,
        background: checked ? "var(--accent)" : "var(--surface-strong)",
        border: "1px solid var(--border)", position: "relative",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 22 : 2,
        width: 18, height: 18, borderRadius: "50%",
        background: checked ? "#070b14" : "var(--text-muted)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

function SettingRow({ label, desc, checked, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid var(--border)",
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{label}</div>
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

const STORAGE_KEYS = {
  email: "emailNotifs",
  push: "pushNotifs",
  marketing: "marketingEmails",
  security: "securityAlerts",
  twoFactor: "twoFactor",
  publicProfile: "publicProfile",
  dataSharing: "dataSharing",
};

function readStoredBool(key, fallback) {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function writeStoredBool(key, value) {
  localStorage.setItem(key, value ? "true" : "false");
  window.dispatchEvent(new StorageEvent("storage", { key, newValue: value ? "true" : "false" }));
}

function readSettingsFromLocalStorage() {
  return {
    notifs: {
      email: readStoredBool(STORAGE_KEYS.email, DEFAULT_SETTINGS.notifs.email),
      push: readStoredBool(STORAGE_KEYS.push, DEFAULT_SETTINGS.notifs.push),
      marketing: readStoredBool(STORAGE_KEYS.marketing, DEFAULT_SETTINGS.notifs.marketing),
      security: readStoredBool(STORAGE_KEYS.security, DEFAULT_SETTINGS.notifs.security),
    },
    account: {
      twoFactor: readStoredBool(STORAGE_KEYS.twoFactor, DEFAULT_SETTINGS.account.twoFactor),
      publicProfile: readStoredBool(STORAGE_KEYS.publicProfile, DEFAULT_SETTINGS.account.publicProfile),
      dataSharing: readStoredBool(STORAGE_KEYS.dataSharing, DEFAULT_SETTINGS.account.dataSharing),
    },
  };
}

function persistSettingsToLocalStorage(next) {
  writeStoredBool(STORAGE_KEYS.email, next.notifs.email);
  writeStoredBool(STORAGE_KEYS.push, next.notifs.push);
  writeStoredBool(STORAGE_KEYS.marketing, next.notifs.marketing);
  writeStoredBool(STORAGE_KEYS.security, next.notifs.security);
  writeStoredBool(STORAGE_KEYS.twoFactor, next.account.twoFactor);
  writeStoredBool(STORAGE_KEYS.publicProfile, next.account.publicProfile);
  writeStoredBool(STORAGE_KEYS.dataSharing, next.account.dataSharing);
}

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, saveUser } = useAuth();

  const [settings, setSettings] = useState(() => readSettingsFromLocalStorage());
  const [form, setForm] = useState({ name: "", email: "" });
  const [savedMessage, setSavedMessage] = useState("");
  const [toasts, setToasts] = useState([]);
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [confirmDisable2FA, setConfirmDisable2FA] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  useEffect(() => {
    async function loadSettings() {
      const localSettings = readSettingsFromLocalStorage();
      try {
        const res = await api.get("/settings/");
        setSettings({
          notifs: { ...localSettings.notifs, ...(res.data?.notifs || {}) },
          account: { ...localSettings.account, ...(res.data?.account || {}) },
        });
      } catch (e) {
        setSettings(localSettings);
      }
    }

    loadSettings();
  }, []);

  function showToast(message, type = "success") {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function saveSettings(next) {
    setSettings(next);
    persistSettingsToLocalStorage(next);
    api.put("/settings/", next).catch(() => {});
  }

  function handleEmailNotifications(enabled) {
    const next = { ...settings, notifs: { ...settings.notifs, email: enabled } };
    saveSettings(next);
    showToast(enabled
      ? `Email notifications enabled. You'll receive updates at ${user?.email || form.email || "your email"}.`
      : "Email notifications disabled.");
  }

  async function handlePushNotifications(enabled) {
    if (!enabled) {
      const next = { ...settings, notifs: { ...settings.notifs, push: false } };
      saveSettings(next);
      showToast("Push notifications disabled.");
      return;
    }

    if (!("Notification" in window)) {
      showToast("Browser permission denied. Please allow notifications in your browser settings.", "warning");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const next = { ...settings, notifs: { ...settings.notifs, push: true } };
        saveSettings(next);
        showToast("Push notifications enabled.");
      } else {
        const next = { ...settings, notifs: { ...settings.notifs, push: false } };
        saveSettings(next);
        showToast("Browser permission denied. Please allow notifications in your browser settings.", "warning");
      }
    } catch (e) {
      const next = { ...settings, notifs: { ...settings.notifs, push: false } };
      saveSettings(next);
      showToast("Browser permission denied. Please allow notifications in your browser settings.", "warning");
    }
  }

  function handleMarketingEmails(enabled) {
    const next = { ...settings, notifs: { ...settings.notifs, marketing: enabled } };
    saveSettings(next);
    showToast(enabled ? "Marketing emails enabled." : "Marketing emails disabled.");
  }

  function handleSecurityAlerts(enabled) {
    const next = { ...settings, notifs: { ...settings.notifs, security: enabled } };
    saveSettings(next);
    showToast(enabled
      ? "Security alerts enabled. You'll be notified of unusual login activity."
      : "Security alerts disabled.");
  }

  function handleTwoFactorToggle(enabled) {
    if (enabled) {
      setTwoFactorCode("");
      setTwoFactorSetupOpen(true);
      return;
    }

    setConfirmDisable2FA(true);
  }

  function confirmTwoFactorSetup() {
    if (!/^\d{6}$/.test(twoFactorCode)) {
      showToast("Enter the 6-digit code from your authenticator app.", "warning");
      return;
    }

    const next = { ...settings, account: { ...settings.account, twoFactor: true } };
    saveSettings(next);
    setTwoFactorSetupOpen(false);
    setTwoFactorCode("");
    showToast("Two-factor authentication enabled.");
  }

  function disableTwoFactor() {
    const next = { ...settings, account: { ...settings.account, twoFactor: false } };
    saveSettings(next);
    setConfirmDisable2FA(false);
    showToast("Two-factor authentication disabled.");
  }

  function handlePublicProfile(enabled) {
    const next = { ...settings, account: { ...settings.account, publicProfile: enabled } };
    saveSettings(next);
    showToast(enabled ? "Profile is now public." : "Profile is now private.");
  }

  function handleDataSharing(enabled) {
    const next = { ...settings, account: { ...settings.account, dataSharing: enabled } };
    saveSettings(next);
    showToast(enabled ? "Usage data sharing enabled." : "Usage data sharing disabled.");
  }

  async function handleSaveAccount() {
    if (!form.name.trim()) return;
    try {
      await saveUser({ name: form.name.trim(), email: form.email.trim() });
      setSavedMessage("Settings saved successfully.");
      setTimeout(() => setSavedMessage(""), 2500);
    } catch (e) {
      console.error("Account save failed", e);
    }
  }

  function resetPasswordForm() {
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setPasswordError("");
    setPasswordLoading(false);
  }

  async function handleChangePassword() {
    setPasswordError("");

    if (passwordForm.new_password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (passwordForm.confirm_password !== passwordForm.new_password) {
      setPasswordError("Confirm password must match new password");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.post("/profile/change-password", {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      resetPasswordForm();
      setPasswordOpen(false);
      setSavedMessage("Password changed successfully.");
      setTimeout(() => setSavedMessage(""), 2500);
    } catch (e) {
      setPasswordError(e?.response?.data?.detail || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your preferences and account configuration." />

      {toasts.length > 0 && (
        <div style={{
          position: "fixed", top: 76, right: 20, zIndex: 1000,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                width: 330,
                background: "var(--bg-surface)",
                border: `1px solid ${toast.type === "warning" ? "rgba(245, 158, 11, 0.9)" : "var(--accent)"}`,
                borderRadius: 8,
                padding: "10px 14px",
                color: toast.type === "warning" ? "#f59e0b" : "var(--accent)",
                fontSize: 13,
                boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
              }}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}

      {savedMessage && (
        <div style={{
          background: "rgba(110,231,183,0.12)", border: "1px solid var(--accent)",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16,
          color: "var(--accent)", fontSize: 13,
        }}>
          {savedMessage}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Appearance" action={<FiSun style={{ color: "var(--text-muted)" }} />}>
          <div style={{ display: "flex", gap: 12 }}>
            {["dark", "light"].map((t) => (
              <button key={t} onClick={theme !== t ? toggleTheme : undefined}
                style={{
                  flex: 1, padding: 16, borderRadius: "var(--radius-sm)",
                  border: `2px solid ${theme === t ? "var(--accent)" : "var(--border)"}`,
                  background: theme === t ? "rgba(110,231,183,0.08)" : "var(--bg-surface-2)",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}
              >
                {t === "dark"
                  ? <FiMoon style={{ fontSize: 22, color: theme === "dark" ? "var(--accent)" : "var(--text-muted)" }} />
                  : <FiSun style={{ fontSize: 22, color: theme === "light" ? "var(--accent)" : "var(--text-muted)" }} />
                }
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t === "dark" ? "Dark Mode" : "Light Mode"}</span>
                {theme === t && <span style={{ fontSize: 11, color: "var(--accent)" }}>Active</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Notifications" action={<FiBell style={{ color: "var(--text-muted)" }} />}>
          <SettingRow label="Email Notifications" desc="Receive updates via email"
            checked={settings.notifs.email}
            onChange={handleEmailNotifications} />
          <SettingRow label="Push Notifications" desc="Browser push notifications"
            checked={settings.notifs.push}
            onChange={handlePushNotifications} />
          <SettingRow label="Marketing Emails" desc="Product news and tips"
            checked={settings.notifs.marketing}
            onChange={handleMarketingEmails} />
          <SettingRow label="Security Alerts" desc="Unusual activity alerts"
            checked={settings.notifs.security}
            onChange={handleSecurityAlerts} />
        </Card>

        <Card title="Account" action={<FiUser style={{ color: "var(--text-muted)" }} />}>
          <div style={{ marginBottom: 16 }}>
            <div className="form-field">
              <label className="form-label">Display Name</label>
              <input className="form-input" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <Btn onClick={handleSaveAccount}>Save Changes</Btn>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => {
                setPasswordOpen((open) => !open);
                setPasswordError("");
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--accent)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Change Password
            </button>
          </div>

          {passwordOpen && (
            <div style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--border)",
            }}>
              <div className="form-field">
                <label className="form-label">Current Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, old_password: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, new_password: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Confirm New Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirm_password: e.target.value }))}
                />
              </div>

              {passwordError && (
                <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>
                  {passwordError}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Btn onClick={handleChangePassword}>
                  {passwordLoading ? "Changing..." : "Update Password"}
                </Btn>
                <button
                  onClick={() => {
                    resetPasswordForm();
                    setPasswordOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "var(--text-muted)",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Card>

        <Card title="Security" action={<FiShield style={{ color: "var(--text-muted)" }} />}>
          <SettingRow label="Two-Factor Authentication" desc="Add extra layer of security"
            checked={settings.account.twoFactor}
            onChange={handleTwoFactorToggle} />

          {twoFactorSetupOpen && (
            <div style={{
              margin: "12px 0 6px", padding: 16, borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg-surface-2)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
                Set up authenticator app
              </div>
              <div style={{
                width: 126, height: 126, padding: 8, marginBottom: 12,
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3,
                background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8,
              }}>
                {Array.from({ length: 49 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: 2,
                      background: [0, 1, 2, 7, 14, 16, 18, 21, 24, 28, 30, 32, 34, 38, 40, 42, 43, 44, 46].includes(index)
                        ? "var(--accent)"
                        : "transparent",
                    }}
                  />
                ))}
              </div>
              <label className="form-label">Enter the 6-digit code from your authenticator app.</label>
              <input
                className="form-input"
                inputMode="numeric"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Btn onClick={confirmTwoFactorSetup}>Confirm</Btn>
                <button
                  onClick={() => {
                    setTwoFactorSetupOpen(false);
                    setTwoFactorCode("");
                  }}
                  style={{
                    padding: "9px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "var(--bg-surface)", color: "var(--text)", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {confirmDisable2FA && (
            <div style={{
              margin: "12px 0 6px", padding: 16, borderRadius: 8,
              border: "1px solid rgba(245, 158, 11, 0.65)", background: "rgba(245, 158, 11, 0.08)",
            }}>
              <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 12 }}>
                Are you sure you want to disable 2FA?
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={disableTwoFactor}
                  style={{
                    padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(245, 158, 11, 0.65)",
                    background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDisable2FA(false)}
                  style={{
                    padding: "9px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "var(--bg-surface)", color: "var(--text)", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <SettingRow label="Public Profile" desc="Make your profile visible to others"
            checked={settings.account.publicProfile}
            onChange={handlePublicProfile} />
          <SettingRow label="Usage Data Sharing" desc="Help improve ForceFabric"
            checked={settings.account.dataSharing}
            onChange={handleDataSharing} />
        </Card>
      </div>
    </div>
  );
}
