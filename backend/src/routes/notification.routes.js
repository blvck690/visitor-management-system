import { Router } from "express";
import asyncH from "express-async-handler";
import { listMine, markRead, send } from "../controllers/notification.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.get("/all", asyncH(listMine));
r.put("/:id/read", asyncH(markRead));
r.post("/send", requireRole("ADMIN","RECEPTIONIST"), asyncH(send));
export default r;