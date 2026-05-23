import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../services/api";

export const AuthContext = createContext(null);

function normalizeUser(data) {
  return {
    id: data.id,
    name: data.full_name || data.email?.split("@")?.[0] || "User",
    email: data.email,
    phone: data.phone || "",
    location: data.location || "",
    bio: data.bio || "",
    role: data.role || "Administrator",
    plan: data.plan || "Enterprise",
    status: data.is_active ? "Active" : "Inactive",
    avatar: (data.full_name || data.email || "U")[0].toUpperCase(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nexus_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);

    api
      .get("/profile/me")
      .then((res) => setUser(normalizeUser(res.data)))
      .catch(() => {
        localStorage.removeItem("nexus_token");
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const access_token = res.data.access_token;
    localStorage.setItem("nexus_token", access_token);
    setAuthToken(access_token);

    const profile = await api.get("/profile/me");
    setUser(normalizeUser(profile.data));
  }

  async function register(email, password, full_name) {
    await api.post("/auth/register", { email, password, full_name });
  }

  async function saveUser(updates) {
    const current = user;
    const payload = {
      full_name: updates.name ?? current?.name ?? "",
      email: updates.email ?? current?.email ?? "",
      phone: updates.phone ?? current?.phone,
      location: updates.location ?? current?.location,
      bio: updates.bio ?? current?.bio,
      role: updates.role ?? current?.role,
      plan: updates.plan ?? current?.plan,
    };

    // backend expects full_name/email/phone/location/bio/role/plan
    const res = await api.put("/profile/me", payload);
    setUser(normalizeUser(res.data));
  }

  function logout() {
    localStorage.removeItem("nexus_token");
    setAuthToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout, register, saveUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

