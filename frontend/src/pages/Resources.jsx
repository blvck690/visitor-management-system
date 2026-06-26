import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import clsx from "clsx";

export default function Resources() {
  const [items, setItems] = useState([]);
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0,16));
  const [to, setTo] = useState(() => new Date(Date.now() + 3600_000).toISOString().slice(0,16));

  const refresh = async () => {
    const { data } = await api.get("/resources/available", {
      params: { start: new Date(from).toISOString(), end: new Date(to).toISOString() },
    });
    setItems(data);
  };
  useEffect(() => { refresh(); }, [from, to]); // eslint-disable-line

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Resource Allocation</h1>

      <div className="card flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1"><label className="label">From</label><input type="datetime-local" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div className="flex-1"><label className="label">To</label><input type="datetime-local" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <button className="btn-primary" onClick={refresh}>Check Availability</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-slate-500">{r.type.replace("_"," ")} · cap {r.capacity}</div>
              </div>
              <span className={clsx("badge", r.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                {r.available ? "Available" : "Occupied"}
              </span>
            </div>
            {r.location && <div className="mt-3 text-xs text-slate-500">{r.location}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}