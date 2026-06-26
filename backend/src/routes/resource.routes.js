import { Router } from "express";
import asyncH from "express-async-handler";
import { list, availability, reserve } from "../controllers/resource.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.get("/", asyncH(list));
r.get("/available", asyncH(availability));
r.post("/reserve", asyncH(reserve));
export default r;