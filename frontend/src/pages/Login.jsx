import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("reception@vms.local");
  const [password, setPassword] = useState("password123");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back");
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div>
          <div className="text-2xl font-bold">VMS</div>
          <div className="text-brand-100/80 text-sm">Visitor Management System</div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold leading-tight">Streamline every visit, from front desk to boardroom.</h1>
          <p className="mt-4 text-brand-100/80 max-w-md">Register visitors, manage approvals, reserve resources and stay in sync — all in one elegant workspace.</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-brand-100/80">
            <ShieldCheck className="w-4 h-4" /> Enterprise-grade · Built for AWS & Azure
          </div>
        </motion.div>
        <div className="text-xs text-brand-100/60">© {new Date().getFullYear()} Your Company</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md">
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="text-sm text-slate-500 mt-1">Use your company credentials to continue.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              <LogIn className="w-4 h-4" /> {loading ? "Signing in..." : "Login"}
            </button>
          </div>
          <div className="mt-6 text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
            Demo accounts: <b>admin@vms.local</b>, <b>reception@vms.local</b>, <b>john@vms.local</b> — password <b>password123</b>
          </div>
        </motion.form>
      </div>
    </div>
  );
}