import { prisma } from "../config/db.js";
import { pushNotification } from "../services/notification.service.js";

export const listMine = async (req, res) => {
  const n = await prisma.notification.findMany({
    where: { userId: req.user.sub },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(n);
};

export const markRead = async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.sub, id: req.params.id },
    data: { read: true },
  });
  res.json({ ok: true });
};

export const send = async (req, res) => {
  const { userId, title, body, type } = req.body;
  const n = await pushNotification({ userId, title, body, type });
  res.status(201).json(n);
};