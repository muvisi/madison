"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQuery, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { FiCheckCircle, FiXCircle, FiUserPlus, FiEye, FiX } from "react-icons/fi";

interface User {
  uuid: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface UserFormData {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ---------------- API CALLS ----------------
const addUser = async (user: UserFormData): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/api/account/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data ? JSON.stringify(data) : res.statusText);
  }
  return res.json();
};

const updateUser = async (uuid: string, user: UserFormData): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/api/account/users/${uuid}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data ? JSON.stringify(data) : res.statusText);
  }
  return res.json();
};

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_BASE_URL}/api/account/users/`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const deleteUser = async (uuid: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/account/users/${uuid}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
};

// ---------------- COMPONENT ----------------
export default function UsersPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  // ---------- Edit Modal State ----------
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  // ---------- Add Mutation ----------
  const addMutation: UseMutationResult<User, Error, UserFormData> = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      setFormData({ username: "", email: "", password: "", first_name: "", last_name: "" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // ---------- Update Mutation ----------
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UserFormData }) => updateUser(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditOpen(false);
      setEditUserId(null);
      setFormData({ username: "", email: "", password: "", first_name: "", last_name: "" });
    },
  });

  // ---------- Delete Mutation ----------
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // ---------- Fetch Users ----------
  const { data: users, isLoading, isError } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: activeTab === "list",
  });

  // ---------- Handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editUserId !== null) {
      updateMutation.mutate({ uuid: editUserId, data: formData });
    }
  };

  const openEditModal = (user: User) => {
    setEditUserId(user.uuid);
    setFormData({ username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Tabs */}
      <div className="flex justify-center mb-10 space-x-4">
        {["add", "list"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "add" | "list")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "add" ? "Add User" : "User List"}
          </button>
        ))}
      </div>

      {/* ---------- Add User Tab ---------- */}
      {activeTab === "add" && (
        <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
          <div className="flex items-center mb-6">
            <FiUserPlus className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Add New User</h2>
          </div>

          {addMutation.isError && (
            <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <FiXCircle className="mr-2 text-xl" />
              <span>Error: {addMutation.error?.message}</span>
            </div>
          )}
          {addMutation.isSuccess && (
            <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <FiCheckCircle className="mr-2 text-xl" />
              <span>User created successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmitAdd} className="space-y-5">
            {["username", "email", "password", "first_name", "last_name"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">{field.replace("_", " ")}</label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={(formData as any)[field] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required={["username", "email", "password"].includes(field)}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={addMutation.status === "pending"}
              className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                addMutation.status === "pending"
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105"
              }`}
            >
              {addMutation.status === "pending" ? "Creating..." : "Add User"}
            </button>
          </form>
        </div>
      )}

      {/* ---------- User List Tab ---------- */}
      {activeTab === "list" && (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User List</h2>

          {isLoading && <p className="text-gray-500 text-center">Loading users...</p>}
          {isError && <p className="text-red-500 text-center">Failed to fetch users</p>}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  {["Username", "Email", "First Name", "Last Name", "Actions"].map((head) => (
                    <th key={head} className="border-b px-4 py-3 text-gray-700">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users?.map((user, idx) => (
                  <tr
                    key={user.uuid}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.first_name}</td>
                    <td className="px-4 py-2">{user.last_name}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(user.uuid)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- Edit Modal ---------- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditOpen(false)}
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h2>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {["username", "email", "first_name", "last_name"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 mb-1 capitalize">{field.replace("_", " ")}</label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field] || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={updateMutation.status === "pending"}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                  updateMutation.status === "pending"
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105"
                }`}
              >
                {updateMutation.status === "pending" ? "Updating..." : "Update User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}