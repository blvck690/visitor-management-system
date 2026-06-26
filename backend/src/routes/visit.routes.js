import { Router } from "express";
import asyncH from "express-async-handler";
import {
  requestVisit, listByStatus, myVisits, approve, reject, hold,
  checkIn, checkOut, visitRequestSchema,
} from "../controllers/visit.controller.js";
import { validate } from "../utils/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/request", requireRole("RECEPTIONIST","ADMIN"), validate(visitRequestSchema), asyncH(requestVisit));
r.get("/all", asyncH(listByStatus(null)));
r.get("/pending", asyncH(listByStatus("PENDING")));
r.get("/approved", asyncH(listByStatus("APPROVED")));
r.get("/mine", asyncH(myVisits));
r.put("/approve/:id", asyncH(approve));
r.put("/reject/:id", asyncH(reject));
r.put("/hold/:id", asyncH(hold));
r.put("/check-in/:id", requireRole("RECEPTIONIST","ADMIN"), asyncH(checkIn));
r.put("/check-out/:id", requireRole("RECEPTIONIST","ADMIN"), asyncH(checkOut));
export default r;