import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllUsersAPI,
  deleteUserAPI,
  createUserAPI,
  updateUserAPI,
} from "../features/users/userAPI";

import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);  
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    is_admin: false,
  });

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    is_admin: false,
  });
  
  const fetchUsers = async () => {
    try {
      const data = await getAllUsersAPI(search);
      setUsers(data);
      setUsercount(data.length);
      
      
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    
  }, [search]);
  
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  const loadingToast = toast.loading("Deleting user...");

  try {
    await deleteUserAPI(id);
    toast.dismiss(loadingToast);
    toast.success("User deleted successfully 🗑️");
    fetchUsers();
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("Delete failed");
  }
};


  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateUser = async (e) => {
  e.preventDefault();
  const loadingToast = toast.loading("Creating user...");

  try {
    await createUserAPI(formData);
    toast.dismiss(loadingToast);
    toast.success("User created successfully 👤");

    setFormData({
      email: "",
      username: "",
      password: "",
      is_admin: false,
    });

    fetchUsers();
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("User creation failed");
  }
};


  const openEditModal = (user) => {
    setEditingUser(user);
    setEditData({
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdateUser = async (e) => {
  e.preventDefault();
  const loadingToast = toast.loading("Updating user...");

  try {
    await updateUserAPI(editingUser.id, editData);
    toast.dismiss(loadingToast);
    toast.success("User updated successfully ✏️");
    setEditingUser(null);
    fetchUsers();
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("Update failed");
  }

  
  

};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userCount={userCount} />

       
       
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

        {/* Create User */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New User</h3>
          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="p-2 border rounded"
              value={formData.username}
              onChange={handleCreateChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={formData.email}
              onChange={handleCreateChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 border rounded"
              value={formData.password}
              onChange={handleCreateChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Confirm-password"
              className="p-2 border rounded"
              value={formData.password}
              onChange={handleCreateChange}
              required
            />
            {/* <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_admin"
                checked={formData.is_admin}
                onChange={handleCreateChange}
              />
              Admin
            </label> */}

            <button className="md:col-span-4 bg-green-600 text-white p-2 rounded">
              Create User
            </button>
          </form>
        </div>

        
        <input
          type="text"
          placeholder="Search by email or username..."
          className="p-3 border rounded w-full mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                
                <tr key={user.id} className="border-t">
                  <td className="p-3">{index+1}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.is_admin ? "Admin" : "User"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <h3 className="text-xl font-bold mb-4">Edit User</h3>

              <form onSubmit={handleUpdateUser} className="space-y-3">
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={editData.is_admin}
                    onChange={handleEditChange}
                  />
                  Admin Role
                </label>

                <div className="flex justify-between mt-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
