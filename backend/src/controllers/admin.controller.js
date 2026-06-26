import { prisma } from "../config/db.js";

export const stats = async (_req, res) => {
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

  const [employees, visitors, todayVisits, pending, boardroomBookings, equipmentBookings] = await Promise.all([
    prisma.user.count(),
    prisma.visitor.count(),
    prisma.visit.count({ where: { visitDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.visit.count({ where: { status: "PENDING" } }),
    prisma.resourceBooking.count({ where: { resource: { type: "BOARDROOM" } } }),
    prisma.resourceBooking.count({ where: { resource: { type: { in: ["PROJECTOR","HDMI","SMART_TV","WHITEBOARD"] } } } }),
  ]);

  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const monthly = await prisma.visit.groupBy({
    by: ["status"],
    where: { visitDate: { gte: monthStart } },
    _count: { _all: true },
  });

  res.json({ employees, visitors, todayVisits, pending, boardroomBookings, equipmentBookings, monthly });
};

export const employees = async (_req, res) => {
  const u = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: { id: true, name: true, email: true, department: true },
    orderBy: { name: "asc" },
  });
  res.json(u);
};