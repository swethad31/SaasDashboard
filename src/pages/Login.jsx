import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FiZap } from "react-icons/fi";

export default function Login() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await register(form.email, form.password, form.name);
      }

      await login(form.email, form.password);
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#070b14",
            }}
          >
            <FiZap />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Nexus
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Sign in to your dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              color: "#ef4444",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {mode === "register" && (
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Admin User"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
        )}

        <div className="form-field">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="admin@nexus.app"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn--primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p
          onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
          style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}
        >
          {mode === "login" ? "No account? Register" : "Have account? Sign in"}
        </p>
      </div>
    </div>
  );
}

