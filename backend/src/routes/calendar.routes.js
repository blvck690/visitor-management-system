import { Router } from "express";
import asyncH from "express-async-handler";
import { events } from "../controllers/calendar.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.get("/events", asyncH(events));
export default r;