import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaUserEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Password must be ≥6 chars, include uppercase, number, special
const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

const SettingsUserManagement = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("admins");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ username: "", email: "", password: "" });
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://json-server-api-y6cs.onrender.com/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch {
      toast.error("Failed to fetch users", { autoClose: 3000, progress: undefined });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading users...</div>;
  if (!currentUser || (currentUser.role !== "superAdmin" && currentUser.role !== "admin"))
    return <div className="p-6 text-red-600 font-semibold">Access denied.</div>;

  const admins = users.filter(u => u.role === "admin" || u.role === "superAdmin");
  const customers = users.filter(u => u.role === "customer");

  const canEditUser = (u) => {
    if (u.role === "superAdmin" && currentUser.role !== "superAdmin") return false;
    if (u.role === "admin" && currentUser.role === "admin" && u.id !== currentUser.id) return false;
    return true;
  };

  const handleSelectUser = (u) => {
    if (!canEditUser(u)) return;
    setSelectedUser({ ...u });
    setShowPwd(false);
    setShowUserModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!canEditUser(selectedUser)) return;

    if (!pwdRegex.test(selectedUser.password)) {
      return toast.error(
        "Password must be ≥6 characters, include uppercase, number & special",
        { autoClose: 3000, progress: undefined }
      );
    }

    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      toast.success("User updated!", { autoClose: 3000, progress: undefined });
      setShowUserModal(false);
    } catch (err) {
      toast.error("Error updating user: " + err.message, { autoClose: 3000, progress: undefined });
    }
  };

  const handleDeleteUser = (id, role) => {
    const target = users.find(u => u.id === id);
    if (!canEditUser(target)) return;
    setConfirmDeleteUserId(id);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://json-server-api-y6cs.onrender.com/users/${confirmDeleteUserId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(prev => prev.filter(u => u.id !== confirmDeleteUserId));
      toast.success("User deleted!", { autoClose: 3000, progress: undefined });
      setConfirmDeleteUserId(null);
    } catch (err) {
      toast.error("Delete failed: " + err.message, { autoClose: 3000, progress: undefined });
      setConfirmDeleteUserId(null);
    }
  };

  const handleCreate = async () => {
    const { username, email, password } = newAdminData;
    if (!username || !email || !password) {
      return toast.error("All fields are required", { autoClose: 3000, progress: undefined });
    }
    if (!pwdRegex.test(password)) {
      return toast.error(
        "Password must be ≥6 chars, include uppercase, number & special",
        { autoClose: 3000, progress: undefined }
      );
    }
    if (users.some(u => u.username === username || u.email === email)) {
      return toast.error("Username or email already exists", { autoClose: 3000, progress: undefined });
    }

    try {
      const res = await fetch("https://json-server-api-y6cs.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAdminData, role: "admin", orders: [], favorites: [], cart: [] }),
      });
      if (!res.ok) throw new Error("Create failed");
      const added = await res.json();
      setUsers(prev => [...prev, added]);
      setNewAdminData({ username: "", email: "", password: "" });
      toast.success("Admin created!", { autoClose: 3000, progress: undefined });
    } catch (err) {
      toast.error("Failed to create: " + err.message, { autoClose: 3000, progress: undefined });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl mb-6">User Management</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "admins" ? "bg-indigo-600 text-white" : "border"}`}
          onClick={() => setActiveTab("admins")}
        >Admins</button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "customers" ? "bg-indigo-600 text-white" : "border"}`}
          onClick={() => setActiveTab("customers")}
        >Customers</button>
        {currentUser.role === "superAdmin" && (
          <button
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded flex items-center"
            onClick={() => setCreatingAdmin(prev => !prev)}
          ><FaPlus /> Create Admin</button>
        )}
      </div>

      {creatingAdmin && (
        <div className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <h2 className="mb-4 text-xl">New Admin</h2>
          {["username", "email", "password"].map(f => (
            <div key={f} className="mb-3">
              <label className="block capitalize">{f}</label>
              <input
                type={f === "password" ? "password" : "text"}
                name={f}
                value={newAdminData[f]}
                onChange={e => setNewAdminData(prev => ({ ...prev, [f]: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
          <div className="text-right">
            <button className="px-4 py-2 border rounded mr-2" onClick={() => setCreatingAdmin(false)}>Cancel</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleCreate}>Create</button>
          </div>
        </div>
      )}

      <table className="w-full bg-white rounded shadow mb-6">
        <thead className="bg-gray-100">
          <tr>
            {["Username", "Email", "Role", "Orders", "Favs", "Cart", "Actions"].map(h => (
              <th key={h} className="px-4 py-2 border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(activeTab === "admins" ? admins : customers).map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{u.username}</td>
              <td className="px-4 py-2 border">{u.email}</td>
              <td className="px-4 py-2 border">{u.role}</td>
              <td className="px-4 py-2 border text-center">{u.orders?.length}</td>
              <td className="px-4 py-2 border text-center">{u.favorites?.length}</td>
              <td className="px-4 py-2 border text-center">{u.cart?.length}</td>
              <td className="px-4 py-2 border text-center space-x-2">
                <button onClick={() => handleSelectUser(u)} disabled={!canEditUser(u)}>
                  <FaUserEdit />
                </button>
                <button onClick={() => handleDeleteUser(u.id, u.role)} disabled={!canEditUser(u)}>
                  <FaTrash className="text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowUserModal(false)}>×</button>
            <h2 className="mb-4 text-2xl">Edit User</h2>
            {["username", "email"].map(f => (
              <div key={f} className="mb-3">
                <label className="block capitalize">{f}</label>
                <input
                  type="text"
                  name={f}
                  value={selectedUser[f]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <div className="mb-3">
              <label>Password</label>
              <div className="flex space-x-2">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={selectedUser.password}
                  onChange={handleChange}
                  className="flex-grow border rounded px-3 py-2"
                  disabled={currentUser.role !== "superAdmin"}
                />
                {currentUser.role === "superAdmin" && (
                  <button className="px-3 bg-gray-200 rounded" onClick={() => setShowPwd(prev => !prev)}>
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>
            </div>
            <div className="text-right">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSaveUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="mb-4 text-lg">Confirm Delete?</h3>
            <div className="text-right">
              <button className="px-4 py-2 border rounded mr-2" onClick={() => setConfirmDeleteUserId(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsUserManagement;
