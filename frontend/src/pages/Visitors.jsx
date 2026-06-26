import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Visitors() {
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/visitors/all").then((r) => setList(r.data)); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Visitors</h1>
        <Link to="/visitors/new" className="btn-primary"><UserPlus className="w-4 h-4" /> New Visitor</Link>
      </div>
      <div className="card">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-slate-500 border-b">
            <tr><th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Created</th></tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 font-medium">{v.name}</td>
                <td>{v.email}</td><td>{v.phone}</td><td>{v.company || "—"}</td>
                <td className="text-slate-500">{new Date(v.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}