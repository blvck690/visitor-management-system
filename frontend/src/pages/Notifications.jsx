import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useSocket } from "../context/SocketContext.jsx";
import { Bell, Check } from "lucide-react";
import clsx from "clsx";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const socket = useSocket();

  useEffect(() => { api.get("/notifications/all").then((r) => setItems(r.data)); }, []);
  useEffect(() => {
    if (!socket) return;
    const h = (n) => setItems((xs) => [n, ...xs]);
    socket.on("notification", h);
    return () => socket.off("notification", h);
  }, [socket]);

  const mark = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setItems((xs) => xs.map((x) => x.id === id ? { ...x, read: true } : x));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      <div className="card divide-y">
        {items.length === 0 && <div className="py-8 text-center text-slate-400">All caught up.</div>}
        {items.map((n) => (
          <div key={n.id} className={clsx("flex items-start gap-3 py-3", !n.read && "bg-brand-50/40 -mx-6 px-6")}>
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center"><Bell className="w-4 h-4" /></div>
            <div className="flex-1">
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-sm text-slate-600">{n.body}</div>
              <div className="text-xs text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && <button className="btn-ghost !py-1.5 !px-3 text-xs" onClick={() => mark(n.id)}><Check className="w-3.5 h-3.5" /> Mark read</button>}
          </div>
        ))}
      </div>
    </div>
  );
}