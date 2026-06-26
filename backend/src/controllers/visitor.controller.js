import { z } from "zod";
import { prisma } from "../config/db.js";

export const visitorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  company: z.string().optional(),
  disability: z.boolean().optional().default(false),
  disabilityNote: z.string().optional(),
});

export const create = async (req, res) => {
  const v = await prisma.visitor.create({ data: req.body });
  res.status(201).json(v);
};

export const list = async (_req, res) => {
  const v = await prisma.visitor.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  res.json(v);
};

export const getOne = async (req, res) => {
  const v = await prisma.visitor.findUnique({
    where: { id: req.params.id },
    include: { visits: { include: { host: true, bookings: { include: { resource: true } } } } },
  });
  if (!v) return res.status(404).json({ error: "Not found" });
  res.json(v);
};

export const update = async (req, res) => {
  const v = await prisma.visitor.update({ where: { id: req.params.id }, data: req.body });
  res.json(v);
};

export const remove = async (req, res) => {
  await prisma.visitor.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
};