"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiLock,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { getAccessToken } from "@/src/services/auth";

interface User {
  uuid: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  department?: string;
}

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  department: string;
  login_method?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const emptyForm: UserFormData = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  department: "",
  login_method: "",
};

const apiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAccessToken()}`,
});

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/api/account/users/`, {
    headers: apiHeaders(),
  });
  if (!response.ok) throw new Error("Unable to load users");
  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
};

const createUser = async (user: UserFormData): Promise<User> => {
  const payload = { ...user };
  if (payload.login_method === "ldap") delete payload.password;
  const response = await fetch(`${API_BASE_URL}/api/account/users/`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Unable to create user");
  }
  return response.json();
};

const updateUser = async (uuid: string, user: UserFormData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/account/user/update/${uuid}/`, {
    method: "PATCH",
    headers: apiHeaders(),
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Unable to update user");
  return response.json();
};

const deleteUser = async (uuid: string) => {
  const response = await fetch(`${API_BASE_URL}/api/account/users/${uuid}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!response.ok) throw new Error("Unable to delete user");
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof UserFormData;
  value: string;
  onChange: (name: keyof UserFormData, value: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      required={required}
      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
    />
  </div>
);

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "create">("directory");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("username") === "admin");
    setSessionChecked(true);
  }, []);

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: sessionChecked && isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setForm(emptyForm);
      setActiveTab("directory");
      toast.success("User account created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UserFormData }) =>
      updateUser(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditing(null);
      setForm(emptyForm);
      toast.success("User account updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User account removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filteredUsers = (usersQuery.data || []).filter((user) =>
    [user.username, user.email, user.first_name, user.last_name, user.department]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateField = (name: keyof UserFormData, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "login_method" && value === "ldap" ? { password: "" } : {}),
    }));
  };

  const submitCreate = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  const openEdit = (user: User) => {
    setForm({
      username: user.username,
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      department: user.department || "",
    });
    setEditing(user);
  };

  if (!sessionChecked) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-100 border-t-[#0c477d]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-xl text-amber-700">
          <FiLock />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Administrator access required</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          User accounts and access assignments can only be managed by an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl text-blue-700">
              <FiShield />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2b6b9c]">
                Administration
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Users & Access
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Create accounts, assign departments, and maintain application access.
              </p>
            </div>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setActiveTab("directory")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "directory" ? "bg-white text-[#0c477d] shadow-sm" : "text-slate-500"
              }`}
            >
              User directory
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === "create" ? "bg-white text-[#0c477d] shadow-sm" : "text-slate-500"
              }`}
            >
              Add account
            </button>
          </div>
        </div>
      </section>

      {activeTab === "directory" ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">User directory</h3>
              <p className="mt-1 text-sm text-slate-500">
                {(usersQuery.data || []).length} registered account{(usersQuery.data || []).length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users"
                className="h-10 w-full rounded-xl border border-slate-300 pl-10 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
                  {["User", "Email", "Department", "Account", "Actions"].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersQuery.isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={5} className="px-5 py-3">
                          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  : filteredUsers.map((user) => (
                      <tr key={user.uuid} className="transition hover:bg-blue-50/40">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0c477d] text-xs font-semibold text-white">
                              {(user.first_name?.[0] || user.username[0] || "U").toUpperCase()}
                              {(user.last_name?.[0] || "").toUpperCase()}
                            </span>
                            <span>
                              <span className="block font-semibold text-slate-800">
                                {[user.first_name, user.last_name].filter(Boolean).join(" ") || user.username}
                              </span>
                              <span className="block text-xs text-slate-500">@{user.username}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{user.email || "—"}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                            {user.department || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <FiUserCheck />
                            Active
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(user)}
                              aria-label={`Edit ${user.username}`}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove the account for ${user.username}?`)) {
                                  deleteMutation.mutate(user.uuid);
                                }
                              }}
                              aria-label={`Delete ${user.username}`}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <form onSubmit={submitCreate} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <FiPlus />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Create user account</h3>
                <p className="text-sm text-slate-500">Enter identity and access details.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Login method</label>
                <select
                  value={form.login_method || ""}
                  onChange={(event) => updateField("login_method", event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">Select login method</option>
                  <option value="ldap">Madison network account</option>
                  <option value="local">Local application account</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Department</label>
                <select
                  value={form.department}
                  onChange={(event) => updateField("department", event.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">Select department</option>
                  <option value="underwriting">Underwriting</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <Field label="Username" name="username" value={form.username} onChange={updateField} required />
              <Field label="Email address" name="email" value={form.email} onChange={updateField} type="email" required />
              <Field label="First name" name="first_name" value={form.first_name} onChange={updateField} />
              <Field label="Last name" name="last_name" value={form.last_name} onChange={updateField} />
              {form.login_method === "local" && (
                <div className="sm:col-span-2">
                  <Field label="Temporary password" name="password" value={form.password || ""} onChange={updateField} type="password" required />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0c477d] px-5 text-sm font-semibold text-white transition hover:bg-[#093a68] disabled:opacity-60"
              >
                {createMutation.isPending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <FiPlus />
                )}
                Create account
              </button>
            </div>
          </form>
          <aside className="rounded-2xl bg-[#0c477d] p-6 text-white">
            <FiShield className="text-2xl" />
            <h3 className="mt-5 font-semibold">Access governance</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/75">
              Assign each account to the correct department. Finance access controls commission authorization workflows.
            </p>
          </aside>
        </section>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="font-semibold text-slate-900">Edit user account</h3>
                <p className="mt-1 text-sm text-slate-500">Update identity and department assignment.</p>
              </div>
              <button
                onClick={() => setEditing(null)}
                aria-label="Close edit user dialog"
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                updateMutation.mutate({ uuid: editing.uuid, data: form });
              }}
              className="p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Username" name="username" value={form.username} onChange={updateField} required />
                <Field label="Email address" name="email" value={form.email} onChange={updateField} type="email" required />
                <Field label="First name" name="first_name" value={form.first_name} onChange={updateField} />
                <Field label="Last name" name="last_name" value={form.last_name} onChange={updateField} />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Department</label>
                  <select
                    value={form.department}
                    onChange={(event) => updateField("department", event.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select department</option>
                    <option value="underwriting">Underwriting</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={updateMutation.isPending} className="h-10 rounded-xl bg-[#0c477d] px-5 text-sm font-semibold text-white disabled:opacity-60">
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
