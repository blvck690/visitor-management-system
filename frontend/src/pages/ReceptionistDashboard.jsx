import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { Users, Clock, CheckCircle2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReceptionistDashboard() {
  const [visits, setVisits] = useState([]);
  useEffect(() => { api.get("/visits/all").then((r) => setVisits(r.data)); }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const todays = visits.filter((v) => new Date(v.visitDate) >= today && new Date(v.visitDate) < new Date(today.getTime() + 86400000));
  const pending = visits.filter((v) => v.status === "PENDING");
  const checkedIn = visits.filter((v) => v.status === "CHECKED_IN");

  const checkIn = async (id) => { await api.put(`/visits/check-in/${id}`); setVisits((vs) => vs.map((v) => v.id === id ? { ...v, status: "CHECKED_IN" } : v)); };
  const checkOut = async (id) => { await api.put(`/visits/check-out/${id}`); setVisits((vs) => vs.map((v) => v.id === id ? { ...v, status: "CHECKED_OUT" } : v)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">Today at a glance</p>
        </div>
        <Link to="/visitors/new" className="btn-primary"><Users className="w-4 h-4" /> Register Visitor</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Today's Visitors" value={todays.length} Icon={Users} tone="brand" />
        <StatCard label="Pending Approvals" value={pending.length} Icon={Clock} tone="amber" />
        <StatCard label="Currently Checked-in" value={checkedIn.length} Icon={LogIn} tone="emerald" />
        <StatCard label="Total Visits" value={visits.length} Icon={CheckCircle2} tone="slate" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500 border-b">
              <tr><th className="py-2">Visitor</th><th>Host</th><th>Purpose</th><th>Time</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {todays.length === 0 && <tr><td colSpan="6" className="py-6 text-center text-slate-400">No visits scheduled today.</td></tr>}
              {todays.map((v) => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="py-3 font-medium">{v.visitor.name}<div className="text-xs text-slate-500">{v.visitor.company}</div></td>
                  <td>{v.host.name}</td>
                  <td className="max-w-xs truncate">{v.purpose}</td>
                  <td>{new Date(v.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td><StatusBadge status={v.status} /></td>
                  <td className="text-right">
                    {v.status === "APPROVED" && <button className="btn-ghost" onClick={() => checkIn(v.id)}>Check in</button>}
                    {v.status === "CHECKED_IN" && <button className="btn-ghost" onClick={() => checkOut(v.id)}>Check out</button>}
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