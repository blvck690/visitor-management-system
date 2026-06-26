import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vms_user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("vms_token", data.token);
      localStorage.setItem("vms_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("vms_token");
    localStorage.removeItem("vms_user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("vms_token");
    if (token && !user) {
      api.get("/auth/me").then((r) => setUser(r.data)).catch(() => logout());
    }
  }, []); // eslint-disable-line

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}