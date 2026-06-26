import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Reports() {
  const [series, setSeries] = useState([]);
  useEffect(() => {
    api.get("/calendar/events").then((r) => {
      const buckets = {};
      r.data.forEach((e) => {
        const k = new Date(e.start).toISOString().slice(0,10);
        buckets[k] = (buckets[k] || 0) + 1;
      });
      setSeries(Object.entries(buckets).map(([date, count]) => ({ date, count })).sort((a,b) => a.date.localeCompare(b.date)));
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <div className="card">
        <h2 className="font-semibold mb-4">Visits per day</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" /><YAxis allowDecimals={false} /><Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b6cf6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}