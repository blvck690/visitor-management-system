import { prisma } from "../config/db.js";

export const list = async (_req, res) => {
  const r = await prisma.resource.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  res.json(r);
};

export const availability = async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: "start & end required (ISO)" });
  const s = new Date(start), e = new Date(end);
  const resources = await prisma.resource.findMany({ where: { active: true } });
  const conflicts = await prisma.resourceBooking.findMany({
    where: { AND: [{ startTime: { lt: e } }, { endTime: { gt: s } }] },
    select: { resourceId: true },
  });
  const busy = new Set(conflicts.map((c) => c.resourceId));
  res.json(resources.map((r) => ({ ...r, available: !busy.has(r.id) })));
};

export const reserve = async (req, res) => {
  const { resourceId, visitId, startTime, endTime } = req.body;
  const s = new Date(startTime), e = new Date(endTime);
  const conflict = await prisma.resourceBooking.findFirst({
    where: { resourceId, AND: [{ startTime: { lt: e } }, { endTime: { gt: s } }] },
  });
  if (conflict) return res.status(409).json({ error: "Resource already booked" });
  const b = await prisma.resourceBooking.create({
    data: { resourceId, visitId, startTime: s, endTime: e },
  });
  res.status(201).json(b);
};