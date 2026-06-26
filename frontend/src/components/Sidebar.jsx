import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarDays, Boxes, Bell,
  FileBarChart2, Settings, LogOut, ClipboardCheck, UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import clsx from "clsx";

const itemsByRole = {
  RECEPTIONIST: [
    { to: "/", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/visitors/new", label: "Register Visitor", Icon: UserPlus },
    { to: "/visitors", label: "Visitors", Icon: Users },
    { to: "/resources", label: "Resources", Icon: Boxes },
    { to: "/calendar", label: "Calendar", Icon: CalendarDays },
    { to: "/notifications", label: "Notifications", Icon: Bell },
    { to: "/reports", label: "Reports", Icon: FileBarChart2 },
    { to: "/settings", label: "Settings", Icon: Settings },
  ],
  EMPLOYEE: [
    { to: "/", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/my-approvals", label: "Approvals", Icon: ClipboardCheck },
    { to: "/calendar", label: "Calendar", Icon: CalendarDays },
    { to: "/notifications", label: "Notifications", Icon: Bell },
    { to: "/settings", label: "Settings", Icon: Settings },
  ],
  ADMIN: [
    { to: "/", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/visitors", label: "Visitors", Icon: Users },
    { to: "/resources", label: "Resources", Icon: Boxes },
    { to: "/calendar", label: "Calendar", Icon: CalendarDays },
    { to: "/notifications", label: "Notifications", Icon: Bell },
    { to: "/reports", label: "Reports", Icon: FileBarChart2 },
    { to: "/settings", label: "Settings", Icon: Settings },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = itemsByRole[user?.role] ?? itemsByRole.EMPLOYEE;

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-brand-900 text-brand-50">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-lg font-bold tracking-tight">VMS</div>
        <div className="text-xs text-brand-100/70">Visitor Management</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive ? "bg-white/10 text-white" : "text-brand-100/80 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="flex items-center gap-3 m-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-100/80 hover:bg-white/5 hover:text-white">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  );
}