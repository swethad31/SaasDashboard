import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card, Badge, Btn } from "../components/common/PageLayout";
import api from "../services/api";

function Toast({ msg, error }) {
  if (!msg) return null;
  return (
    <div
      style={{
        background: error ? "rgba(239,68,68,0.1)" : "rgba(110,231,183,0.12)",
        border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "var(--accent)"}`,
        borderRadius: 8,
        padding: "10px 16px",
        marginBottom: 16,
        color: error ? "#ef4444" : "var(--accent)",
        fontSize: 13,
      }}
    >
      {error ? "✗" : "✓"} {msg}
    </div>
  );
}

export default function Profile() {
  const { user, saveUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    role: "Administrator",
    plan: "Enterprise",
  });

  const [profileToast, setProfileToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [pwToast, setPwToast] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      role: user.role || "Administrator",
      plan: user.plan || "Enterprise",
    });
  }, [user]);

  function f(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  function startEdit() {
    setEditing(true);
    setProfileToast(null);
  }

  function cancelEdit() {
    setEditing(false);
    setProfileToast(null);
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        role: user.role || "Administrator",
        plan: user.plan || "Enterprise",
      });
    }
  }

  async function handleSaveProfile() {
    if (!form.name?.trim()) {
      setProfileToast({ msg: "Name cannot be empty.", error: true });
      return;
    }

    setSaving(true);
    try {
      await saveUser({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setEditing(false);
      setProfileToast({ msg: "Profile saved successfully." });
      setTimeout(() => setProfileToast(null), 3000);
    } catch (err) {
      setProfileToast({ msg: err?.response?.data?.detail || "Failed to save.", error: true });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (!pw.current) {
      setPwToast({ msg: "Enter your current password.", error: true });
      return;
    }
    if (!pw.newPw || pw.newPw.length < 6) {
      setPwToast({ msg: "New password must be at least 6 characters.", error: true });
      return;
    }
    if (pw.newPw !== pw.confirm) {
      setPwToast({ msg: "Passwords do not match.", error: true });
      return;
    }

    setPwSaving(true);
    try {
      await api.post("/profile/change-password", {
        old_password: pw.current,
        new_password: pw.newPw,
      });
      setPw({ current: "", newPw: "", confirm: "" });
      setPwToast({ msg: "Password updated successfully." });
      setTimeout(() => setPwToast(null), 3000);
    } catch (err) {
      setPwToast({ msg: err?.response?.data?.detail || "Failed to update password.", error: true });
    } finally {
      setPwSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your personal information and account details." />

      <Toast {...(profileToast || {})} msg={profileToast?.msg} error={profileToast?.error} />

      <div className="two-col" style={{ marginBottom: 16 }}>
        <Card>
          <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                margin: "0 auto 16px",
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                color: "#070b14",
              }}
            >
              {(form.name || user.name)?.[0]?.toUpperCase() || "A"}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{user.email}</p>
            <Badge color="green">{user.role}</Badge>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {user.location && (
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>📍 Location</div>
                <div style={{ fontSize: 13 }}>{user.location}</div>
              </div>
            )}
            {user.phone && (
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>📞 Phone</div>
                <div style={{ fontSize: 13 }}>{user.phone}</div>
              </div>
            )}
            {user.bio && (
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>📝 Bio</div>
                <div style={{ fontSize: 13 }}>{user.bio}</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            {!editing && (
              <Btn onClick={startEdit} style={{ width: "100%", justifyContent: "center" }}>
                Edit Profile
              </Btn>
            )}
            {editing && (
              <Btn variant="secondary" onClick={cancelEdit} style={{ width: "100%", justifyContent: "center" }}>
                Cancel
              </Btn>
            )}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {editing && (
            <Card title="Edit Profile">
              {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "text"], ["Location", "location", "text"]].map(([label, key, type]) => (
                <div className="form-field" key={key}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" type={type} value={form[key] || ""} onChange={f(key)} />
                </div>
              ))}

              <div className="form-field">
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={3} value={form.bio || ""} onChange={f("bio")} style={{ resize: "vertical" }} />
              </div>

              <div className="form-field">
                <label className="form-label">Role</label>
                <select className="form-input" value={form.role || "Administrator"} onChange={f("role")}>
                  {["Administrator", "Editor", "Viewer"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Plan</label>
                <select className="form-input" value={form.plan || "Enterprise"} onChange={f("plan")}>
                  {["Enterprise", "Pro", "Starter"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Btn>
                <Btn variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Btn>
              </div>
            </Card>
          )}

          <Card title="Update Password">
            <Toast {...(pwToast || {})} msg={pwToast?.msg} error={pwToast?.error} />
            {[["Current Password", "current"], ["New Password", "newPw"], ["Confirm Password", "confirm"]].map(([label, key]) => (
              <div className="form-field" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={pw[key]}
                  onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <Btn onClick={handleUpdatePassword} disabled={pwSaving}>
              {pwSaving ? "Updating..." : "Update Password"}
            </Btn>
          </Card>

          <Card title="Account Info">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Role", user.role], ["Email", user.email], ["Status", user.status || "Active"], ["Plan", user.plan || "Enterprise"]].map(([label, value]) => (
                <div key={label} style={{ background: "var(--bg-surface-2)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

