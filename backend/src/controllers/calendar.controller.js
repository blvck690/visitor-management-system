import { prisma } from "../config/db.js";

export const events = async (req, res) => {
  const { from, to } = req.query;
  const where = from && to ? { visitDate: { gte: new Date(from), lte: new Date(to) } } : {};
  const visits = await prisma.visit.findMany({
    where,
    include: { visitor: true, host: true, bookings: { include: { resource: true } } },
    orderBy: { startTime: "asc" },
  });
  res.json(visits.map((v) => ({
    id: v.id,
    title: `${v.visitor.name} — ${v.purpose}`,
    start: v.startTime,
    end: v.endTime,
    status: v.status,
    host: v.host.name,
    resources: v.bookings.map((b) => b.resource.name),
  })));
};