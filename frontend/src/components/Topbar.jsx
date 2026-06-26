import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 text-slate-500">
          <Search className="w-4 h-4" />
          <input placeholder="Search visitors, visits..." className="bg-transparent outline-none text-sm w-72 placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="relative text-slate-600 hover:text-brand-700">
            <Bell className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="text-sm">
              <div className="font-medium leading-tight">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}