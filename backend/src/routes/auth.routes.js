import { Router } from "express";
import asyncH from "express-async-handler";
import { login, logout, me, loginSchema } from "../controllers/auth.controller.js";
import { validate } from "../utils/validate.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.post("/login", validate(loginSchema), asyncH(login));
r.post("/logout", asyncH(logout));
r.get("/me", requireAuth, asyncH(me));
export default r;