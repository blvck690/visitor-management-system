import { prisma } from "../config/db.js";

let ioRef = null;
export const initSocket = (io) => {
  ioRef = io;
  io.on("connection", (socket) => {
    socket.on("join", (userId) => userId && socket.join(`user:${userId}`));
  });
};

export const pushNotification = async ({ userId, title, body, type = "INFO" }) => {
  const n = await prisma.notification.create({ data: { userId, title, body, type } });
  ioRef?.to(`user:${userId}`).emit("notification", n);
  return n;
};

export const broadcast = (event, payload) => ioRef?.emit(event, payload);