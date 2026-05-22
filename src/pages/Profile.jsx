import { useState } from "react";
import { PageHeader, Card, Badge, Btn } from "../components/common/PageLayout";

const activities = [
  { action: "Updated billing information", time: "2 hours ago", icon: "💳" },
  { action: "Downloaded Q2 Report", time: "5 hours ago", icon: "📄" },
  { action: "Added new team member", time: "1 day ago", icon: "👥" },
  { action: "Changed password", time: "3 days ago", icon: "🔒" },
  { action: "Upgraded to Enterprise plan", time: "1 week ago", icon: "⭐" },
  { action: "Enabled Two-Factor Auth", time: "2 weeks ago", icon: "🛡️" },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "Admin User", email: "admin@nexus.app", role: "Administrator", bio: "SaaS platform administrator managing analytics and user growth.", phone: "+1 (555) 000-1234", location: "San Francisco, CA" });

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your personal information and activity." />

      <div className="two-col" style={{ marginBottom: 16 }}>
        {/* Profile Card */}
        <Card>
          <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "#070b14", fontFamily: "var(--font-display)"
            }}>A</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>{form.name}</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{form.email}</p>
            <Badge color="green">{form.role}</Badge>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["📍 Location", form.location],
              ["📞 Phone", form.phone],
              ["📝 Bio", form.bio],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Btn onClick={() => setEditing(true)} style={{ flex: 1, justifyContent: "center" }}>Edit Profile</Btn>
          </div>
        </Card>

        {/* Edit Form or Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {editing ? (
            <Card title="Edit Profile">
              <div className="form-field"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="form-field"><label className="form-label">Bio</label><textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: "vertical" }} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => setEditing(false)}>Save</Btn>
                <Btn variant="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
              </div>
            </Card>
          ) : (
            <Card title="Update Password">
              <div className="form-field"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              <div className="form-field"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              <div className="form-field"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              <Btn>Update Password</Btn>
            </Card>
          )}

          <Card title="Account Stats">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Member Since", "Jan 2023"], ["Plan", "Enterprise"], ["Reports", "42"], ["Team Members", "8"]].map(([label, value]) => (
                <div key={label} style={{ background: "var(--bg-surface-2)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>{value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card title="Activity History">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < activities.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>{a.action}</div>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
