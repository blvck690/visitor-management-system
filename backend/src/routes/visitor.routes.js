import { Router } from "express";
import asyncH from "express-async-handler";
import { create, list, getOne, update, remove, visitorSchema } from "../controllers/visitor.controller.js";
import { validate } from "../utils/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/create", requireRole("RECEPTIONIST","ADMIN"), validate(visitorSchema), asyncH(create));
r.get("/all", asyncH(list));
r.get("/:id", asyncH(getOne));
r.put("/update/:id", requireRole("RECEPTIONIST","ADMIN"), asyncH(update));
r.delete("/delete/:id", requireRole("ADMIN"), asyncH(remove));
export default r;