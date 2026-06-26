import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { Clock, Users, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployeeDashboard() {
  const [visits, setVisits] = useState([]);

  const load = () => api.get("/visits/mine").then((r) => setVisits(r.data));
  useEffect(() => { load(); }, []);

  const decide = async (id, kind) => {
    await api.put(`/visits/${kind}/${id}`);
    toast.success(`Visit ${kind}d`);
    load();
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const stats = {
    pending: visits.filter((v) => v.status === "PENDING").length,
    today: visits.filter((v) => {
      const d = new Date(v.visitDate);
      return d >= today && d < new Date(today.getTime() + 86400000);
    }).length,
    upcoming: visits.filter((v) => new Date(v.visitDate) > new Date()).length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Pending Requests" value={stats.pending} Icon={Clock} tone="amber" />
        <StatCard label="Today's Visitors" value={stats.today} Icon={Users} tone="brand" />
        <StatCard label="Upcoming Visits" value={stats.upcoming} Icon={CalendarCheck} tone="emerald" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">My Visits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500 border-b">
              <tr><th className="py-2">Visitor</th><th>Reason</th><th>Date</th><th>Resources</th><th>Status</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody>
              {visits.length === 0 && <tr><td colSpan="6" className="py-6 text-center text-slate-400">No visits yet.</td></tr>}
              {visits.map((v) => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="py-3 font-medium">{v.visitor.name}<div className="text-xs text-slate-500">{v.visitor.company}</div></td>
                  <td className="max-w-xs truncate">{v.purpose}</td>
                  <td>{new Date(v.visitDate).toLocaleDateString()}</td>
                  <td className="text-xs text-slate-500">{v.bookings.map((b) => b.resource.name).join(", ") || "—"}</td>
                  <td><StatusBadge status={v.status} /></td>
                  <td className="text-right space-x-2">
                    {v.status === "PENDING" && <>
                      <button className="btn-success !py-1.5 !px-3 text-xs" onClick={() => decide(v.id, "approve")}>Approve</button>
                      <button className="btn-danger !py-1.5 !px-3 text-xs" onClick={() => decide(v.id, "reject")}>Reject</button>
                      <button className="btn-warn !py-1.5 !px-3 text-xs" onClick={() => decide(v.id, "hold")}>Hold</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}