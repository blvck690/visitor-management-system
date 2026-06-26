import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import Login from "./pages/Login.jsx";
import ApprovalPage from "./pages/ApprovalPage.jsx";
import ReceptionistDashboard from "./pages/ReceptionistDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RegisterVisitor from "./pages/RegisterVisitor.jsx";
import Visitors from "./pages/Visitors.jsx";
import Resources from "./pages/Resources.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Notifications from "./pages/Notifications.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import MyApprovals from "./pages/MyApprovals.jsx";

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  if (user.role === "RECEPTIONIST") return <ReceptionistDashboard />;
  return <EmployeeDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/approve/:token" element={<ApprovalPage />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="visitors/new" element={<RegisterVisitor />} />
        <Route path="resources" element={<Resources />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="my-approvals" element={<MyApprovals />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}