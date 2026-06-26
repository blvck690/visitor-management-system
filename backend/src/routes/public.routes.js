import { Router } from "express";
import asyncH from "express-async-handler";
import { decideByToken, getByToken } from "../controllers/visit.controller.js";

const r = Router();
// Used by email-link approval pages (no auth, token-based)
r.get("/approval/:token", asyncH(getByToken));
r.post("/approval/:token", asyncH(decideByToken));
export default r;