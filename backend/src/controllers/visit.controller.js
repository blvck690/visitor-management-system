import { z } from "zod";
import { prisma } from "../config/db.js";
import { sendMail } from "../services/email.service.js";
import { pushNotification, broadcast } from "../services/notification.service.js";
import { approvalEmail } from "../emails/templates.js";

/* =========================
   REQUEST VALIDATION SCHEMA
========================= */
export const visitRequestSchema = z.object({
  visitor: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    company: z.string().optional(),
    disability: z.boolean().optional().default(false),
    disabilityNote: z.string().optional(),
  }),
  hostId: z.string(),
  purpose: z.string().min(3),
  visitDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  numberOfVisitors: z.number().int().min(1).max(50).default(1),
  resourceIds: z.array(z.string()).optional().default([]),
});

/* =========================
   MAIN REQUEST CONTROLLER
========================= */
export const requestVisit = async (req, res) => {
  const body = req.body;


  // ==============================
  // VISITOR CREATE / UPDATE (SAFE)
  // ==============================
  const visitorData = {
    name: body.visitor.name,
    email: body.visitor.email,
    phone: body.visitor.phone,
    company: body.visitor.company,
    disability: body.visitor.disability ?? false,
    disabilityNote: body.visitor.disabilityNote,
  };

  const existingVisitor = await prisma.visitor.findFirst({
    where: { email: visitorData.email },
  });

  const visitor = existingVisitor
    ? await prisma.visitor.update({
        where: { id: existingVisitor.id },
        data: visitorData,
      })
    : await prisma.visitor.create({
        data: visitorData,
      });

  // ==============================
  // HOST VALIDATION
  // ==============================
  const host = await prisma.user.findUnique({
    where: { id: body.hostId },
  });

  if (!host) {
    return res.status(400).json({ error: "Invalid host" });
  }

  const start = new Date(body.startTime);
  const end = new Date(body.endTime);

  // ==============================
  // RESOURCE CONFLICT CHECK
  // ==============================
  if (body.resourceIds?.length) {
    const conflicts = await prisma.resourceBooking.findMany({
      where: {
        resourceId: { in: body.resourceIds },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
      include: { resource: true },
    });

    if (conflicts.length) {
      return res.status(409).json({
        error: "Resource conflict",
        conflicts: conflicts.map((c) => c.resource.name),
      });
    }
  }

  // ==============================
  // CREATE VISIT
  // ==============================
  const visit = await prisma.visit.create({
    data: {
      visitorId: visitor.id,
      hostId: host.id,
      purpose: body.purpose,
      visitDate: new Date(body.visitDate),
      startTime: start,
      endTime: end,
      numberOfVisitors: body.numberOfVisitors,
      bookings: body.resourceIds?.length
        ? {
            create: body.resourceIds.map((rid) => ({
              resourceId: rid,
              startTime: start,
              endTime: end,
            })),
          }
        : undefined,
    },
    include: {
      visitor: true,
      host: true,
      bookings: { include: { resource: true } },
    },
  });

  // ==============================
  // EMAIL NOTIFICATION
  // ==============================
  const tpl = approvalEmail({
    host,
    visitor,
    visit,
    approveUrl: `${process.env.APP_URL}/approve/${visit.approvalToken}?decision=approve`,
    rejectUrl: `${process.env.APP_URL}/approve/${visit.approvalToken}?decision=reject`,
    holdUrl: `${process.env.APP_URL}/approve/${visit.approvalToken}?decision=hold`,
  });

  await sendMail({
    to: host.email,
    subject: tpl.subject,
    html: tpl.html,
  });

  // ==============================
  // PUSH NOTIFICATION
  // ==============================
  await pushNotification({
    userId: host.id,
    title: "New visit request",
    body: `${visitor.name} — ${body.purpose}`,
    type: "VISIT_REQUEST",
  });

  broadcast("visit:created", { id: visit.id });

  return res.status(201).json(visit);
};

/* =========================
   SHARED INCLUDE
========================= */
const baseInclude = {
  visitor: true,
  host: true,
  bookings: { include: { resource: true } },
};

/* =========================
   LIST VISITS
========================= */
export const listByStatus = (status) => async (_req, res) => {
  const visits = await prisma.visit.findMany({
    where: status ? { status } : undefined,
    include: baseInclude,
    orderBy: { visitDate: "desc" },
    take: 200,
  });
  res.json(visits);
};

/* =========================
   MY VISITS
========================= */
export const myVisits = async (req, res) => {
  const visits = await prisma.visit.findMany({
    where: { hostId: req.user.sub },
    include: baseInclude,
    orderBy: { visitDate: "desc" },
  });
  res.json(visits);
};

/* =========================
   DECISION HANDLER
========================= */
const decide = (status) => async (req, res) => {
  const v = await prisma.visit.update({
    where: { id: req.params.id },
    data: {
      status,
      decisionAt: new Date(),
      decisionNote: req.body?.note,
    },
    include: baseInclude,
  });

  broadcast("visit:updated", { id: v.id, status });

  await pushNotification({
    userId: v.hostId,
    title: `Visit ${status.toLowerCase()}`,
    body: `${v.visitor.name} — ${v.purpose}`,
    type: "VISIT_DECISION",
  });

  res.json(v);
};

export const approve = decide("APPROVED");
export const reject = decide("REJECTED");
export const hold = decide("ON_HOLD");

/* =========================
   CHECK IN / OUT
========================= */
export const checkIn = async (req, res) => {
  const v = await prisma.visit.update({
    where: { id: req.params.id },
    data: {
      status: "CHECKED_IN",
      checkedInAt: new Date(),
    },
    include: baseInclude,
  });

  broadcast("visit:updated", { id: v.id });
  res.json(v);
};

export const checkOut = async (req, res) => {
  const v = await prisma.visit.update({
    where: { id: req.params.id },
    data: {
      status: "CHECKED_OUT",
      checkedOutAt: new Date(),
    },
    include: baseInclude,
  });

  broadcast("visit:updated", { id: v.id });
  res.json(v);
};

/* =========================
   TOKEN DECISION
========================= */
export const decideByToken = async (req, res) => {
  const { token } = req.params;
  const decision = String(req.query.decision || "").toLowerCase();

  const map = {
    approve: "APPROVED",
    reject: "REJECTED",
    hold: "ON_HOLD",
  };

  const status = map[decision];
  if (!status) return res.status(400).json({ error: "Invalid decision" });

  const existing = await prisma.visit.findUnique({
    where: { approvalToken: token },
  });

  if (!existing) {
    return res.status(404).json({ error: "Invalid token" });
  }

  const v = await prisma.visit.update({
    where: { approvalToken: token },
    data: {
      status,
      decisionAt: new Date(),
    },
    include: baseInclude,
  });

  broadcast("visit:updated", { id: v.id, status });

  res.json({ ok: true, visit: v });
};

/* =========================
   GET BY TOKEN
========================= */
export const getByToken = async (req, res) => {
  const v = await prisma.visit.findUnique({
    where: { approvalToken: req.params.token },
    include: baseInclude,
  });

  if (!v) {
    return res.status(404).json({ error: "Invalid token" });
  }

  res.json(v);
};