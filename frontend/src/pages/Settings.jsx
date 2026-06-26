import { useAuth } from "../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <div className="card">
        <div className="text-sm text-slate-500">Account</div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div><div className="label">Name</div>{user?.name}</div>
          <div><div className="label">Email</div>{user?.email}</div>
          <div><div className="label">Role</div>{user?.role}</div>
          <div><div className="label">Department</div>{user?.department || "—"}</div>
        </div>
      </div>
    </div>
  );
}