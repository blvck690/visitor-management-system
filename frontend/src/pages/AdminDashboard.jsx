import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import { Users, UserCheck, Clock, Building2, Boxes } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b6cf6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#0ea5e9"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) return null;

  // Safe fallbacks
  const monthly = stats?.monthly || [];

  const pieData = monthly.map((m) => ({
    name: m.status || "UNKNOWN",
    value: m?._count?.status || m?._count?._all || 0,
  }));

  const barData = [
    { name: "Boardroom", value: stats?.boardroomBookings || 0 },
    { name: "Equipment", value: stats?.equipmentBookings || 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={stats?.employees || 0}
          Icon={Users}
          tone="brand"
        />
        <StatCard
          label="Total Visitors"
          value={stats?.visitors || 0}
          Icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="Today's Visits"
          value={stats?.todayVisits || 0}
          Icon={Building2}
          tone="slate"
        />
        <StatCard
          label="Pending Requests"
          value={stats?.pending || 0}
          Icon={Clock}
          tone="amber"
        />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-blue-600" />
            Resource Utilization
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#3b6cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="card">
          <h2 className="font-semibold mb-4">
            Monthly Visits by Status
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}