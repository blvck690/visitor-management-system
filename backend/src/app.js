import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import visitorRoutes from "./routes/visitor.routes.js";
import visitRoutes from "./routes/visit.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";

import { errorHandler, notFound } from "./middleware/error.js";
import { initSocket } from "./services/notification.service.js";
import { verifyEmailConnection } from "./services/email.service.js";

const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET SETUP
========================= */
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  },
});

initSocket(io);

/* =========================
   MIDDLEWARE
========================= */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ts: Date.now() })
);

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

/* =========================
   ERROR HANDLERS
========================= */
app.use(notFound);
app.use(errorHandler);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  console.log(`✅ VMS API listening on :${PORT}`);

  // 🔥 EMAIL SYSTEM CHECK ON STARTUP
  try {
    const ok = await verifyEmailConnection();
    if (!ok) {
      console.warn("⚠️ Email system NOT ready");
    }
  } catch (err) {
    console.error("❌ Email verification crashed:", err.message);
  }
});