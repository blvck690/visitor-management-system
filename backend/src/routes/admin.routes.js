import { Router } from "express";
import asyncH from "express-async-handler";
import { stats, employees } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.get("/stats", requireRole("ADMIN"), asyncH(stats));
r.get("/employees", asyncH(employees));
export default r;