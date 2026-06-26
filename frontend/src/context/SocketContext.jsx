import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const Ctx = createContext(null);
export const useSocket = () => useContext(Ctx);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const s = io(url, { transports: ["websocket"] });
    s.on("connect", () => s.emit("join", user.id));
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  return <Ctx.Provider value={socket}>{children}</Ctx.Provider>;
}