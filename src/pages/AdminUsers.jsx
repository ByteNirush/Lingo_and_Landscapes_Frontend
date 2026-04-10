import { useEffect, useState } from "react";
import { Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { formatShortDate } from "../utils/date";
import { deleteAdminUser, getAdminUsers } from "../utils/adminApi";
import { mapApiError } from "../utils/errorMapper";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const nextUsers = await getAdminUsers();
      setUsers(nextUsers);
    } catch (error) {
      toast.error(mapApiError(error, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove user "${name}"?`)) return;
    try {
      await deleteAdminUser(id);
      toast.success("User removed");
      fetchUsers();
    } catch (error) {
      toast.error(mapApiError(error, "Failed to remove user"));
    }
  };

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Admin · Users</div>
        <h1 className="page-title">All Users</h1>
        <p className="mt-1.5 text-slate-500">
          {loading
            ? "Loading users..."
            : `${users.length} registered learner${users.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse h-16" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-3 flex justify-center text-slate-400">
            <Users size={34} aria-hidden="true" />
          </div>
          <p className="text-slate-500">No learners registered yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Country
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Passport
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${user.role === "admin" ? "bg-linear-to-br from-purple-500 to-indigo-600" : "bg-linear-to-br from-crimson-400 to-crimson-600"}`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-nepal-dark">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {user.country || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {user.passport_number || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {formatShortDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-xs font-semibold text-red-500 opacity-0 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700 group-hover:opacity-100"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
