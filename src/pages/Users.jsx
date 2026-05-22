import { useState } from "react";
import { PageHeader, StatCard, Card, Badge, Btn } from "../components/common/PageLayout";
import { FiUsers, FiUserCheck, FiUserX, FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const initialUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", joined: "Jan 12, 2024" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active", joined: "Feb 3, 2024" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Manager", status: "Inactive", joined: "Mar 8, 2024" },
  { id: 4, name: "David Lee", email: "david@example.com", role: "User", status: "Active", joined: "Mar 22, 2024" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", role: "User", status: "Pending", joined: "Apr 1, 2024" },
  { id: 6, name: "Frank Kim", email: "frank@example.com", role: "Manager", status: "Active", joined: "Apr 14, 2024" },
  { id: 7, name: "Grace Chen", email: "grace@example.com", role: "User", status: "Active", joined: "May 2, 2024" },
];

const statusColor = { Active: "green", Inactive: "red", Pending: "orange" };
const roleColor = { Admin: "purple", Manager: "blue", User: "green" };

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "User", status: "Active" });

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit() {
    if (!form.name || !form.email) return;
    if (editUser) {
      setUsers(us => us.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      setUsers(us => [...us, { ...form, id: Date.now(), joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }]);
    }
    setShowForm(false); setEditUser(null); setForm({ name: "", email: "", role: "User", status: "Active" });
  }

  function handleEdit(u) {
    setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setShowForm(true);
  }

  function handleDelete(id) { setUsers(us => us.filter(u => u.id !== id)); }

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage your user base and permissions."
        action={<Btn onClick={() => { setShowForm(true); setEditUser(null); setForm({ name: "", email: "", role: "User", status: "Active" }); }}><FiPlus /> Add User</Btn>}
      />

      <div className="stat-cards-grid">
        <StatCard title="Total Users" value={users.length} icon={<FiUsers />} color="var(--accent)" />
        <StatCard title="Active" value={users.filter(u => u.status === "Active").length} icon={<FiUserCheck />} color="var(--accent-2)" />
        <StatCard title="Inactive" value={users.filter(u => u.status === "Inactive").length} icon={<FiUserX />} color="#ef4444" />
        <StatCard title="Admins" value={users.filter(u => u.role === "Admin").length} icon={<FiUsers />} color="var(--accent-orange)" />
      </div>

      {showForm && (
        <Card title={editUser ? "Edit User" : "Add New User"} className="mb-16" style={{ marginBottom: 16 }}>
          <div className="two-col" style={{ marginBottom: 12 }}>
            <div className="form-field"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
            <div className="form-field"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="form-field"><label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option>Admin</option><option>Manager</option><option>User</option>
              </select>
            </div>
            <div className="form-field"><label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>Inactive</option><option>Pending</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={handleSubmit}>{editUser ? "Save Changes" : "Add User"}</Btn>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card title="User List" action={
        <div style={{ position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }} />
          <input className="form-input" style={{ paddingLeft: 32, width: 220 }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      }>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><strong style={{ color: "var(--text)" }}>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><Badge color={roleColor[u.role]}>{u.role}</Badge></td>
                  <td><Badge color={statusColor[u.status]}>{u.status}</Badge></td>
                  <td style={{ color: "var(--text-muted)" }}>{u.joined}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(u)} style={{ color: "var(--accent-2)", fontSize: 15, padding: 4 }}><FiEdit2 /></button>
                      <button onClick={() => handleDelete(u.id)} style={{ color: "#ef4444", fontSize: 15, padding: 4 }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
